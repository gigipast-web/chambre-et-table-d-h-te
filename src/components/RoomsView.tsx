import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Room, RoomStatus } from '../types';
import {
  BedDouble,
  Plus,
  Users,
  Wifi,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface RoomsViewProps {
  onOpenNewRoomModal?: () => void;
}

export const RoomsView: React.FC<RoomsViewProps> = () => {
  const { rooms, updateRoom, deleteRoom, addRoom } = useApp();

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // New room state
  const [newRoomData, setNewRoomData] = useState<Omit<Room, 'id'>>({
    name: '',
    description: '',
    capacity: { adults: 2, children: 1, maxTotal: 3 },
    basePrice: 120,
    seasonalRates: { lowSeason: 100, midSeason: 120, highSeason: 150, weekendExtra: 15 },
    amenities: ['Wi-Fi', 'Climatisation', 'Vue Jardin'],
    photos: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
    status: 'available',
    surface: 26,
    floor: 'Rez-de-chaussée'
  });

  const availableAmenitiesList = [
    'Wi-Fi', 'Climatisation', 'Vue Jardin', 'Lit King Size', 'Lit Queen Size',
    'Terrasse Privative', 'Douche Italienne', 'Baignoire Îlot', 'Balcon Panoramique',
    'Accès PMR', 'Kitchenette équipée', 'Sèche-cheveux', 'Machine Nespresso', 'Mini-bar'
  ];

  const handleStatusToggle = (roomId: string, currentStatus: RoomStatus) => {
    const nextStatusMap: Record<RoomStatus, RoomStatus> = {
      available: 'occupied',
      occupied: 'cleaning_needed',
      cleaning_needed: 'maintenance',
      maintenance: 'available'
    };
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      updateRoom({ ...room, status: nextStatusMap[currentStatus] });
    }
  };

  const handleSaveNewRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomData.name) return;
    addRoom(newRoomData);
    setShowNewModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      updateRoom(editingRoom);
      setEditingRoom(null);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Title & Header - High Density Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#2D3436] text-white p-3.5 rounded-lg shadow-sm border border-stone-800">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Gestion des Chambres & Suites</h1>
          <p className="text-[11px] text-stone-300 mt-0.5">
            Configurez les capacités, la tarification par saison, les équipements et l'état de disponibilité.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-1 bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium px-3 py-1.5 rounded text-xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une Chambre</span>
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div
            key={room.id}
            className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-2xs hover:border-stone-300 transition flex flex-col justify-between text-xs"
          >
            {/* Room Image Banner */}
            <div className="relative h-40 bg-stone-100">
              <img
                src={room.photos[0]}
                alt={room.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                {room.surface} m² • {room.floor}
              </div>

              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleStatusToggle(room.id, room.status)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs transition cursor-pointer ${
                    room.status === 'available'
                      ? 'bg-emerald-700 text-white'
                      : room.status === 'occupied'
                      ? 'bg-amber-600 text-white'
                      : room.status === 'cleaning_needed'
                      ? 'bg-sky-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                  title="Cliquer pour changer le statut"
                >
                  {room.status === 'available' && '✔ Disponible'}
                  {room.status === 'occupied' && 'Occupée'}
                  {room.status === 'cleaning_needed' && 'À nettoyer'}
                  {room.status === 'maintenance' && 'Maintenance'}
                </button>
              </div>
            </div>

            {/* Room Content Details */}
            <div className="p-3.5 space-y-3 flex-1">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-900">{room.name}</h3>
                  <span className="text-xs font-bold text-stone-900">
                    {room.basePrice} € <span className="text-[10px] font-normal text-stone-500">/ nuit</span>
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-0.5 line-clamp-2 leading-snug">
                  {room.description}
                </p>
              </div>

              {/* Capacity & Seasonal rates */}
              <div className="p-2 bg-stone-50 rounded border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between text-stone-700 font-medium text-[11px]">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-stone-600" />
                    <span>Capacité:</span>
                  </span>
                  <strong className="text-stone-900 font-mono">
                    {room.capacity.adults} Ad. {room.capacity.children > 0 ? `+ ${room.capacity.children} Enf.` : ''} ({room.capacity.maxTotal} max)
                  </strong>
                </div>

                {/* Seasonal Rates Breakdown */}
                <div className="pt-1.5 border-t border-stone-200 grid grid-cols-3 gap-1 text-center text-[10px]">
                  <div className="bg-white p-1 rounded border border-stone-200">
                    <span className="text-stone-400 block text-[9px]">Basse</span>
                    <strong className="text-stone-800 font-mono">{room.seasonalRates.lowSeason} €</strong>
                  </div>
                  <div className="bg-amber-50 p-1 rounded border border-amber-200">
                    <span className="text-amber-800 block text-[9px]">Moyenne</span>
                    <strong className="text-amber-950 font-mono">{room.seasonalRates.midSeason} €</strong>
                  </div>
                  <div className="bg-emerald-50 p-1 rounded border border-emerald-200">
                    <span className="text-emerald-800 block text-[9px]">Haute</span>
                    <strong className="text-emerald-950 font-mono">{room.seasonalRates.highSeason} €</strong>
                  </div>
                </div>
              </div>

              {/* Amenities Badges */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Équipements</p>
                <div className="flex flex-wrap gap-1">
                  {room.amenities.map((item, idx) => (
                    <span key={idx} className="bg-stone-100 text-stone-700 text-[10px] font-medium px-1.5 py-0.2 rounded border border-stone-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Footer Actions */}
            <div className="px-3 py-2 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => setEditingRoom(room)}
                className="text-[11px] font-semibold text-[#4A6741] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Éditer</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Supprimer la chambre ${room.name} ?`)) deleteRoom(room.id);
                }}
                className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE NEW ROOM MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900">Ajouter une nouvelle chambre</h3>
              <button onClick={() => setShowNewModal(false)} className="text-stone-400 hover:text-stone-600 text-xl font-bold cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSaveNewRoom} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nom de la chambre</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Suite Lavande, Chambre Les Cigales..."
                  value={newRoomData.name}
                  onChange={e => setNewRoomData({ ...newRoomData, name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Atmosphère, vue, lit, confort..."
                  value={newRoomData.description}
                  onChange={e => setNewRoomData({ ...newRoomData, description: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Capacité adultes</label>
                  <input
                    type="number"
                    min={1}
                    value={newRoomData.capacity.adults}
                    onChange={e => setNewRoomData({
                      ...newRoomData,
                      capacity: { ...newRoomData.capacity, adults: parseInt(e.target.value) || 2 }
                    })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Capacité enfants</label>
                  <input
                    type="number"
                    min={0}
                    value={newRoomData.capacity.children}
                    onChange={e => setNewRoomData({
                      ...newRoomData,
                      capacity: { ...newRoomData.capacity, children: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tarif Basse Saison (€)</label>
                  <input
                    type="number"
                    value={newRoomData.seasonalRates.lowSeason}
                    onChange={e => setNewRoomData({
                      ...newRoomData,
                      seasonalRates: { ...newRoomData.seasonalRates, lowSeason: parseFloat(e.target.value) || 100 }
                    })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tarif Moyenne (€)</label>
                  <input
                    type="number"
                    value={newRoomData.basePrice}
                    onChange={e => setNewRoomData({
                      ...newRoomData,
                      basePrice: parseFloat(e.target.value) || 120,
                      seasonalRates: { ...newRoomData.seasonalRates, midSeason: parseFloat(e.target.value) || 120 }
                    })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tarif Haute Saison (€)</label>
                  <input
                    type="number"
                    value={newRoomData.seasonalRates.highSeason}
                    onChange={e => setNewRoomData({
                      ...newRoomData,
                      seasonalRates: { ...newRoomData.seasonalRates, highSeason: parseFloat(e.target.value) || 150 }
                    })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">URL de la photo principale</label>
                <input
                  type="url"
                  value={newRoomData.photos[0]}
                  onChange={e => setNewRoomData({ ...newRoomData, photos: [e.target.value] })}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Créer la chambre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROOM MODAL */}
      {editingRoom && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900">Modifier : {editingRoom.name}</h3>
              <button onClick={() => setEditingRoom(null)} className="text-stone-400 hover:text-stone-600 text-xl font-bold cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nom de la chambre</label>
                <input
                  type="text"
                  value={editingRoom.name}
                  onChange={e => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingRoom.description}
                  onChange={e => setEditingRoom({ ...editingRoom, description: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Moyenne Saison (€)</label>
                  <input
                    type="number"
                    value={editingRoom.basePrice}
                    onChange={e => setEditingRoom({ ...editingRoom, basePrice: parseFloat(e.target.value) || 100 })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Haute Saison (€)</label>
                  <input
                    type="number"
                    value={editingRoom.seasonalRates.highSeason}
                    onChange={e => setEditingRoom({
                      ...editingRoom,
                      seasonalRates: { ...editingRoom.seasonalRates, highSeason: parseFloat(e.target.value) || 150 }
                    })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Basse Saison (€)</label>
                  <input
                    type="number"
                    value={editingRoom.seasonalRates.lowSeason}
                    onChange={e => setEditingRoom({
                      ...editingRoom,
                      seasonalRates: { ...editingRoom.seasonalRates, lowSeason: parseFloat(e.target.value) || 90 }
                    })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
