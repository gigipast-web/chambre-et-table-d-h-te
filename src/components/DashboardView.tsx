import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BedDouble,
  LogIn,
  LogOut,
  Utensils,
  Euro,
  Clock,
  Plus,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  CalendarDays,
  Users,
  FileText,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  onOpenNewBooking?: () => void;
  onOpenAiMenu?: () => void;
  onOpenNewGuest?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  setActiveTab,
  onOpenNewBooking,
  onOpenAiMenu,
  onOpenNewGuest
}) => {
  const handleNavigate = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    if (setActiveTab) setActiveTab(tab);
  };

  const { rooms, bookings, dailyMeals, payments, housekeeping } = useApp();

  const todayStr = "2026-08-04";

  // Metrics calculation
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const occupancyPercentage = Math.round((occupiedRooms / (totalRooms || 1)) * 100);

  // Arrivals & Departures
  const todayArrivals = bookings.filter(b => b.checkIn === todayStr);
  const todayDepartures = bookings.filter(b => b.checkOut === todayStr);

  // Table d'Hôtes tonight
  const todayMeal = dailyMeals.find(m => m.date === todayStr);
  let totalAdultsTonight = 0;
  let totalChildrenTonight = 0;
  const allergyList: string[] = [];

  if (todayMeal) {
    todayMeal.guestRegistrations.forEach(r => {
      totalAdultsTonight += r.adults;
      totalChildrenTonight += r.children;
      if (r.allergiesNote) {
        allergyList.push(`${r.guestName}: ${r.allergiesNote}`);
      }
    });
  }

  // Today's total payments/revenue
  const todayPayments = payments.filter(p => p.date === todayStr);
  const todayRevenue = todayPayments.reduce((sum, p) => sum + p.amount, 0) || 485;

  return (
    <div className="space-y-4 pb-8">
      {/* Welcome & Quick Action Header - High Density Banner */}
      <div className="bg-[#2D3436] text-stone-100 p-4 sm:p-5 rounded-lg shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-stone-400 text-xs font-mono font-medium uppercase tracking-wider mb-0.5">
            <span>Aujourd'hui</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Mardi 4 Août 2026</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Bonjour Sophie & Marc
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Voici le résumé quotidien de votre maison d'hôtes et de votre table d'hôtes ce soir.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenNewBooking && (
            <button
              onClick={onOpenNewBooking}
              className="flex items-center space-x-1 bg-[#4A6741] hover:bg-[#3d5636] text-white px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle Réservation</span>
            </button>
          )}

          <button
            onClick={() => handleNavigate('table_dhotes')}
            className="flex items-center space-x-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded text-xs font-medium border border-stone-700 transition cursor-pointer"
          >
            <Utensils className="w-3.5 h-3.5 text-emerald-400" />
            <span>Table ce soir ({totalAdultsTonight + totalChildrenTonight})</span>
          </button>

          {onOpenAiMenu && (
            <button
              onClick={onOpenAiMenu}
              className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Menu IA du jour</span>
            </button>
          )}
        </div>
      </div>

      {/* Main KPI Grid - High Density layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1: Chambres occupées */}
        <div
          onClick={() => handleNavigate('rooms')}
          className="bg-white p-3.5 rounded-lg shadow-2xs border border-stone-200 hover:border-stone-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Occupées</span>
            <div className="p-1.5 bg-amber-50 text-amber-800 rounded">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-stone-900">{occupiedRooms}</span>
            <span className="text-xs font-medium text-stone-500">/ {totalRooms}</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#4A6741] h-full rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-stone-500 mt-1 font-mono">Taux: {occupancyPercentage}%</p>
          </div>
        </div>

        {/* Card 2: Arrivées */}
        <div
          onClick={() => handleNavigate('bookings')}
          className="bg-white p-3.5 rounded-lg shadow-2xs border border-stone-200 hover:border-stone-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Arrivées</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded">
              <LogIn className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-stone-900">{todayArrivals.length}</span>
          <div className="mt-1 space-y-0.5">
            {todayArrivals.length > 0 ? (
              todayArrivals.map(a => (
                <p key={a.id} className="text-[11px] text-stone-700 font-medium truncate flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full inline-block"></span>
                  <span className="truncate">{a.guestName}</span>
                </p>
              ))
            ) : (
              <p className="text-[11px] text-stone-400 italic">Aucune arrivée</p>
            )}
          </div>
        </div>

        {/* Card 3: Départs */}
        <div
          onClick={() => handleNavigate('bookings')}
          className="bg-white p-3.5 rounded-lg shadow-2xs border border-stone-200 hover:border-stone-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Départs</span>
            <div className="p-1.5 bg-sky-50 text-sky-800 rounded">
              <LogOut className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-stone-900">{todayDepartures.length}</span>
          <div className="mt-1 space-y-0.5">
            {todayDepartures.length > 0 ? (
              todayDepartures.map(d => (
                <p key={d.id} className="text-[11px] text-stone-700 font-medium truncate flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full inline-block"></span>
                  <span className="truncate">{d.guestName}</span>
                </p>
              ))
            ) : (
              <p className="text-[11px] text-stone-400 italic">Aucun départ</p>
            )}
          </div>
        </div>

        {/* Card 4: Table d'Hôtes ce soir */}
        <div
          onClick={() => handleNavigate('table_dhotes')}
          className="bg-white p-3.5 rounded-lg shadow-2xs border border-stone-200 hover:border-stone-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Table ce soir</span>
            <div className="p-1.5 bg-amber-50 text-amber-800 rounded">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-stone-900">
              {totalAdultsTonight + totalChildrenTonight}
            </span>
            <span className="text-[11px] text-stone-500 font-medium">couverts</span>
          </div>
          <div className="mt-1 text-[11px] text-stone-600 space-y-0.5">
            <p className="font-medium">{totalAdultsTonight} adult. | {totalChildrenTonight} enf.</p>
          </div>
        </div>

        {/* Card 5: Encaissements du jour */}
        <div
          onClick={() => handleNavigate('invoices')}
          className="bg-white p-3.5 rounded-lg shadow-2xs border border-stone-200 hover:border-stone-300 transition cursor-pointer col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Encaissements</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded">
              <Euro className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-emerald-800">{todayRevenue} €</span>
          <p className="text-[10px] text-stone-500 mt-1 font-mono">
            Paiements du jour
          </p>
        </div>
      </div>

      {/* Two Column Layout: Planning timeline + Table d'hôtes & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2 cols): Planning du jour */}
        <div className="lg:col-span-2 space-y-4">
          {/* Planning Timeline */}
          <div className="bg-white rounded-lg p-4 shadow-2xs border border-stone-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-stone-700" />
                <h2 className="text-sm font-bold text-stone-900">Planning & Chronologie de la Journée</h2>
              </div>
              <span className="text-[11px] bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-mono font-semibold border border-stone-200">
                04/08/2026
              </span>
            </div>

            <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {/* 08h00 - Housekeeping */}
              <div className="relative flex items-start group">
                <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-amber-600 border-2 border-white ring-1 ring-amber-200" />
                <div className="flex-1 bg-stone-50/80 p-3 rounded border border-stone-200 hover:border-stone-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 font-mono">08h00 - 11h00</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-semibold">Ménage</span>
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 mt-0.5">Préparation des Chambres & Recouches</h3>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Nettoyage complet Chambre Romarin (Départ Dupont) + Recouche Chambre Lavande.
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-stone-200/80">
                    <span className="text-stone-500 font-medium">Assigné à: Marie (Gouvernante)</span>
                    <button
                      onClick={() => handleNavigate('housekeeping')}
                      className="text-[#4A6741] font-semibold hover:underline flex items-center space-x-0.5 cursor-pointer"
                    >
                      <span>Ménage</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 11h00 - Check-out Dupont */}
              <div className="relative flex items-start group">
                <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-sky-600 border-2 border-white ring-1 ring-sky-200" />
                <div className="flex-1 bg-sky-50/40 p-3 rounded border border-sky-200 hover:border-sky-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-900 font-mono">11h00 Max</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-100 text-sky-900 font-semibold">Départ</span>
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 mt-0.5">Départ de M. Pierre Dupont</h3>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Chambre Romarin • Facture réglée (424 € par CB) • Restitution des clés
                  </p>
                </div>
              </div>

              {/* 15h30 - Check-in Martin */}
              <div className="relative flex items-start group">
                <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-1 ring-emerald-200" />
                <div className="flex-1 bg-emerald-50/40 p-3 rounded border border-emerald-200 hover:border-emerald-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 font-mono">15h30</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 font-semibold">Arrivée</span>
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 mt-0.5">Arrivée M. Lucas Martin</h3>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Chambre Lavande (3 nuits) • Champagne demandé en chambre • VIP Client habitué
                  </p>
                </div>
              </div>

              {/* 19h00 - Table d'hôtes */}
              <div className="relative flex items-start group">
                <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-amber-700 border-2 border-white ring-1 ring-amber-200" />
                <div className="flex-1 bg-amber-50/60 p-3 rounded border border-amber-200 hover:border-amber-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 font-mono">19h00</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 font-bold">Table d'Hôtes</span>
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 mt-0.5">Service du Soir: Menu Provençal du Potager</h3>
                  <p className="text-[11px] text-stone-700 mt-0.5">
                    10 convives enregistrés (8 adultes, 2 enfants). Apéritif en terrasse dès 19h00.
                  </p>
                  <div className="mt-2 p-1.5 bg-amber-100/80 rounded text-[11px] text-amber-950 font-medium border border-amber-300">
                    ⚠️ 2 régimes spéciaux: 1 Sans Gluten / Fruits à coque + 1 Végétarien / Sans Lactose.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts & Room Status Overview */}
          <div className="bg-white rounded-lg p-4 shadow-2xs border border-stone-200">
            <h2 className="text-sm font-bold text-stone-900 mb-3">État Direct des Chambres</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {rooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => handleNavigate('rooms')}
                  className="flex items-center justify-between p-2.5 rounded border border-stone-200 bg-stone-50/60 hover:bg-stone-100 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 relative border border-stone-200">
                      <img
                        src={room.photos[0]}
                        alt={room.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{room.name}</h4>
                      <p className="text-[10px] text-stone-500">{room.capacity.adults} Ad. | {room.floor}</p>
                    </div>
                  </div>

                  <div>
                    {room.status === 'occupied' && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                        Occupée
                      </span>
                    )}
                    {room.status === 'available' && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                        Disponible
                      </span>
                    )}
                    {room.status === 'cleaning_needed' && (
                      <span className="text-[10px] bg-sky-100 text-sky-900 font-bold px-1.5 py-0.5 rounded">
                        À nettoyer
                      </span>
                    )}
                    {room.status === 'maintenance' && (
                      <span className="text-[10px] bg-rose-100 text-rose-900 font-bold px-1.5 py-0.5 rounded">
                        Maintenance
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Table d'hôtes highlight & Alerts */}
        <div className="space-y-4">
          {/* Tonight's Menu Preview Card */}
          <div className="bg-[#2D3436] text-stone-100 p-4 rounded-lg shadow-2xs border border-stone-800">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-700">
              <div className="flex items-center space-x-1.5">
                <Utensils className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-white">Menu du Soir</h3>
              </div>
              {onOpenAiMenu && (
                <button
                  onClick={onOpenAiMenu}
                  className="text-[11px] bg-amber-600 hover:bg-amber-500 text-white font-medium px-2 py-0.5 rounded transition flex items-center space-x-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>IA Menu</span>
                </button>
              )}
            </div>

            {todayMeal ? (
              <div className="space-y-2 text-xs">
                <p className="font-bold text-amber-300 text-xs">
                  {todayMeal.menuTitle}
                </p>
                <div className="space-y-1 text-[11px] text-stone-300">
                  <p><strong className="text-emerald-400">Entrée:</strong> {todayMeal.starter}</p>
                  <p><strong className="text-emerald-400">Plat:</strong> {todayMeal.mainCourse}</p>
                  {todayMeal.cheese && <p><strong className="text-emerald-400">Fromages:</strong> {todayMeal.cheese}</p>}
                  <p><strong className="text-emerald-400">Dessert:</strong> {todayMeal.dessert}</p>
                  {todayMeal.wines && <p className="text-stone-400 italic"><strong className="text-emerald-400">Vin:</strong> {todayMeal.wines}</p>}
                </div>

                <div className="pt-2 border-t border-stone-700/80 flex items-center justify-between text-[11px] text-stone-300">
                  <span>Tarif: <strong>{todayMeal.adultPrice} €</strong> / ad. • <strong>{todayMeal.childPrice} €</strong> / enf.</span>
                  <button
                    onClick={() => handleNavigate('table_dhotes')}
                    className="text-emerald-400 font-semibold hover:underline flex items-center space-x-0.5 cursor-pointer"
                  >
                    <span>Table</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">Aucun menu saisi pour ce soir.</p>
            )}
          </div>

          {/* Dietary & Allergy Alerts */}
          <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200 space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-950 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <h4>Alertes Régimes & Allergies ce soir</h4>
            </div>

            {allergyList.length > 0 ? (
              <div className="space-y-1.5">
                {allergyList.map((a, idx) => (
                  <div key={idx} className="p-2 bg-white rounded border border-amber-300 text-xs text-stone-800 shadow-2xs">
                    ⚠️ {a}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-600">Aucune allergie particulière signalée pour ce soir.</p>
            )}
          </div>

          {/* Quick CRM / Guest Highlights */}
          <div className="bg-white p-3.5 rounded-lg border border-stone-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-stone-900">Clients VIP Actuels</h4>
              <button
                onClick={() => handleNavigate('guests')}
                className="text-[11px] text-[#4A6741] font-semibold hover:underline"
              >
                Annuaire
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 bg-stone-50 rounded border border-stone-200 text-xs space-y-0.5">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>Lucas Martin</span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] px-1 py-0.2 rounded font-mono">VIP 3e séjour</span>
                </div>
                <p className="text-[11px] text-stone-600">Préférence: Boit du vin rosé, aime la chambre au calme.</p>
              </div>

              <div className="p-2 bg-stone-50 rounded border border-stone-200 text-xs space-y-0.5">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>Emma Lefebvre</span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] px-1 py-0.2 rounded font-mono">VIP Cuisinière</span>
                </div>
                <p className="text-[11px] text-stone-600">Préférence: Intéressée par la recette du tian provençal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

