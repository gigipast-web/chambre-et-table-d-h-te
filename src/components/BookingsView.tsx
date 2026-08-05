import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, BookingStatus, BookingSource } from '../types';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  User,
  BedDouble,
  CheckCircle2,
  Clock,
  Euro,
  FileText,
  Utensils,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';

interface BookingsViewProps {
  onOpenNewBooking: () => void;
  onSelectBookingForInvoice?: (bookingId: string) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  onOpenNewBooking,
  onSelectBookingForInvoice
}) => {
  const { bookings, rooms, guests, deleteBooking, updateBooking, createInvoiceFromBooking } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');

  // Filter logic
  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || b.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'checked_in':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">Arrivé / En cours</span>;
      case 'checked_out':
        return <span className="bg-stone-100 text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full border border-stone-200">Terminé / Parti</span>;
      case 'confirmed':
        return <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-200">Confirmée</span>;
      case 'deposit_paid':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">Acompte Versé</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200">Annulée</span>;
      default:
        return null;
    }
  };

  const getSourceBadge = (source: BookingSource) => {
    switch (source) {
      case 'direct':
        return <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded">Réservation Directe</span>;
      case 'airbnb':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold px-2 py-0.5 rounded">Airbnb</span>;
      case 'booking.com':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded">Booking.com</span>;
      case 'abritel':
        return <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-semibold px-2 py-0.5 rounded">Abritel / Vrbo</span>;
      default:
        return <span className="bg-stone-50 text-stone-600 border border-stone-200 text-[11px] font-semibold px-2 py-0.5 rounded">Téléphone / Autre</span>;
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#2D3436] text-white p-3.5 rounded-lg shadow-sm border border-stone-800">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Réservations & Planning</h1>
          <p className="text-[11px] text-stone-300 mt-0.5">
            Gérez toutes vos nuitées, vos acomptes, les fiches clients et la facturation directe.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Toggle */}
          <div className="bg-stone-800 p-1 rounded flex items-center text-xs font-medium border border-stone-700">
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                viewMode === 'list' ? 'bg-[#4A6741] text-white font-semibold shadow-2xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              Liste ({bookings.length})
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                viewMode === 'calendar' ? 'bg-[#4A6741] text-white font-semibold shadow-2xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              Grille Calendrier
            </button>
          </div>

          <button
            onClick={onOpenNewBooking}
            className="flex items-center space-x-1 bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium px-3 py-1.5 rounded text-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvelle Réservation</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar - High Density */}
      <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 flex-1 min-w-[220px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Rechercher nom, n° réservation ou chambre..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#4A6741]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded text-xs text-stone-800 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4A6741] cursor-pointer font-medium"
          >
            <option value="all">Tous les statuts</option>
            <option value="checked_in">Arrivés / En cours</option>
            <option value="confirmed">Confirmées</option>
            <option value="deposit_paid">Acompte Versé</option>
            <option value="checked_out">Terminés / Partis</option>
            <option value="cancelled">Annulées</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded text-xs text-stone-800 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#4A6741] cursor-pointer font-medium"
          >
            <option value="all">Toutes les sources (iCal / Direct)</option>
            <option value="direct">Réservation Directe</option>
            <option value="airbnb">Airbnb</option>
            <option value="booking.com">Booking.com</option>
            <option value="abritel">Abritel</option>
          </select>
        </div>
      </div>


      {/* VIEW 1: LIST MODE */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map(b => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg">
                      {b.bookingNumber}
                    </span>
                    {getSourceBadge(b.source)}
                    {getStatusBadge(b.status)}
                  </div>

                  <div className="text-xs text-stone-500 font-medium">
                    Créée le {b.createdDate}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Guest Info */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Client & Occupants</p>
                    <p className="text-sm font-bold text-stone-900 flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-amber-700" />
                      <span>{b.guestName}</span>
                    </p>
                    <p className="text-xs text-stone-600">
                      {b.numberOfAdults} Adulte{b.numberOfAdults > 1 ? 's' : ''}
                      {b.numberOfChildren > 0 && ` • ${b.numberOfChildren} Enfant(s)`}
                    </p>
                  </div>

                  {/* Room & Dates */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Chambre & Séjour</p>
                    <p className="text-sm font-bold text-stone-900 flex items-center space-x-1.5">
                      <BedDouble className="w-4 h-4 text-amber-700" />
                      <span>{b.roomName}</span>
                    </p>
                    <p className="text-xs text-stone-700 font-medium">
                      Du <strong className="text-stone-900">{b.checkIn}</strong> au <strong className="text-stone-900">{b.checkOut}</strong>
                      <span className="text-stone-500 font-normal"> ({b.totalNights} nuit{b.totalNights > 1 ? 's' : ''})</span>
                    </p>
                  </div>

                  {/* Table d'hôte & Extras */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Table d'Hôtes & Options</p>
                    <p className="text-xs text-stone-800 font-medium flex items-center space-x-1">
                      <Utensils className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {b.tableDhotesOption ? `${b.tableDhotesMealsCount} repas inscrits (${b.tableDhotesTotal} €)` : "Non souscrit"}
                      </span>
                    </p>
                    {b.specialRequests && (
                      <p className="text-[11px] text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200 font-medium">
                        Note: {b.specialRequests}
                      </p>
                    )}
                  </div>

                  {/* Financial Breakdown & Actions */}
                  <div className="space-y-2 text-right md:border-l md:border-stone-100 md:pl-4">
                    <div>
                      <span className="text-xs text-stone-500">Montant Total TTC</span>
                      <p className="text-xl font-serif font-bold text-amber-900">{b.totalAmount} €</p>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <p className="text-emerald-700 font-medium">Acompte payé : {b.depositPaid} €</p>
                      {b.balanceDue > 0 ? (
                        <p className="text-rose-600 font-bold">Solde restant : {b.balanceDue} €</p>
                      ) : (
                        <p className="text-emerald-600 font-bold">✔ Totalement réglé</p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          const inv = createInvoiceFromBooking(b.id, 'facture');
                          alert(`Facture ${inv.number} générée avec succès !`);
                        }}
                        className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1"
                        title="Créer ou télécharger la facture PDF"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>Facturer</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Supprimer la réservation ${b.bookingNumber} ?`)) {
                            deleteBooking(b.id);
                          }
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg transition cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 space-y-3">
              <CalendarDays className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-serif font-bold text-stone-800">Aucune réservation trouvée</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Modifiez vos critères de recherche ou créez une nouvelle réservation pour votre maison d'hôtes.
              </p>
              <button
                onClick={onOpenNewBooking}
                className="inline-flex items-center space-x-1.5 bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm hover:bg-amber-500 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle Réservation</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CALENDAR GRID MODE */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <h3 className="font-serif font-bold text-lg text-stone-900">Planning des Chambres - Août 2026</h3>
            <div className="flex items-center space-x-2 text-xs font-medium text-stone-600">
              <span className="flex items-center space-x-1"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span><span>Arrivé</span></span>
              <span className="flex items-center space-x-1"><span className="w-3 h-3 bg-sky-500 rounded-sm"></span><span>Confirmé</span></span>
              <span className="flex items-center space-x-1"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span><span>Acompte</span></span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-stone-100 text-stone-700 font-bold font-mono border-b border-stone-200">
                  <th className="p-3 w-48 border-r border-stone-200">Chambre</th>
                  {Array.from({ length: 14 }).map((_, idx) => {
                    const day = idx + 1;
                    const dateStr = `2026-08-${day < 10 ? '0' + day : day}`;
                    const isToday = dateStr === '2026-08-04';
                    return (
                      <th
                        key={day}
                        className={`p-2 text-center border-r border-stone-200 min-w-[45px] ${
                          isToday ? 'bg-amber-200 text-amber-950 font-bold' : ''
                        }`}
                      >
                        <div>0{day}/08</div>
                        <div className="text-[10px] font-normal text-stone-500">
                          {['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][(idx + 6) % 7]}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id} className="border-b border-stone-200 hover:bg-stone-50/50">
                    <td className="p-3 font-bold text-stone-900 border-r border-stone-200 bg-stone-50/80">
                      <div>{room.name}</div>
                      <div className="text-[10px] text-stone-500 font-normal">{room.basePrice} € / nuit</div>
                    </td>

                    {Array.from({ length: 14 }).map((_, idx) => {
                      const day = idx + 1;
                      const dateStr = `2026-08-${day < 10 ? '0' + day : day}`;

                      // Find booking overlapping this date for this room
                      const booking = bookings.find(
                        b => b.roomId === room.id && dateStr >= b.checkIn && dateStr < b.checkOut
                      );

                      return (
                        <td key={day} className="p-1 border-r border-stone-200 text-center relative h-12">
                          {booking ? (
                            <div
                              className={`w-full h-full rounded p-1 text-[10px] text-white font-semibold flex flex-col justify-center items-center overflow-hidden truncate shadow-2xs ${
                                booking.status === 'checked_in'
                                  ? 'bg-emerald-600'
                                  : booking.status === 'confirmed'
                                  ? 'bg-sky-600'
                                  : 'bg-amber-600'
                              }`}
                              title={`${booking.guestName} (${booking.checkIn} -> ${booking.checkOut})`}
                            >
                              <span className="truncate w-full">{booking.guestName}</span>
                            </div>
                          ) : (
                            <span className="text-stone-300 font-mono text-[10px]">•</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
