import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Save,
  QrCode,
  Calendar,
  Building,
  Euro,
  Wifi,
  Copy,
  Check,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedIcal, setCopiedIcal] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const icalExportUrl = "https://domaine-lavandes.app/api/ical/export.ics";

  const handleCopyIcal = () => {
    navigator.clipboard.writeText(icalExportUrl);
    setCopiedIcal(true);
    setTimeout(() => setCopiedIcal(false), 2000);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Title Header - High Density Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#2D3436] text-white p-3.5 rounded-lg shadow-sm border border-stone-800">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Paramètres du Domaine & Configuration</h1>
          <p className="text-[11px] text-stone-300 mt-0.5">
            Gérez vos informations légales, vos flux iCal pour Booking.com/Airbnb, la taxe de séjour et votre Wi-Fi.
          </p>
        </div>

        {savedSuccess && (
          <span className="bg-emerald-900/90 text-emerald-100 text-xs font-bold px-2.5 py-1 rounded border border-emerald-700 animate-fade-in">
            ✔ Modifications enregistrées !
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* SECTION 1: Establishment Info & Legal */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs space-y-3 text-xs">
          <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
            <Building className="w-4 h-4 text-stone-700" />
            <h2 className="font-bold text-xs text-stone-900">Informations de l'Établissement</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Nom de la maison d'hôtes</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Nom du propriétaire / Gérant</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Adresse physique</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">E-mail de contact</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-medium text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Numéro SIRET</label>
              <input
                type="text"
                value={formData.siret}
                onChange={e => setFormData({ ...formData, siret: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Numéro de TVA Intracommunautaire</label>
              <input
                type="text"
                value={formData.tvaNumber}
                onChange={e => setFormData({ ...formData, tvaNumber: e.target.value })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Rates & Taxes */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs space-y-3 text-xs">
          <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
            <Euro className="w-4 h-4 text-stone-700" />
            <h2 className="font-bold text-xs text-stone-900">Taxe de Séjour & Acompte</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Taxe de séjour commune (€ par adulte / nuit)</label>
              <input
                type="number"
                step="0.05"
                value={formData.touristTaxPerAdultPerNight}
                onChange={e => setFormData({ ...formData, touristTaxPerAdultPerNight: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-bold font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
              <p className="text-[10px] text-stone-500 mt-0.5">Généralement exonéré pour les mineurs de moins de 18 ans.</p>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Acompte exigé à la réservation (%)</label>
              <input
                type="number"
                value={formData.depositPercentage}
                onChange={e => setFormData({ ...formData, depositPercentage: parseInt(e.target.value) || 30 })}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded font-bold font-mono text-stone-900 text-xs focus:ring-1 focus:ring-[#4A6741]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: iCal Sync Links */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs space-y-3 text-xs">
          <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
            <Calendar className="w-4 h-4 text-stone-700" />
            <h2 className="font-bold text-xs text-stone-900">Synchronisation des Plannings (iCal / OTA)</h2>
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
                {copiedIcal ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIcal ? "Copié !" : "Copier"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="flex items-center space-x-1.5 bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium px-4 py-2 rounded transition cursor-pointer text-xs shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Sauvegarder les Paramètres</span>
          </button>
        </div>
      </form>
    </div>
  );

};
