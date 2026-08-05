import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BookingSource, BookingStatus } from '../types';
import { X, Calendar, User, BedDouble, Utensils, Euro, Sparkles } from 'lucide-react';

interface NewBookingModalProps {
  onClose: () => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({ onClose }) => {
  const { rooms, guests, createBooking, addGuest, settings } = useApp();

  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');
  const [selectedGuestId, setSelectedGuestId] = useState<string>(guests[0]?.id || '');
  const [isNewGuest, setIsNewGuest] = useState(false);

  // New guest inline state
  const [newGuestFirstName, setNewGuestFirstName] = useState('');
  const [newGuestLastName, setNewGuestLastName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');

  // Booking fields
  const [checkIn, setCheckIn] = useState('2026-08-10');
  const [checkOut, setCheckOut] = useState('2026-08-13');
  const [numberOfAdults, setNumberOfAdults] = useState(2);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [source, setSource] = useState<BookingSource>('direct');
  const [tableDhotesOption, setTableDhotesOption] = useState(true);
  const [tableDhotesMealsCount, setTableDhotesMealsCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  // Nights calculation
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const totalNights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));

  // Financial calculations
  const roomPricePerNight = selectedRoom?.basePrice || 120;
  const roomTotal = roomPricePerNight * totalNights;
  const tableTotal = tableDhotesOption ? tableDhotesMealsCount * 32 : 0;
  const touristTaxTotal = numberOfAdults * totalNights * settings.touristTaxPerAdultPerNight;
  const grandTotal = roomTotal + tableTotal + touristTaxTotal;
  const suggestedDeposit = Math.round(grandTotal * (settings.depositPercentage / 100));

  const [depositPaid, setDepositPaid] = useState<number>(suggestedDeposit);

  useEffect(() => {
    setDepositPaid(Math.round(grandTotal * (settings.depositPercentage / 100)));
  }, [grandTotal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalGuestId = selectedGuestId;
    let finalGuestName = '';

    if (isNewGuest) {
      if (!newGuestFirstName || !newGuestLastName) return;
      const createdGuest = addGuest({
        firstName: newGuestFirstName,
        lastName: newGuestLastName,
        email: newGuestEmail || `${newGuestFirstName.toLowerCase()}@client.fr`,
        phone: newGuestPhone || '06 00 00 00 00',
        address: 'France',
        city: 'Paris',
        zipCode: '75000',
        country: 'France',
        dietaryPreferences: [],
        allergies: [],
        privateNotes: 'Client créé lors de la réservation',
        vipTag: false,
        createdDate: new Date().toISOString().split('T')[0]
      });
      finalGuestId = createdGuest.id;
      finalGuestName = `${createdGuest.firstName} ${createdGuest.lastName}`;
    } else {
      const existing = guests.find(g => g.id === selectedGuestId);
      finalGuestName = existing ? `${existing.firstName} ${existing.lastName}` : 'Client Inconnu';
    }

    createBooking({
      bookingNumber: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      roomId: selectedRoomId,
      roomName: selectedRoom?.name || 'Chambre',
      guestId: finalGuestId,
      guestName: finalGuestName,
      checkIn,
      checkOut,
      totalNights,
      numberOfAdults,
      numberOfChildren,
      status: depositPaid > 0 ? 'deposit_paid' : 'confirmed',
      source,
      roomPricePerNight,
      roomTotal,
      tableDhotesOption,
      tableDhotesMealsCount: tableDhotesOption ? tableDhotesMealsCount : 0,
      tableDhotesTotal: tableTotal,
      touristTaxTotal,
      totalAmount: grandTotal,
      depositPaid,
      balanceDue: grandTotal - depositPaid,
      createdDate: new Date().toISOString().split('T')[0],
      specialRequests
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-xl w-full p-4 space-y-3 shadow-2xl border border-stone-300 text-xs my-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <div className="flex items-center space-x-2">
            <BedDouble className="w-4 h-4 text-stone-800" />
            <h2 className="font-bold text-sm text-stone-900">Nouvelle Réservation d'Hébergement</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Section 1: Guest Selection */}
          <div className="space-y-1.5 bg-stone-50 p-2.5 rounded border border-stone-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-800 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-stone-700" />
                <span>Client référent</span>
              </label>
              <button
                type="button"
                onClick={() => setIsNewGuest(!isNewGuest)}
                className="text-[#4A6741] hover:underline font-bold text-[11px] cursor-pointer"
              >
                {isNewGuest ? "← Sélectionner un client existant" : "+ Créer un nouveau client"}
              </button>
            </div>

            {!isNewGuest ? (
              <select
                value={selectedGuestId}
                onChange={e => setSelectedGuestId(e.target.value)}
                className="w-full p-2 bg-white border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              >
                {guests.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.firstName} {g.lastName} ({g.city || g.phone})
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <input
                  type="text"
                  required
                  placeholder="Prénom"
                  value={newGuestFirstName}
                  onChange={e => setNewGuestFirstName(e.target.value)}
                  className="p-1.5 bg-white border border-stone-300 rounded text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Nom"
                  value={newGuestLastName}
                  onChange={e => setNewGuestLastName(e.target.value)}
                  className="p-1.5 bg-white border border-stone-300 rounded text-xs"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={newGuestEmail}
                  onChange={e => setNewGuestEmail(e.target.value)}
                  className="p-1.5 bg-white border border-stone-300 rounded text-xs"
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={newGuestPhone}
                  onChange={e => setNewGuestPhone(e.target.value)}
                  className="p-1.5 bg-white border border-stone-300 rounded text-xs"
                />
              </div>
            )}
          </div>


          {/* Section 2: Room & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Chambre sélectionnée</label>
              <select
                value={selectedRoomId}
                onChange={e => setSelectedRoomId(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.basePrice} € / nuit
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Source de réservation</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as BookingSource)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900"
              >
                <option value="direct">Direct (Site / Téléphone)</option>
                <option value="booking.com">Booking.com</option>
                <option value="airbnb">Airbnb</option>
                <option value="abritel">Abritel</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Date d'arrivée (Check-in)</label>
              <input
                type="date"
                required
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Date de départ (Check-out)</label>
              <input
                type="date"
                required
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Nombre d'adultes</label>
              <input
                type="number"
                min={1}
                value={numberOfAdults}
                onChange={e => setNumberOfAdults(parseInt(e.target.value) || 1)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Nombre d'enfants</label>
              <input
                type="number"
                min={0}
                value={numberOfChildren}
                onChange={e => setNumberOfChildren(parseInt(e.target.value) || 0)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          {/* Section 3: Table d'Hôtes & Notes */}
          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer font-bold text-stone-900">
              <input
                type="checkbox"
                checked={tableDhotesOption}
                onChange={e => setTableDhotesOption(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
              />
              <span>Inscrire à la Table d'Hôtes (32 € / repas)</span>
            </label>

            {tableDhotesOption && (
              <div className="flex items-center space-x-3 pt-1">
                <span className="text-stone-700 font-medium">Nombre de repas au total :</span>
                <input
                  type="number"
                  min={1}
                  value={tableDhotesMealsCount}
                  onChange={e => setTableDhotesMealsCount(parseInt(e.target.value) || 1)}
                  className="w-20 p-1.5 bg-white border border-stone-300 rounded-lg text-center font-bold"
                />
              </div>
            )}
          </div>

          {/* Section 4: Live Price Summary & Deposit */}
          <div className="bg-[#2D3436] text-stone-100 p-3 rounded space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span>Hébergement ({totalNights} nuit{totalNights > 1 ? 's' : ''} x {roomPricePerNight} €) :</span>
              <span className="font-mono font-bold">{roomTotal} €</span>
            </div>
            {tableDhotesOption && (
              <div className="flex justify-between items-center text-[11px]">
                <span>Table d'hôtes ({tableDhotesMealsCount} repas) :</span>
                <span className="font-mono font-bold">{tableTotal} €</span>
              </div>
            )}
            <div className="flex justify-between items-center text-[11px] text-stone-400">
              <span>Taxe de séjour ({numberOfAdults} ad. x {totalNights} n. x {settings.touristTaxPerAdultPerNight} €) :</span>
              <span className="font-mono">{touristTaxTotal.toFixed(2)} €</span>
            </div>

            <div className="flex justify-between items-center font-bold text-xs pt-1.5 border-t border-stone-700 text-emerald-400 font-mono">
              <span>Montant Total TTC :</span>
              <span className="text-sm">{grandTotal.toFixed(2)} €</span>
            </div>

            <div className="pt-1.5 border-t border-stone-800 flex items-center justify-between text-[11px]">
              <span>Acompte à encaisser ({settings.depositPercentage}%) :</span>
              <input
                type="number"
                value={depositPaid}
                onChange={e => setDepositPaid(parseFloat(e.target.value) || 0)}
                className="w-24 p-1 bg-stone-800 border border-stone-700 text-amber-300 font-mono font-bold text-right rounded"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 font-medium rounded text-stone-700 cursor-pointer text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium rounded shadow-2xs cursor-pointer text-xs"
            >
              Créer la réservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

