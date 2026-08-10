import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { BookingSource, BookingStatus } from '../types';
import {
  Upload,
  FileSpreadsheet,
  Check,
  AlertTriangle,
  X,
  FileText,
  Copy,
  Download,
  Info,
  Sparkles,
  BedDouble,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedRow {
  id: string;
  selected: boolean;
  date: string;
  checkIn: string;
  checkOut: string;
  lastName: string;
  firstName: string;
  totalNights: number;
  adults: number;
  children: number;
  animal: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
  roomRawName: string;
  matchedRoomId: string;
  matchedRoomName: string;
  otherNotes: string;
  totalAmount: number;
  organisme: string;
  bookingSource: BookingSource;
  bookingNumber: string;
  touristTax: number;
  operatorFees: number;
  payoutNet: number;
  status: 'valid' | 'warning' | 'error';
  statusMessage?: string;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose }) => {
  const { rooms, batchImportBookingsAndGuests } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [rawText, setRawText] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [step, setStep] = useState<'input' | 'preview' | 'success'>('input');
  const [importSummary, setImportSummary] = useState<{ bookingsCount: number; guestsCount: number } | null>(null);
  const [copyNotice, setCopyNotice] = useState(false);

  if (!isOpen) return null;

  // Helper date parsing (French DD/MM/YYYY or YYYY-MM-DD or DD-MM-YYYY)
  const parseFrenchDate = (dateStr: string): string => {
    if (!dateStr || !dateStr.trim()) return '';
    const clean = dateStr.trim();

    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

    // DD/MM/YYYY or DD.MM.YYYY or DD-MM-YYYY
    const parts = clean.split(/[\/\.\-]/);
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10);
      let year = parseInt(parts[2], 10);

      // Handle 2-digit year (e.g., 26 -> 2026)
      if (year < 100) year += 2000;

      // Swap if year was first (YYYY/MM/DD)
      if (parseInt(parts[0], 10) > 1000) {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        day = parseInt(parts[2], 10);
      }

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const mStr = month < 10 ? `0${month}` : `${month}`;
        const dStr = day < 10 ? `0${day}` : `${day}`;
        return `${year}-${mStr}-${dStr}`;
      }
    }
    return '';
  };

  // Helper number parser (e.g. "650,50 €" -> 650.50)
  const parseCurrency = (val: string): number => {
    if (!val) return 0;
    const clean = val.replace(/[^0-9,\.-]/g, '').replace(',', '.');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  // Organisme to BookingSource
  const mapSource = (str: string): BookingSource => {
    const s = (str || '').toLowerCase();
    if (s.includes('airbnb')) return 'airbnb';
    if (s.includes('booking')) return 'booking.com';
    if (s.includes('abritel') || s.includes('vrbo') || s.includes('homeway')) return 'abritel';
    if (s.includes('direct') || s.includes('site') || s.includes('web')) return 'direct';
    return 'phone';
  };

  // Find matching room
  const matchRoom = (rawRoomName: string) => {
    if (!rawRoomName) return rooms[0] || { id: 'room-1', name: 'Chambre 1' };
    const cleanRaw = rawRoomName.toLowerCase().trim();
    const found = rooms.find(r =>
      r.name.toLowerCase().includes(cleanRaw) ||
      cleanRaw.includes(r.name.toLowerCase()) ||
      r.id.toLowerCase() === cleanRaw
    );
    return found || rooms[0] || { id: 'room-1', name: 'Chambre 1' };
  };

  // Core parser for CSV or TSV string
  const processCsvText = (text: string) => {
    if (!text || !text.trim()) return;

    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return;

    // Detect delimiter: tab (\t), semicolon (;), or comma (,)
    const firstLine = lines[0];
    let delimiter = '\t';
    if (firstLine.includes('\t')) delimiter = '\t';
    else if (firstLine.includes(';')) delimiter = ';';
    else if (firstLine.includes(',')) delimiter = ',';

    // Helper line splitter respecting quoted values
    const splitLine = (line: string): string[] => {
      if (delimiter === '\t') return line.split('\t').map(s => s.trim().replace(/^"|"$/g, ''));
      
      const regex = new RegExp(`(?:^|${delimiter})(?:"([^"]*)"|([^"${delimiter}]*))`, 'g');
      const matches: string[] = [];
      let match;
      while ((match = regex.exec(line)) !== null) {
        matches.push((match[1] || match[2] || '').trim());
      }
      return matches.length > 0 ? matches : line.split(delimiter).map(s => s.trim().replace(/^"|"$/g, ''));
    };

    const headers = splitLine(lines[0]).map(h =>
      h.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
    );

    // Header index mappings
    const getIndex = (possibleNames: string[]) => {
      return headers.findIndex(h =>
        possibleNames.some(p => h.includes(p.toUpperCase()))
      );
    };

    const idxDate = getIndex(['DATE']);
    const idxDe = getIndex(['DE', 'DU', 'ARRIVEE', 'CHECKIN']);
    const idxA = getIndex(['A', 'AU', 'DEPART', 'CHECKOUT']);
    const idxNom = getIndex(['NOM']);
    const idxPrenom = getIndex(['PRENOM']);
    const idxNbJours = getIndex(['NB JOURS', 'JOURS', 'NUITS', 'NB JOUR']);
    const idxAdultes = getIndex(['ADULTES', 'ADULTE']);
    const idxEnfs = getIndex(['ENFS', 'ENFANTS', 'ENFANT']);
    const idxAnimal = getIndex(['ANIMAL', 'ANIMAUX']);
    const idxAdresse = getIndex(['ADRESSE']);
    const idxCodePostal = getIndex(['CODE POSTAL', 'CP', 'POSTAL']);
    const idxVille = getIndex(['VILLE']);
    const idxEmail = getIndex(['EMAIL', 'E-MAIL', 'MEL']);
    const idxTel = getIndex(['TEL', 'TELEPHONE', 'PORTABLE', 'MOBILE']);
    const idxChambres1 = getIndex(['CHAMBRES', 'CHAMBRE', 'LOGEMENT']);
    const idxAutres = getIndex(['AUTRES', 'NOTES', 'REMARQUES', 'COMMENTAIRE']);
    const idxTotal = getIndex(['TOTAL', 'MONTANT', 'PRIX']);
    const idxOrganisme = getIndex(['ORGANISME', 'SOURCE', 'CANAL']);
    const idxNumero = getIndex(['NUMERO', 'NUM', 'REF', 'REFERENCE']);
    const idxTaxe = getIndex(['TAXE SEJOUR', 'TAXE', 'TAXE DE SEJOUR']);
    const idxFrais = getIndex(['FRAIS OPERATEUR', 'FRAIS', 'COMMISSION']);
    const idxVirement = getIndex(['VIREMENT BOOKING', 'VIREMENT', 'NET']);

    const rowsToProcess = (headers.length > 0 && idxNom !== -1) ? lines.slice(1) : lines;

    const rows: ParsedRow[] = rowsToProcess.map((line, index) => {
      const cols = splitLine(line);
      if (cols.length === 0 || cols.every(c => c === '')) return null;

      const getValue = (idx: number) => (idx !== -1 && cols[idx] !== undefined ? cols[idx].trim() : '');

      const date = parseFrenchDate(getValue(idxDate));
      const checkIn = parseFrenchDate(getValue(idxDe)) || new Date().toISOString().split('T')[0];
      let checkOut = parseFrenchDate(getValue(idxA));

      const lastName = getValue(idxNom) || `Client #${index + 1}`;
      const firstName = getValue(idxPrenom) || '';

      let nights = parseInt(getValue(idxNbJours), 10) || 0;
      if (!checkOut && checkIn && nights > 0) {
        const d = new Date(checkIn);
        d.setDate(d.getDate() + nights);
        checkOut = d.toISOString().split('T')[0];
      } else if (!checkOut && checkIn) {
        const d = new Date(checkIn);
        d.setDate(d.getDate() + 1);
        checkOut = d.toISOString().split('T')[0];
        nights = 1;
      } else if (checkIn && checkOut && nights === 0) {
        const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
        nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      }

      const adults = parseInt(getValue(idxAdultes), 10) || 1;
      const children = parseInt(getValue(idxEnfs), 10) || 0;
      const animal = getValue(idxAnimal);
      const address = getValue(idxAdresse);
      const postalCode = getValue(idxCodePostal);
      const city = getValue(idxVille);
      const email = getValue(idxEmail);
      const phone = getValue(idxTel);

      const rawRoomName = getValue(idxChambres1);
      const matched = matchRoom(rawRoomName);

      const otherNotes = getValue(idxAutres);
      const totalAmount = parseCurrency(getValue(idxTotal));
      const organismeStr = getValue(idxOrganisme);
      const bookingSource = mapSource(organismeStr);
      const bookingNumber = getValue(idxNumero) || `RES-${Math.floor(1000 + Math.random() * 9000)}`;
      const touristTax = parseCurrency(getValue(idxTaxe));
      const operatorFees = parseCurrency(getValue(idxFrais));
      const payoutNet = parseCurrency(getValue(idxVirement));

      let status: 'valid' | 'warning' | 'error' = 'valid';
      let statusMessage = 'Prêt à être importé';

      if (!lastName) {
        status = 'warning';
        statusMessage = 'Nom absent (nom généré)';
      } else if (totalAmount <= 0) {
        status = 'warning';
        statusMessage = 'Montant total à 0 €';
      }

      return {
        id: `row-${index}-${Date.now()}`,
        selected: true,
        date,
        checkIn,
        checkOut: checkOut || checkIn,
        lastName,
        firstName,
        totalNights: nights,
        adults,
        children,
        animal,
        address,
        postalCode,
        city,
        email,
        phone,
        roomRawName: rawRoomName,
        matchedRoomId: matched.id,
        matchedRoomName: matched.name,
        otherNotes,
        totalAmount,
        organisme: organismeStr || 'Direct',
        bookingSource,
        bookingNumber,
        touristTax,
        operatorFees,
        payoutNet,
        status,
        statusMessage
      } as ParsedRow;
    }).filter((r): r is ParsedRow => r !== null);

    setParsedRows(rows);
    setStep('preview');
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        processCsvText(content);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Handle manual paste submit
  const handlePasteSubmit = () => {
    if (!rawText.trim()) return;
    processCsvText(rawText);
  };

  // Toggle row selection
  const toggleRowSelect = (id: string) => {
    setParsedRows(prev =>
      prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r)
    );
  };

  // Toggle all rows selection
  const toggleAllSelect = (val: boolean) => {
    setParsedRows(prev => prev.map(r => ({ ...r, selected: val })));
  };

  // Change room assignment for row
  const changeRowRoom = (rowId: string, newRoomId: string) => {
    const rObj = rooms.find(r => r.id === newRoomId);
    if (!rObj) return;
    setParsedRows(prev =>
      prev.map(r => r.id === rowId ? { ...r, matchedRoomId: rObj.id, matchedRoomName: rObj.name } : r)
    );
  };

  // Execute Batch Import into AppContext
  const executeImport = () => {
    const selectedRows = parsedRows.filter(r => r.selected);
    if (selectedRows.length === 0) return;

    const itemsToImport = selectedRows.map(r => {
      let combinedNotes = r.otherNotes;
      if (r.animal) {
        combinedNotes = `Animal: ${r.animal}${combinedNotes ? ' | ' + combinedNotes : ''}`;
      }
      if (r.operatorFees > 0) {
        combinedNotes += ` | Frais opérateur: ${r.operatorFees.toFixed(2)}€`;
      }
      if (r.payoutNet > 0) {
        combinedNotes += ` | Virement net: ${r.payoutNet.toFixed(2)}€`;
      }

      const nightlyRate = r.totalNights > 0 ? Math.round(r.totalAmount / r.totalNights) : r.totalAmount;

      return {
        guestData: {
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
          phone: r.phone,
          address: r.address,
          city: r.city,
          country: 'France',
          dietaryPreferences: [],
          allergies: [],
          privateNotes: r.postalCode ? `Code postal: ${r.postalCode}` : '',
          vipTag: false
        },
        bookingData: {
          bookingNumber: r.bookingNumber,
          guestId: '',
          guestName: `${r.firstName} ${r.lastName}`.trim(),
          roomId: r.matchedRoomId,
          roomName: r.matchedRoomName,
          checkIn: r.checkIn,
          checkOut: r.checkOut,
          numberOfAdults: r.adults,
          numberOfChildren: r.children,
          status: 'confirmed' as BookingStatus,
          source: r.bookingSource,
          nightlyRate,
          totalNights: r.totalNights,
          totalRoomAmount: r.totalAmount,
          touristTaxAmount: r.touristTax || Math.round(r.adults * r.totalNights * 0.77 * 100) / 100,
          tableDhotesOption: false,
          tableDhotesMealsCount: 0,
          tableDhotesTotal: 0,
          extrasTotal: 0,
          totalAmount: r.totalAmount,
          depositPaid: r.payoutNet > 0 ? r.payoutNet : Math.round(r.totalAmount * 0.3),
          balanceDue: Math.max(0, r.totalAmount - (r.payoutNet > 0 ? r.payoutNet : Math.round(r.totalAmount * 0.3))),
          notes: combinedNotes,
          specialRequests: r.organisme ? `Organisme / Canal: ${r.organisme}` : ''
        }
      };
    });

    const res = batchImportBookingsAndGuests(itemsToImport);
    setImportSummary({ bookingsCount: res.importedBookingsCount, guestsCount: res.importedGuestsCount });
    setStep('success');
  };

  // Sample CSV Template Download / Copy
  const SAMPLE_CSV = `DATE\tDE\tA\tNOM\tPRENOM\tnb jours\tAdultes\tENFS\tANIMAL\tADRESSE\tCODE POSTAL\tVille\tEMAIL\tTEL\tCHAMBRES\tAUTRES\tTOTAL\tORGANISME\tNUMERO\tTAXE SEJOUR 0,77€\tCHAMBRE\tFRAIS OPERATEUR\tVIREMENT BOOKING
01/08/2026\t10/08/2026\t15/08/2026\tDupont\tJean\t5\t2\t0\t1 chien\t12 Rue de la Paix\t75002\tParis\tjean.dupont@gmail.com\t0612345678\tChambre Lavande\tArrivée tardive prévus à 20h\t650,00 €\tBooking.com\tRES-9821\t7,70 €\tChambre Lavande\t97,50 €\t552,50 €
02/08/2026\t18/08/2026\t21/08/2026\tMartin\tSophie\t3\t2\t1\tNon\t45 Avenue des Fleurs\t13008\tMarseille\tsophie.martin@yahoo.fr\t0698765432\tLe Pigeonnier\tLit bébé demandé\t420,00 €\tAirbnb\tRES-4412\t4,62 €\tLe Pigeonnier\t63,00 €\t357,00 €`;

  const copySampleTemplate = () => {
    navigator.clipboard.writeText(SAMPLE_CSV);
    setCopyNotice(true);
    setTimeout(() => setCopyNotice(false), 3000);
  };

  const downloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV.replace(/\t/g, ';')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'modele_importation_reservations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedCount = parsedRows.filter(r => r.selected).length;
  const totalImportRevenue = parsedRows.filter(r => r.selected).reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded-xl border border-amber-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif tracking-tight text-white flex items-center gap-2">
                Importation de Réservations (CSV / Excel)
              </h2>
              <p className="text-xs text-stone-300">
                Importez vos fichiers d'export Excel, Booking.com, Airbnb ou copiez-collez vos données brutes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">

          {step === 'input' && (
            <div className="space-y-5">

              {/* Notice Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start space-x-3">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-900">Format de colonnes compatible :</p>
                  <p className="text-amber-800 leading-relaxed">
                    Votre fichier CSV ou copier-coller peut comporter les colonnes suivantes :
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1 font-mono text-[10px] bg-amber-100/70 p-2 rounded-lg text-amber-950 font-bold border border-amber-200">
                    <span>DATE</span> • <span>DE</span> • <span>A</span> • <span>NOM</span> • <span>PRENOM</span> • <span>nb jours</span> • <span>Adultes</span> • <span>ENFS</span> • <span>ANIMAL</span> • <span>ADRESSE</span> • <span>CODE POSTAL</span> • <span>Ville</span> • <span>EMAIL</span> • <span>TEL</span> • <span>CHAMBRES</span> • <span>AUTRES</span> • <span>TOTAL</span> • <span>ORGANISME</span> • <span>NUMERO</span> • <span>TAXE SEJOUR</span> • <span>FRAIS OPERATEUR</span> • <span>VIREMENT BOOKING</span>
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/40 transition rounded-2xl p-6 text-center cursor-pointer group flex flex-col items-center justify-center space-y-2"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv, .tsv, .txt, .xlsx, .xls"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="p-3 bg-white rounded-full shadow-xs border border-stone-200 group-hover:scale-110 transition duration-200">
                  <Upload className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">
                    Cliquez ici ou glissez votre fichier (.csv, .txt, .tsv)
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Séparateurs auto-détectés (Virgule, Point-virgule ou Tabulation Excel)
                  </p>
                </div>
              </div>

              {/* Direct Paste Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-stone-500" />
                    <span>Ou collez directement les lignes (Copier / Coller depuis Excel ou Google Sheets) :</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={copySampleTemplate}
                      className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md transition cursor-pointer flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copyNotice ? 'Copié !' : 'Copier modèle'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={downloadSampleCsv}
                      className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-md transition cursor-pointer flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Télécharger modèle CSV</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  placeholder={`DATE\tDE\tA\tNOM\tPRENOM\tnb jours\tAdultes\tENFS\tANIMAL\tADRESSE\tCODE POSTAL\tVille\tEMAIL\tTEL\tCHAMBRES\tAUTRES\tTOTAL\tORGANISME\tNUMERO\tTAXE SEJOUR\n01/08/2026\t10/08/2026\t15/08/2026\tDupont\tJean\t5\t2\t0\t1 chien\t12 Rue de la Paix\t75002\tParis\tjean.dupont@gmail.com\t0612345678\tChambre Lavande\tArrivée 20h\t650,00 €\tBooking.com\tRES-9821\t7,70 €`}
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  className="w-full p-3 font-mono text-[11px] bg-stone-900 text-amber-300 rounded-xl border border-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!rawText.trim()}
                  onClick={handlePasteSubmit}
                  className="flex items-center space-x-2 bg-[#4A6741] hover:bg-[#3d5636] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl transition cursor-pointer text-xs shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Analyser les données ({rawText.split('\n').filter(l => l.trim()).length > 1 ? rawText.split('\n').filter(l => l.trim()).length - 1 : 0} lignes décelées)</span>
                </button>
              </div>

            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">

              {/* Summary Bar */}
              <div className="bg-stone-900 text-white p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span><strong>{selectedCount}</strong> / {parsedRows.length} réservations sélectionnées</span>
                  </div>
                  <div className="text-stone-300">
                    Chiffre d'affaires importé : <strong className="text-amber-400 font-bold">{totalImportRevenue.toFixed(2)} €</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => toggleAllSelect(true)}
                    className="text-[11px] font-semibold text-stone-300 hover:text-white underline cursor-pointer"
                  >
                    Tout cocher
                  </button>
                  <span className="text-stone-600">•</span>
                  <button
                    type="button"
                    onClick={() => toggleAllSelect(false)}
                    className="text-[11px] font-semibold text-stone-300 hover:text-white underline cursor-pointer"
                  >
                    Tout décocher
                  </button>
                  <span className="text-stone-600">•</span>
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    Recommencer
                  </button>
                </div>
              </div>

              {/* Preview Grid Table */}
              <div className="overflow-x-auto rounded-xl border border-stone-200 max-h-96">
                <table className="w-full text-left text-[11px] text-stone-800">
                  <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider text-[10px] sticky top-0 border-b border-stone-200">
                    <tr>
                      <th className="p-2.5 text-center w-10">Importer</th>
                      <th className="p-2.5">Arrivée / Départ</th>
                      <th className="p-2.5">Client (Nom Prénom)</th>
                      <th className="p-2.5">Chambre attribuée</th>
                      <th className="p-2.5 text-center">Nuits</th>
                      <th className="p-2.5 text-center">Pers.</th>
                      <th className="p-2.5">Organisme</th>
                      <th className="p-2.5 text-right">Montant</th>
                      <th className="p-2.5 text-right">Nº Résa</th>
                      <th className="p-2.5 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {parsedRows.map((row) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-stone-50 transition ${!row.selected ? 'opacity-40 bg-stone-50' : ''}`}
                      >
                        <td className="p-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={() => toggleRowSelect(row.id)}
                            className="w-4 h-4 rounded text-[#4A6741] focus:ring-[#4A6741] cursor-pointer"
                          />
                        </td>
                        <td className="p-2.5 font-medium whitespace-nowrap">
                          <span className="text-emerald-800 font-semibold">{row.checkIn}</span>
                          <span className="text-stone-400 mx-1">→</span>
                          <span className="text-stone-600">{row.checkOut}</span>
                        </td>
                        <td className="p-2.5">
                          <div className="font-bold text-stone-900">{row.lastName} {row.firstName}</div>
                          <div className="text-[10px] text-stone-500">{row.email || row.phone || row.city || 'Pas de contact'}</div>
                        </td>
                        <td className="p-2.5">
                          <select
                            value={row.matchedRoomId}
                            onChange={e => changeRowRoom(row.id, e.target.value)}
                            className="p-1 bg-stone-50 border border-stone-300 rounded font-bold text-stone-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            {rooms.map(r => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                          {row.roomRawName && row.roomRawName !== row.matchedRoomName && (
                            <div className="text-[9px] text-stone-400 italic">Extrait: "{row.roomRawName}"</div>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-bold text-stone-700">
                          {row.totalNights} n.
                        </td>
                        <td className="p-2.5 text-center text-stone-600">
                          {row.adults} ad.{row.children > 0 ? ` + ${row.children} enf.` : ''}
                        </td>
                        <td className="p-2.5">
                          <span className="inline-block px-2 py-0.5 rounded font-semibold bg-stone-100 text-stone-800 text-[10px] border border-stone-200">
                            {row.organisme || row.bookingSource}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-extrabold text-stone-900 whitespace-nowrap">
                          {row.totalAmount.toFixed(2)} €
                        </td>
                        <td className="p-2.5 text-right font-mono text-[10px] text-stone-500">
                          {row.bookingNumber}
                        </td>
                        <td className="p-2.5 text-center">
                          {row.status === 'valid' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                              <Check className="w-3 h-3" /> OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-200" title={row.statusMessage}>
                              <AlertTriangle className="w-3 h-3 text-amber-600" /> Note
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Retour à la saisie
                </button>

                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={executeImport}
                  className="flex items-center space-x-2 bg-[#4A6741] hover:bg-[#3d5636] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition cursor-pointer text-xs shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Valider l'importation de {selectedCount} réservation(s)</span>
                </button>
              </div>

            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-serif text-stone-900">
                  Importation Réussie !
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  <strong>{importSummary?.bookingsCount}</strong> réservation(s) et <strong>{importSummary?.guestsCount}</strong> nouveau(x) fiche(s) client ont été ajoutées avec succès à votre hébergement.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
                >
                  Fermer et voir les réservations
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
