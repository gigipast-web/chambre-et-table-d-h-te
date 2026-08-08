import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Save,
  Calendar,
  Building,
  Euro,
  Wifi,
  Copy,
  Check,
  Phone,
  Clock,
  Plus,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { ICalFeed } from '../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, rooms } = useApp();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedIcal, setCopiedIcal] = useState(false);

  // New iCal Feed Form
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedPlatform, setNewFeedPlatform] = useState('Airbnb');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedRoomId, setNewFeedRoomId] = useState(rooms[0]?.id || 'room-1');

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTax = parseFloat(String(formData.touristTaxPerAdultPerNight ?? formData.touristTaxRate ?? 1.5));
    const tax = !isNaN(parsedTax) ? parsedTax : 1.5;

    const parsedDeposit = parseInt(String(formData.depositPercentage ?? 30), 10);
    const depositPct = !isNaN(parsedDeposit) ? parsedDeposit : 30;

    const parsedTva = parseFloat(String(formData.defaultTvaRate ?? 10));
    const tva = !isNaN(parsedTva) ? parsedTva : 10;

    const updated = {
      ...formData,
      touristTaxRate: tax,
      touristTaxPerAdultPerNight: tax,
      depositPercentage: depositPct,
      defaultTvaRate: tva
    };
    updateSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const icalExportUrl = `${window.location.origin}/api/ical/export.ics`;

  const handleCopyIcal = () => {
    navigator.clipboard.writeText(icalExportUrl);
    setCopiedIcal(true);
    setTimeout(() => setCopiedIcal(false), 2000);
  };

  const handleAddICalFeed = () => {
    if (!newFeedName || !newFeedUrl) return;
    const newFeed: ICalFeed = {
      id: `ical-${Date.now()}`,
      name: newFeedName,
      platform: newFeedPlatform,
      url: newFeedUrl,
      roomId: newFeedRoomId,
      lastSync: "À l'instant"
    };
    const updatedFeeds = [...(formData.iCalFeeds || []), newFeed];
    setFormData({ ...formData, iCalFeeds: updatedFeeds });
    setNewFeedName('');
    setNewFeedUrl('');
  };

  const handleRemoveICalFeed = (id: string) => {
    const updatedFeeds = (formData.iCalFeeds || []).filter(f => f.id !== id);
    setFormData({ ...formData, iCalFeeds: updatedFeeds });
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#2D3436] text-white p-3.5 rounded-lg shadow-sm border border-stone-800">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            Paramètres du Domaine & Configuration
          </h1>
          <p className="text-[11px] text-stone-300 mt-0.5">
            Gérez vos informations légales, vos flux iCal pour Booking.com/Airbnb, la taxe de séjour, la TVA et votre accès Wi-Fi.
          </p>
        </div>

        {savedSuccess && (
          <span className="bg-emerald-800 text-emerald-100 text-xs font-bold px-3 py-1.5 rounded border border-emerald-600 animate-fade-in flex items-center gap-1.5 shadow-sm shrink-0">
            <Check className="w-4 h-4 text-emerald-300" />
            Modifications enregistrées avec succès !
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* SECTION 1: Establishment Info & Legal */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs space-y-3 text-xs">
          <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
            <Building className="w-4 h-4 text-stone-700" />
            <h2 className="font-bold text-xs text-stone-900">Informations de l'Établissement & Légal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Nom de la maison d'hôtes / Gîte *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Nom du propriétaire / Gérant *</label>
              <input
                type="text"
                required
                value={formData.ownerName || ''}
                onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Adresse physique complète *</label>
              <input
                type="text"
                required
                value={formData.address || ''}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">E-mail de contact *</label>
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Téléphone de contact</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Numéro SIRET</label>
              <input
                type="text"
                value={formData.siret || ''}
                onChange={e => setFormData({ ...formData, siret: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Numéro de TVA Intracommunautaire</label>
              <input
                type="text"
                value={formData.tvaNumber || ''}
                onChange={e => setFormData({ ...formData, tvaNumber: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Rates, Taxes & Schedules */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs space-y-3 text-xs">
          <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
            <Euro className="w-4 h-4 text-stone-700" />
            <h2 className="font-bold text-xs text-stone-900">Tarification, Taxes & Horaires d'Accueil</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Taxe de séjour (€ / adulte / nuit)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={formData.touristTaxPerAdultPerNight ?? formData.touristTaxRate ?? 1.50}
                onChange={e => {
                  const val = parseFloat(e.target.value) || 0;
                  setFormData({ ...formData, touristTaxPerAdultPerNight: val, touristTaxRate: val });
                }}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-bold font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
              <p className="text-[10px] text-stone-500 mt-0.5">Exonéré pour les mineurs (- de 18 ans).</p>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Acompte à la réservation (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.depositPercentage ?? 30}
                onChange={e => setFormData({ ...formData, depositPercentage: parseInt(e.target.value) || 0 })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-bold font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Taux TVA par défaut (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.defaultTvaRate ?? 10}
                onChange={e => setFormData({ ...formData, defaultTvaRate: parseFloat(e.target.value) || 10 })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-bold font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-600" />
                <span>Heure d'arrivée (Check-in)</span>
              </label>
              <input
                type="text"
                value={formData.checkInTime || '16:00'}
                onChange={e => setFormData({ ...formData, checkInTime: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
                placeholder="Ex: 16:00"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-600" />
                <span>Heure de départ (Check-out)</span>
              </label>
              <input
                type="text"
                value={formData.checkOutTime || '11:00'}
                onChange={e => setFormData({ ...formData, checkOutTime: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
                placeholder="Ex: 11:00"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Wi-Fi Access */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs space-y-3 text-xs">
          <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
            <Wifi className="w-4 h-4 text-stone-700" />
            <h2 className="font-bold text-xs text-stone-900">Réseau Wi-Fi Clients & Conciergerie</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Nom du réseau Wi-Fi (SSID)</label>
              <input
                type="text"
                value={formData.wifiSsid || ''}
                onChange={e => setFormData({ ...formData, wifiSsid: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Mot de passe Wi-Fi</label>
              <input
                type="text"
                value={formData.wifiPassword || ''}
                onChange={e => setFormData({ ...formData, wifiPassword: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: iCal Sync Links & Feeds */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs space-y-3 text-xs">
          <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
            <Calendar className="w-4 h-4 text-stone-700" />
            <h2 className="font-bold text-xs text-stone-900">Synchronisation iCal (Airbnb, Booking.com, Abritel)</h2>
          </div>

          <div className="bg-stone-50 p-3 rounded border border-stone-200 space-y-1.5">
            <label className="block font-bold text-stone-800">Lien d'exportation iCal unifié (À copier dans Airbnb / Booking.com)</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={icalExportUrl}
                className="w-full p-2 bg-white border border-stone-300 rounded font-mono text-stone-700 text-xs select-all"
              />
              <button
                type="button"
                onClick={handleCopyIcal}
                className="bg-[#2D3436] hover:bg-stone-800 text-white font-medium px-3 py-2 rounded transition cursor-pointer flex items-center space-x-1 shrink-0"
              >
                {copiedIcal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIcal ? "Copié !" : "Copier"}</span>
              </button>
            </div>
          </div>

          {/* Connected iCal feeds */}
          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-stone-800 text-xs">Flux iCal Importés depuis les OTA</h3>
            
            {formData.iCalFeeds && formData.iCalFeeds.length > 0 ? (
              <div className="space-y-2">
                {formData.iCalFeeds.map(feed => {
                  const matchedRoom = rooms.find(r => r.id === feed.roomId);
                  return (
                    <div key={feed.id} className="flex items-center justify-between p-2.5 bg-stone-50 rounded border border-stone-200 text-xs">
                      <div>
                        <div className="flex items-center space-x-2 font-bold text-stone-900">
                          <span>{feed.name}</span>
                          <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded text-stone-700 font-mono">{feed.platform}</span>
                          {matchedRoom && <span className="text-[10px] text-[#4A6741] font-semibold">({matchedRoom.name})</span>}
                        </div>
                        <p className="text-[10px] text-stone-500 font-mono truncate max-w-md mt-0.5">{feed.url}</p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[10px] text-stone-400 flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" />
                          {feed.lastSync || 'Actif'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveICalFeed(feed.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded cursor-pointer transition"
                          title="Supprimer ce flux"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-stone-500 text-[11px] italic">Aucun flux iCal externe configuré pour l'instant.</p>
            )}

            {/* Form to add a new iCal feed */}
            <div className="bg-stone-50 p-3 rounded border border-stone-200 space-y-2 mt-3">
              <span className="font-bold text-stone-800 text-[11px] block">Ajouter un nouveau flux iCal (Airbnb / Booking)</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Nom (ex: Chambre Lavande Airbnb)"
                  value={newFeedName}
                  onChange={e => setNewFeedName(e.target.value)}
                  className="p-1.5 bg-white border border-stone-300 rounded text-xs"
                />
                <select
                  value={newFeedPlatform}
                  onChange={e => setNewFeedPlatform(e.target.value)}
                  className="p-1.5 bg-white border border-stone-300 rounded text-xs"
                >
                  <option value="Airbnb">Airbnb</option>
                  <option value="Booking.com">Booking.com</option>
                  <option value="Abritel">Abritel / Vrbo</option>
                  <option value="Autre">Autre OTA</option>
                </select>
                <select
                  value={newFeedRoomId}
                  onChange={e => setNewFeedRoomId(e.target.value)}
                  className="p-1.5 bg-white border border-stone-300 rounded text-xs"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="URL iCal (.ics)"
                  value={newFeedUrl}
                  onChange={e => setNewFeedUrl(e.target.value)}
                  className="p-1.5 bg-white border border-stone-300 rounded text-xs"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddICalFeed}
                  className="bg-[#2D3436] hover:bg-stone-800 text-white font-medium px-3 py-1 rounded text-xs transition cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter ce flux</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save button bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Paramètres sauvegardés avec succès !
            </span>
          ) : (
            <span className="text-stone-400 text-[11px]">N'oubliez pas d'enregistrer vos modifications.</span>
          )}

          <button
            type="submit"
            className="flex items-center space-x-2 bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium px-5 py-2.5 rounded shadow transition cursor-pointer text-xs"
          >
            <Save className="w-4 h-4" />
            <span className="font-bold">Sauvegarder les Paramètres</span>
          </button>
        </div>
      </form>
    </div>
  );
};
