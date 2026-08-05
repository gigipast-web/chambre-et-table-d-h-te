import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Guest } from '../types';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Utensils,
  ShieldAlert,
  Sparkles,
  FileText,
  Trash2,
  Edit,
  History,
  Check
} from 'lucide-react';

interface GuestsViewProps {
  onOpenNewGuestModal: () => void;
}

export const GuestsView: React.FC<GuestsViewProps> = ({ onOpenNewGuestModal }) => {
  const { guests, bookings, deleteGuest, updateGuest } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const filteredGuests = guests.filter(g => {
    const fullName = `${g.firstName} ${g.lastName}`.toLowerCase();
    const term = searchTerm.toLowerCase();
    return (
      fullName.includes(term) ||
      g.email.toLowerCase().includes(term) ||
      g.city.toLowerCase().includes(term) ||
      g.phone.includes(term)
    );
  });

  const getGuestStayHistory = (guestId: string) => {
    return bookings.filter(b => b.guestId === guestId);
  };

  const handleGenerateAiSummary = async (guest: Guest) => {
    setSelectedGuest(guest);
    setLoadingAi(true);
    setAiSummary(null);

    const stays = getGuestStayHistory(guest.id);
    const stayHistoryStr = stays.length > 0
      ? stays.map(s => `${s.roomName} du ${s.checkIn} au ${s.checkOut} (${s.totalAmount}€)`).join("; ")
      : "Premier séjour";

    try {
      const res = await fetch("/api/ai/summarize-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest, stayHistory: stayHistoryStr })
      });
      const data = await res.json();
      if (data.success) {
        setAiSummary(data.summary);
      } else {
        setAiSummary("Impossible de générer le résumé. Veuillez vérifier vos clés API.");
      }
    } catch (err) {
      console.error(err);
      setAiSummary("Erreur réseau lors de la génération IA.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Title Header - High Density Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#2D3436] text-white p-3.5 rounded-lg shadow-sm border border-stone-800">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Annuaire & Fiches Clients (CRM)</h1>
          <p className="text-[11px] text-stone-300 mt-0.5">
            Gérez les coordonnées, l'historique des séjours, les régimes alimentaires, allergies et notes de conciergerie.
          </p>
        </div>

        <button
          onClick={onOpenNewGuestModal}
          className="flex items-center space-x-1 bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium px-3 py-1.5 rounded text-xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau Client</span>
        </button>
      </div>

      {/* Search toolbar */}
      <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Rechercher par nom, e-mail, téléphone ou ville..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#4A6741]"
          />
        </div>

        <span className="text-xs text-stone-500 font-mono">
          {filteredGuests.length} client{filteredGuests.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGuests.map(guest => {
          const stays = getGuestStayHistory(guest.id);
          const totalSpent = stays.reduce((sum, s) => sum + s.totalAmount, 0);

          return (
            <div
              key={guest.id}
              className="bg-white rounded-lg border border-stone-200 p-3.5 shadow-2xs hover:border-stone-300 transition space-y-3 flex flex-col justify-between text-xs"
            >
              <div className="space-y-2.5">
                {/* Guest Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#2D3436] text-white font-bold text-xs flex items-center justify-center border border-stone-700 shadow-2xs">
                      {guest.firstName.charAt(0)}{guest.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-bold text-xs text-stone-900">
                          {guest.firstName} {guest.lastName}
                        </h3>
                        {guest.vipTag && (
                          <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-300">
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{guest.city ? `${guest.city}, ${guest.country}` : guest.country}</span>
                      </p>
                    </div>
                  </div>

                  {/* AI Summary trigger */}
                  <button
                    onClick={() => handleGenerateAiSummary(guest)}
                    className="flex items-center space-x-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold px-2 py-1 rounded border border-stone-300 transition cursor-pointer"
                    title="Générer un brief synthétique IA"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Brief IA</span>
                  </button>
                </div>

                {/* Contact Coordinates */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-50 p-2 rounded border border-stone-200">
                  <div className="flex items-center space-x-1 text-stone-700 truncate">
                    <Mail className="w-3 h-3 text-stone-400 flex-shrink-0" />
                    <span className="truncate">{guest.email}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-stone-700 truncate">
                    <Phone className="w-3 h-3 text-stone-400 flex-shrink-0" />
                    <span>{guest.phone}</span>
                  </div>
                </div>

                {/* Dietary preferences & Allergies */}
                <div className="space-y-1 text-[11px]">
                  {guest.dietaryPreferences.length > 0 && (
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-stone-500 text-[10px] uppercase">Régime :</span>
                      <div className="flex flex-wrap gap-1">
                        {guest.dietaryPreferences.map((pref, i) => (
                          <span key={i} className="bg-emerald-50 text-emerald-900 font-medium px-1.5 py-0.2 rounded text-[10px] border border-emerald-200">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {guest.allergies.length > 0 && (
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-rose-600 text-[10px] uppercase">Allergies :</span>
                      <div className="flex flex-wrap gap-1">
                        {guest.allergies.map((all, i) => (
                          <span key={i} className="bg-rose-50 text-rose-900 font-medium px-1.5 py-0.2 rounded text-[10px] border border-rose-200">
                            ⚠️ {all}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {guest.privateNotes && (
                    <p className="text-stone-700 bg-amber-50/70 p-1.5 rounded border border-amber-200 italic text-[10px]">
                      "{guest.privateNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Stay History Summary */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px]">
                <div className="text-stone-600 font-medium">
                  {stays.length} séjour{stays.length > 1 ? 's' : ''} • <span className="font-mono font-bold text-stone-900">{totalSpent} €</span>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Supprimer la fiche client de ${guest.firstName} ${guest.lastName} ?`)) {
                      deleteGuest(guest.id);
                    }
                  }}
                  className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>


      {/* AI SUMMARY MODAL */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Brief Concierge IA : {selectedGuest.firstName} {selectedGuest.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGuest(null)}
                className="text-stone-400 hover:text-stone-600 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {loadingAi ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-stone-600 font-medium">Analyse des habitudes et rédaction de la synthèse...</p>
              </div>
            ) : (
              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-stone-800 text-xs leading-relaxed space-y-3">
                <div className="whitespace-pre-line font-sans">
                  {aiSummary}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedGuest(null)}
                className="px-4 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
