import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Invoice, PaymentMethod } from '../types';
import { InvoiceModal } from './InvoiceModal';
import {
  Receipt,
  Plus,
  Search,
  FileText,
  Download,
  Euro,
  CheckCircle2,
  Clock,
  Printer,
  Trash2,
  CreditCard,
  Building
} from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const { invoices, addPaymentRecord, deleteInvoice } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Payment modal state
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CB');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.guestName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || inv.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalTurnover = invoices
    .filter(inv => inv.type === 'facture' && inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.totalTTC, 0);

  const totalPendingBalance = invoices
    .filter(inv => inv.type === 'facture' && inv.balanceDue > 0)
    .reduce((sum, inv) => sum + inv.balanceDue, 0);

  const handleExportCsv = () => {
    const headers = ["Numero", "Type", "Date", "Client", "SousTotalHT", "TaxeSejour", "TVATotal", "TotalTTC", "Acompte", "SoldeRestant", "Statut"];
    const rows = invoices.map(inv => [
      inv.number,
      inv.type,
      inv.date,
      `"${inv.guestName}"`,
      inv.subtotal.toFixed(2),
      inv.touristTaxTotal.toFixed(2),
      inv.tvaTotal.toFixed(2),
      inv.totalTTC.toFixed(2),
      inv.depositPaid.toFixed(2),
      inv.balanceDue.toFixed(2),
      inv.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Export_Comptable_Gite_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegisterPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentInvoice || paymentAmount <= 0) return;

    addPaymentRecord({
      date: new Date().toISOString().split('T')[0],
      invoiceId: paymentInvoice.id,
      guestName: paymentInvoice.guestName,
      amount: paymentAmount,
      method: paymentMethod,
      type: paymentAmount >= paymentInvoice.balanceDue ? 'solde' : 'acompte',
      notes: "Encaissement enregistré dans l'application"
    });

    setPaymentInvoice(null);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Title Header - High Density Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#2D3436] text-white p-3.5 rounded-lg shadow-sm border border-stone-800">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Facturation & Devis</h1>
          <p className="text-[11px] text-stone-300 mt-0.5">
            Émettez vos factures et devis, suivez les acomptes, la taxe de séjour et exportez votre comptabilité.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center space-x-1 bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium px-3 py-1.5 rounded text-xs transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Comptable CSV</span>
        </button>
      </div>

      {/* Summary KPI Badges - High Density */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Chiffre d'Affaires Encaissé</span>
            <p className="text-xl font-bold text-emerald-800 font-mono mt-0.5">{totalTurnover.toFixed(2)} €</p>
            <p className="text-[10px] text-stone-400">Factures réglées intégralement</p>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
            <Euro className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Soldes Restants à Percevoir</span>
            <p className="text-xl font-bold text-amber-900 font-mono mt-0.5">{totalPendingBalance.toFixed(2)} €</p>
            <p className="text-[10px] text-stone-400">Acomptes reçus ou factures en attente</p>
          </div>
          <div className="p-2 bg-amber-50 text-amber-900 rounded border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toolbar filters */}
      <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Rechercher par n° de document ou nom client..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#4A6741]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#4A6741] cursor-pointer font-medium"
          >
            <option value="all">Tous les types</option>
            <option value="facture">Factures</option>
            <option value="devis">Devis</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#4A6741] cursor-pointer font-medium"
          >
            <option value="all">Tous les statuts</option>
            <option value="paid">Payée</option>
            <option value="partially_paid">Acompte Versé</option>
            <option value="sent">Envoyée</option>
          </select>
        </div>
      </div>

      {/* Invoices List - High Density */}
      <div className="space-y-2">
        {filteredInvoices.map(inv => (
          <div
            key={inv.id}
            className="bg-white rounded-lg border border-stone-200 p-3 shadow-2xs hover:border-stone-300 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[11px] font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {inv.number}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                  inv.type === 'devis' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                }`}>
                  {inv.type}
                </span>
                <span className="text-[11px] text-stone-500 font-medium">Émise le {inv.date}</span>
              </div>

              <h3 className="font-bold text-xs text-stone-900 mt-1">{inv.guestName}</h3>
              <p className="text-[10px] text-stone-500">{inv.guestEmail || inv.guestAddress}</p>
            </div>

            <div className="flex items-center space-x-4 text-xs text-right">
              <div>
                <span className="text-stone-400 block text-[9px]">TOTAL TTC</span>
                <span className="font-mono font-bold text-stone-900">{inv.totalTTC.toFixed(2)} €</span>
              </div>

              <div>
                <span className="text-stone-400 block text-[9px]">SOLDE DÛ</span>
                <span className={`font-mono font-bold ${inv.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {inv.balanceDue.toFixed(2)} €
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                {inv.balanceDue > 0 && (
                  <button
                    onClick={() => {
                      setPaymentInvoice(inv);
                      setPaymentAmount(inv.balanceDue);
                    }}
                    className="bg-[#4A6741] hover:bg-[#3d5636] text-white text-[11px] font-medium px-2 py-1 rounded transition cursor-pointer"
                  >
                    Encaiser
                  </button>
                )}
                <button
                  onClick={() => setSelectedInvoice(inv)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-medium px-2 py-1 rounded border border-stone-300 transition cursor-pointer flex items-center space-x-1"
                >
                  <FileText className="w-3 h-3 text-stone-600" />
                  <span>Aperçu</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer la document ${inv.number} ?`)) deleteInvoice(inv.id);
                  }}
                  className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INVOICE MODAL VIEWER */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* REGISTER PAYMENT MODAL */}
      {paymentInvoice && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900">Enregistrer un règlement</h3>
              <button onClick={() => setPaymentInvoice(null)} className="text-stone-400 hover:text-stone-600 text-xl font-bold cursor-pointer">×</button>
            </div>

            <p className="text-xs text-stone-600">
              Document : <strong>{paymentInvoice.number}</strong> ({paymentInvoice.guestName})
              <br />
              Solde restant : <strong className="text-rose-700">{paymentInvoice.balanceDue.toFixed(2)} €</strong>
            </p>

            <form onSubmit={handleRegisterPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Montant perçu (€)</label>
                <input
                  type="number"
                  step="0.01"
                  max={paymentInvoice.balanceDue}
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Moyen de paiement</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
                >
                  <option value="CB">Carte Bancaire (CB)</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Virement">Virement bancaire</option>
                  <option value="ANCV">Chèques Vacances ANCV</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setPaymentInvoice(null)}
                  className="px-4 py-2 bg-stone-100 font-semibold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Valider le règlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
