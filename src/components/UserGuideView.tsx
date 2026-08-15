import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  CalendarDays,
  BedDouble,
  UtensilsCrossed,
  Receipt,
  CheckSquare,
  Users,
  Sparkles,
  Smartphone,
  HelpCircle,
  ArrowRight,
  Printer,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ShieldCheck,
  Zap,
  Phone,
  Layers,
  Settings,
  FileText,
  Mail,
  Download
} from 'lucide-react';

interface UserGuideViewProps {
  onNavigate?: (tab: string) => void;
  onOpenNewBooking?: () => void;
  onOpenAiMenu?: () => void;
  onOpenAiEmail?: () => void;
}

export const UserGuideView: React.FC<UserGuideViewProps> = ({
  onNavigate,
  onOpenNewBooking,
  onOpenAiMenu,
  onOpenAiEmail,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('quickstart');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { id: 'quickstart', label: 'Démarrage Rapide', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'bookings', label: 'Réservations & Planning', icon: CalendarDays, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { id: 'rooms', label: 'Chambres & Tarifs', icon: BedDouble, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'table', label: 'Table d\'Hôtes & Repas', icon: UtensilsCrossed, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'invoices', label: 'Facturation & Devis', icon: Receipt, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'housekeeping', label: 'Ménage & Entretien', icon: CheckSquare, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { id: 'guests', label: 'Clients & Allergies', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'ai', label: 'Assistants IA Gemini', icon: Sparkles, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'mobile', label: 'Mobile & Installation', icon: Smartphone, color: 'text-stone-700 bg-stone-100 border-stone-300' },
    { id: 'faq', label: 'Questions Fréquentes (FAQ)', icon: HelpCircle, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  ];

  const faqs = [
    {
      q: "Comment ajouter rapidement une nouvelle réservation ?",
      a: "Cliquez simplement sur le bouton vert '+ Nouvelle Réservation' situé dans la barre supérieure ou dans l'onglet 'Réservations'. Renseignez le nom du client, les dates d'arrivée/départ et la chambre. Le montant total est calculé automatiquement.",
      cat: 'bookings'
    },
    {
      q: "Comment fonctionne la taxe de séjour sur les factures ?",
      a: "Dans 'Paramètres' > 'Fiscalité', vous pouvez définir le montant de la taxe de séjour par adulte et par nuit. Lors de la création d'une facture, cette taxe est calculée automatiquement selon le nombre d'adultes et de nuitées du séjour.",
      cat: 'invoices'
    },
    {
      q: "Comment inscrire des clients à la Table d'Hôtes du soir ?",
      a: "Allez dans l'onglet 'Table d'Hôtes'. Sélectionnez la date du dîner, puis cliquez sur 'Inscrire un convive'. Vous pouvez choisir un client déjà en séjour ou ajouter un convive extérieur, et préciser les éventuelles allergies alimentaires.",
      cat: 'table'
    },
    {
      q: "L'application fonctionne-t-elle sans connexion Internet ?",
      a: "Oui ! L'application est une Progressive Web App (PWA) sécurisée. Elle met en cache vos données localement afin que vous puissiez consulter votre planning et vos fiches clients même en cas de coupure temporaire de réseau.",
      cat: 'mobile'
    },
    {
      q: "Comment imprimer une facture ou un devis pour un client ?",
      a: "Dans l'onglet 'Factures & Devis', ouvrez la facture souhaitée puis cliquez sur le bouton 'Imprimer / PDF' en haut à droite. Le document est mis en page selon les normes comptables avec le logo de votre gîte.",
      cat: 'invoices'
    },
    {
      q: "Comment générer un menu régional avec l'Intelligence Artificielle ?",
      a: "Dans l'onglet 'Table d'Hôtes', cliquez sur le bouton 'Créer Menu avec l'IA'. Indiquez votre région (ex: Provence, Périgord, Bretagne...), la saison et vos envies. L'IA Gemini vous proposera une entrée, un plat et un dessert équilibrés avec accord mets & vins.",
      cat: 'ai'
    },
    {
      q: "Comment installer l'application sur mon smartphone ou tablette ?",
      a: "Sur Android, ouvrez l'application dans Chrome et touchez 'Ajouter à l'écran d'accueil' ou téléchargez l'application depuis le Google Play Store. Sur iPhone/iPad, ouvrez dans Safari, touchez le bouton Partager puis 'Sur l'écran d'accueil'.",
      cat: 'mobile'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2D3436] to-[#3d4547] rounded-xl p-5 sm:p-7 text-white shadow-sm border border-stone-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-[#4A6741] text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Manuel & Assistance Officielle
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
              Guide d'Utilisation de votre Espace Gestion
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Retrouvez toutes les explications, astuces métier et raccourcis pour gérer vos chambres d'hôtes, réservations, repas et facturation avec un maximum d'efficacité.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
              title="Imprimer ce guide ou l'enregistrer en PDF"
            >
              <Printer className="w-4 h-4 text-stone-400" />
              <span>Imprimer le Guide</span>
            </button>
            <a
              href="tel:0681535770"
              className="px-3.5 py-2 rounded-lg bg-[#4A6741] hover:bg-[#3d5636] text-white text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Assistance : 06 81 53 57 70</span>
            </a>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="mt-6 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une fonctionnalité (ex: facture, acompte, ménage, allergie, menu IA...)"
            className="w-full bg-stone-900/90 text-white pl-10 pr-4 py-2.5 rounded-lg border border-stone-600 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-hidden focus:border-emerald-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white px-2 py-0.5"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation Categories */}
        <div className="lg:col-span-1 space-y-1">
          <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-600 font-mono">
            Sommaire des modules
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id && !searchQuery;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#4A6741] text-white font-semibold shadow-xs'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Support Card */}
          <div className="mt-4 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-stone-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Besoin d'aide ?</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-snug">
              Une question sur la configuration de votre établissement ou une évolution souhaitée ?
            </p>
            <div className="pt-1 text-[11px] font-semibold text-emerald-900">
              📞 06 81 53 57 70<br />
              <span className="text-[10px] text-stone-500 font-normal">l'escapade de jos</span>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* SEARCH RESULTS VIEW */}
          {searchQuery ? (
            <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Résultats pour « {searchQuery} »</span>
              </h2>

              <div className="space-y-4">
                {faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                  faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                      <h3 className="text-xs font-bold text-stone-900 flex items-center space-x-2">
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item.q}</span>
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed pl-5.5">
                        {item.a}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-stone-500 space-y-2">
                    <HelpCircle className="w-8 h-8 mx-auto text-stone-300" />
                    <p className="text-xs font-medium">Aucun résultat trouvé pour votre recherche.</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-emerald-700 font-bold hover:underline"
                    >
                      Afficher tout le guide
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* 1. DEMARRAGE RAPIDE */}
              {activeCategory === 'quickstart' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                    <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
                      <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-stone-900">Démarrage Rapide : Les 4 étapes fondamentales</h2>
                        <p className="text-xs text-stone-500">Mettez en place votre établissement en moins de 5 minutes</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      {/* Step 1 */}
                      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 relative flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-xs font-bold">1</span>
                            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Configuration</span>
                          </div>
                          <h3 className="text-xs font-bold text-stone-900">Paramétrer vos Chambres</h3>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Allez dans <strong>Chambres</strong> pour vérifier ou ajouter vos hébergements (noms, tarifs par nuit, capacités adultes/enfants).
                          </p>
                        </div>
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('rooms')}
                            className="mt-3 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Gérer les chambres</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Step 2 */}
                      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 relative flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-xs font-bold">2</span>
                            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Planning</span>
                          </div>
                          <h3 className="text-xs font-bold text-stone-900">Créer une Réservation</h3>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Cliquez sur <strong>+ Nouvelle Réservation</strong>. Sélectionnez le client, les dates et la chambre pour bloquer automatiquement les nuitées.
                          </p>
                        </div>
                        {onOpenNewBooking && (
                          <button
                            onClick={onOpenNewBooking}
                            className="mt-3 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>+ Nouvelle réservation</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Step 3 */}
                      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 relative flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-xs font-bold">3</span>
                            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Restauration</span>
                          </div>
                          <h3 className="text-xs font-bold text-stone-900">Organiser la Table d'Hôtes</h3>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Inscrivez les convives pour le dîner du soir et générez un menu personnalisé avec l'aide de l'IA selon la saison.
                          </p>
                        </div>
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('table_dhotes')}
                            className="mt-3 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Voir la Table d'Hôtes</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Step 4 */}
                      <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 relative flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-xs font-bold">4</span>
                            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Facturation</span>
                          </div>
                          <h3 className="text-xs font-bold text-stone-900">Éditer Devis & Factures</h3>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Générez en un clic la facture finale avec le détail des nuitées, repas, suppléments et la taxe de séjour calculée automatiquement.
                          </p>
                        </div>
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('invoices')}
                            className="mt-3 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Voir les Factures</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pro Tip Callout */}
                  <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 flex items-start space-x-3 text-stone-800">
                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-amber-900">Astuce Synchronisation Calendriers (iCal Airbnb, Booking, Abritel) :</p>
                      <p className="text-stone-600 leading-relaxed">
                        Vous pouvez exporter votre planning ou importer vos flux de réservations externes depuis l'onglet <strong>Paramètres</strong> afin d'éviter tout risque de surréservation (double booking).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. RESERVATIONS & PLANNING */}
              {activeCategory === 'bookings' && (
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
                    <div className="p-1.5 bg-sky-100 text-sky-800 rounded-lg">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900">Module Réservations & Planning Interactif</h2>
                      <p className="text-xs text-stone-500">Gestion des séjours, calendrier et suivi des règlements</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                    <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <h3 className="font-bold text-stone-900 text-xs flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Créer et enregistrer une réservation</span>
                      </h3>
                      <p>
                        1. Cliquez sur le bouton vert <strong>+ Nouvelle Réservation</strong>.<br />
                        2. Sélectionnez un client existant ou créez-en un nouveau avec ses coordonnées.<br />
                        3. Choisissez la chambre concernée et les dates de Check-in (arrivée) et Check-out (départ).<br />
                        4. Renseignez le nombre d'adultes et d'enfants. Le tarif de la nuitée et le montant total sont calculés automatiquement.<br />
                        5. Vous pouvez indiquer le montant d'acompte déjà perçu et le canal de provenance (Direct, Téléphone, Airbnb, etc.).
                      </p>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <h3 className="font-bold text-stone-900 text-xs flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Statuts d'une réservation</span>
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-stone-600">
                        <li><strong>Confirmée :</strong> Le séjour est bloqué au planning.</li>
                        <li><strong>Acompte payé :</strong> Un premier versement a été validé.</li>
                        <li><strong>En séjour (Checked-in) :</strong> Les clients sont actuellement présents dans la chambre.</li>
                        <li><strong>Terminée (Checked-out) :</strong> Le séjour est achevé, la chambre bascule automatiquement en statut "Ménage à faire".</li>
                        <li><strong>Annulée :</strong> La chambre est immédiatement libérée pour de nouvelles dates.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. CHAMBRES & TARIFS */}
              {activeCategory === 'rooms' && (
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
                    <div className="p-1.5 bg-indigo-100 text-indigo-800 rounded-lg">
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900">Module Chambres & Tarification Saisonnière</h2>
                      <p className="text-xs text-stone-500">Gestion de la capacité d'accueil et des prix par saison</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                    <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <h3 className="font-bold text-stone-900 text-xs">Configuration des hébergements :</h3>
                      <p>
                        Chaque chambre possède sa fiche détaillée comprenant :
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-stone-600">
                        <li>Le <strong>nom</strong> ou numéro de l'hébergement (ex: Suite Lavande, Chambre Cigale...).</li>
                        <li>La <strong>capacité maximale</strong> (adultes, enfants, surface en m²).</li>
                        <li>Le <strong>tarif de base</strong> par nuit et les variations de saison (Basse, Moyenne, Haute saison et supplément week-end).</li>
                        <li>Les <strong>équipements</strong> (Wi-Fi, Climatisation, Lit King Size, Terrasse, Salle de bain privative...).</li>
                      </ul>
                    </div>

                    <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                      <strong>Statut en temps réel :</strong> Sur le tableau de bord, vous visualisez en un coup d'œil quelles chambres sont <em>Occupées</em>, <em>Disponibles</em> ou <em>En cours de nettoyage</em>.
                    </div>
                  </div>
                </div>
              )}

              {/* 4. TABLE D'HOTES & REPAS */}
              {activeCategory === 'table' && (
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
                    <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900">Module Table d'Hôtes, Dîners & Menus</h2>
                      <p className="text-xs text-stone-500">Suivi des couverts, régimes particuliers et inspiration culinaire</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                    <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <h3 className="font-bold text-stone-900 text-xs">Inscrire des convives au repas :</h3>
                      <p>
                        1. Rendez-vous dans <strong>Table d'Hôtes</strong> et sélectionnez la date souhaitée.<br />
                        2. Cliquez sur <strong>+ Inscrire un convive</strong>.<br />
                        3. Choisissez les hôtes en séjour ou ajoutez des invités extérieurs.<br />
                        4. Précisez le nombre d'adultes et d'enfants. Les montants des repas sont automatiquement ajoutés au compte de la chambre pour la facture de fin de séjour.
                      </p>
                    </div>

                    <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                      <h3 className="font-bold text-amber-900 text-xs flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Gestion des Allergies & Régimes Spéciaux :</span>
                      </h3>
                      <p className="text-stone-700">
                        L'application affiche en rouge clair les alertes d'allergies (sans gluten, arachides, lactose, végétarien...) renseignées sur la fiche du client pour une sécurité totale en cuisine.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. FACTURATION & DEVIS */}
              {activeCategory === 'invoices' && (
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
                    <div className="p-1.5 bg-purple-100 text-purple-800 rounded-lg">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900">Module Factures, Devis & Encaissements</h2>
                      <p className="text-xs text-stone-500">Conformité comptable, taxe de séjour et export PDF</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                    <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <h3 className="font-bold text-stone-900 text-xs">Génération d'une facture de séjour :</h3>
                      <p>
                        À partir d'une réservation, cliquez sur <strong>Éditer la facture</strong>. L'application rassemble automatiquement :
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-stone-600">
                        <li>Le total des nuitées passées.</li>
                        <li>Les repas et petits-déjeuners pris à la table d'hôtes.</li>
                        <li>Les suppléments et prestations annexes (bouteilles de vin, vélos, lit bébé...).</li>
                        <li>La <strong>taxe de séjour</strong> calculée au tarif officiel.</li>
                        <li>La déduction des acomptes déjà perçus et le solde restant dû.</li>
                      </ul>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <h3 className="font-bold text-stone-900 text-xs">Impression & Envoi par e-mail :</h3>
                      <p>
                        Cliquez sur <strong>Imprimer / PDF</strong> pour générer un document officiel prêt à être imprimé ou envoyé directement au client par courriel.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. MENAGE & GOUVERNANCE */}
              {activeCategory === 'housekeeping' && (
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
                    <div className="p-1.5 bg-teal-100 text-teal-800 rounded-lg">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900">Module Gouvernance & Ménage</h2>
                      <p className="text-xs text-stone-500">Organisation de l'entretien et rotations départs/arrivées</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                    <p>
                      Lorsqu'un client quitte la chambre (Check-out), la chambre passe immédiatement en statut <strong>"Ménage à faire"</strong>.
                    </p>
                    <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <h3 className="font-bold text-stone-900 text-xs">Les 3 étapes du cycle de ménage :</h3>
                      <ol className="list-decimal list-inside space-y-1 text-stone-600">
                        <li><strong>À faire :</strong> Détecté dès le départ du voyageur.</li>
                        <li><strong>En cours :</strong> Changement des draps, réapprovisionnement produits d'accueil.</li>
                        <li><strong>Terminé & Prêt :</strong> La chambre redevient immédiatement disponible pour la prochaine arrivée.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. CLIENTS & ALLERGIES */}
              {activeCategory === 'guests' && (
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
                    <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900">Fichier Clients & Préférences</h2>
                      <p className="text-xs text-stone-500">Historique, fidélisation et notes personnalisées</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                    <p>
                      Chaque fiche client conserve l'historique complet de ses séjours passés, son chiffre d'affaires cumulé et ses préférences particulières (ex: chambre au calme, oreiller supplémentaire, anniversaire...).
                    </p>
                    <div className="p-3.5 bg-blue-50 rounded-lg border border-blue-200 text-blue-900">
                      <strong>Export et sauvegarde :</strong> Vous pouvez exporter votre fichier clients au format CSV à tout moment pour vos campagnes d'e-mailing ou vos vœux de fin d'année.
                    </div>
                  </div>
                </div>
              )}

              {/* 8. ASSISTANTS IA GEMINI */}
              {activeCategory === 'ai' && (
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
                    <div className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900">Assistants Intelligents Gemini</h2>
                      <p className="text-xs text-stone-500">IA Cuisinier & Concierge pour vous faire gagner un temps précieux</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <h3 className="font-bold text-stone-900 text-xs flex items-center space-x-1.5">
                        <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                        <span>Générateur de Menus Régionaux</span>
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        L'IA Chef compose pour vous des propositions de menus 3 services (Entrée, Plat, Dessert) adaptés aux produits de saison de votre région et aux allergies de vos convives.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <h3 className="font-bold text-stone-900 text-xs flex items-center space-x-1.5">
                        <Mail className="w-4 h-4 text-amber-600" />
                        <span>Rédacteur d'E-mails & Concierge</span>
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Rédigez en quelques secondes des e-mails personnalisés et chaleureux : confirmation de réservation, livret d'accueil, consignes d'arrivée ou message de remerciement après départ.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. MOBILE & INSTALLATION */}
              {activeCategory === 'mobile' && (
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
                    <div className="p-1.5 bg-stone-100 text-stone-800 rounded-lg">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900">Installation sur Smartphone, Tablette & PC</h2>
                      <p className="text-xs text-stone-500">Utilisation fluide avec icône dédiée sur votre écran d'accueil</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                    <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <h3 className="font-bold text-stone-900 text-xs">Sur Android (Google Play Store ou Chrome) :</h3>
                      <p>
                        1. Ouvrez l'application dans votre navigateur Google Chrome.<br />
                        2. Touchez le menu (3 petits points en haut à droite).<br />
                        3. Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.<br />
                        4. L'icône <em>Gîte Manager</em> s'installe directement aux côtés de vos autres applications !
                      </p>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <h3 className="font-bold text-stone-900 text-xs">Sur iPhone et iPad (Apple iOS Safari) :</h3>
                      <p>
                        1. Ouvrez l'application dans le navigateur <strong>Safari</strong>.<br />
                        2. Touchez l'icône de <strong>Partage</strong> (carré avec une flèche vers le haut en bas de l'écran).<br />
                        3. Faites défiler et appuyez sur <strong>« Sur l'écran d'accueil »</strong>.<br />
                        4. Cliquez sur <strong>« Ajouter »</strong> en haut à droite.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 10. FAQ */}
              {activeCategory === 'faq' && (
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
                    <div className="p-1.5 bg-orange-100 text-orange-800 rounded-lg">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900">Questions Fréquemment Posées (FAQ)</h2>
                      <p className="text-xs text-stone-500">Les réponses directes aux interrogations courantes</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {faqs.map((faq, idx) => {
                      const isExpanded = expandedFaq === idx;
                      return (
                        <div
                          key={idx}
                          className="border border-stone-200 rounded-lg overflow-hidden transition"
                        >
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                            className="w-full p-3.5 text-left bg-stone-50 hover:bg-stone-100/80 flex items-center justify-between transition cursor-pointer text-xs font-bold text-stone-900"
                          >
                            <span className="flex items-center space-x-2">
                              <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{faq.q}</span>
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="p-3.5 bg-white border-t border-stone-100 text-xs text-stone-600 leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
