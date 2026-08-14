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
  RefreshCw,
  Smartphone,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Zap,
  Sparkles
} from 'lucide-react';
import { ICalFeed } from '../types';

interface SettingsViewProps {
  onOpenSubscription?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenSubscription }) => {
  const { settings, updateSettings, rooms, bookings, clearDemoDataAndApplyNewParameters } = useApp();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedIcal, setCopiedIcal] = useState(false);

  // PWA Install Prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPwaInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      alert("L'application est déjà installée ou votre navigateur ne supporte pas le prompt d'installation direct. Vous pouvez aussi choisir 'Ajouter à l'écran d'accueil' dans le menu de votre navigateur.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsPwaInstalled(true);
    }
    setDeferredPrompt(null);
  };

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

  const handleClearDemoData = () => {
    if (window.confirm("Voulez-vous supprimer toutes les données de démonstration fictives (réservations, clients et repas d'exemple du Mas des Lavandes) et appliquer vos propres paramètres d'établissement ?")) {
      clearDemoDataAndApplyNewParameters(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }
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

        {/* Application Mobile Section */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-stone-900 text-sm">Application Mobile</h2>
                <p className="text-[11px] text-stone-500">Prête pour l'installation directe sur smartphone, tablette ou ordinateur</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {/* Direct PWA Install Action */}
            <div className="bg-stone-50 p-3.5 rounded border border-stone-200 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#4A6741]" />
                  Installation Directe sur Smartphone / Ordinateur
                </h3>
                <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                  L'application est configurée comme une PWA autonome avec mode hors-ligne, icônes adaptatives et Service Worker.
                </p>
              </div>

              <div className="mt-3">
                {isPwaInstalled ? (
                  <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Application déjà installée sur cet appareil !
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleInstallPwa}
                    className="w-full bg-[#4A6741] hover:bg-[#3d5636] text-white font-bold py-2 px-3 rounded text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Installer sur cet appareil</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription & SaaS Plan Section */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-amber-100 text-amber-900 rounded">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-stone-900 text-sm">Abonnement SaaS & Formule Active</h2>
                <p className="text-[11px] text-stone-500">Gestion de votre plan Gratuit / Pro / Domaine et de vos quotas d'utilisation</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border flex items-center gap-1 ${
              settings.subscription?.planId === 'free'
                ? 'bg-stone-100 text-stone-700 border-stone-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}>
              <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
              {settings.subscription?.planName || 'Formule Découverte (Gratuit)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Current Status Box */}
            <div className="bg-stone-50 p-3.5 rounded border border-stone-200 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Offre souscrite</span>
                <h3 className="font-bold text-stone-900 text-sm mt-0.5 font-serif">
                  {settings.subscription?.planName || 'Formule Découverte'}
                </h3>
                <p className="text-[11px] text-stone-600 mt-1">
                  Prix: <strong>{settings.subscription?.priceEuro === 0 ? 'Gratuit (0 €)' : `${settings.subscription?.priceEuro} €`}</strong>
                </p>
                <p className="text-[11px] text-stone-500">
                  Renouvellement: <strong>{settings.subscription?.renewalDate || 'Sans engagement'}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenSubscription}
                className="w-full bg-[#4A6741] hover:bg-[#3d5636] text-white font-bold py-1.5 px-3 rounded text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{settings.subscription?.planId === 'free' ? 'Passer à la Formule Pro' : 'Gérer ou changer de formule'}</span>
              </button>
            </div>

            {/* Rooms Quota Usage Box */}
            <div className="bg-stone-50 p-3.5 rounded border border-stone-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Quota Chambres / Hébergements</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold font-serif text-stone-900">
                  {rooms.length} <span className="text-xs font-sans font-normal text-stone-500">
                    / {settings.subscription?.planId === 'free' ? '5 max (Gratuit)' : 'Illimité (Pro)'}
                  </span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  settings.subscription?.planId === 'free' && rooms.length >= 5
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {settings.subscription?.planId === 'free' && rooms.length >= 5 ? 'Limite atteinte' : 'Conforme'}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#4A6741] h-full transition-all duration-300"
                  style={{ width: settings.subscription?.planId === 'free' ? `${Math.min(100, (rooms.length / 5) * 100)}%` : '100%' }}
                ></div>
              </div>
              <p className="text-[10px] text-stone-500">
                {settings.subscription?.planId === 'free' ? 'Formule gratuite limitée à 5 chambres.' : 'Ajoutez autant de chambres que nécessaire.'}
              </p>
            </div>

            {/* Features Included Box */}
            <div className="bg-stone-50 p-3.5 rounded border border-stone-200 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Inclus dans votre offre</span>
              <ul className="text-[11px] text-stone-700 space-y-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Planning interactif & Facturation PDF</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Application PWA installable sur Mobile</span>
                </li>
                <li className={`flex items-center gap-1.5 ${settings.subscription?.planId === 'free' ? 'text-stone-400' : 'text-stone-800 font-medium'}`}>
                  {settings.subscription?.planId === 'free' ? (
                    <span className="w-3.5 h-3.5 rounded-full border border-stone-300 inline-block shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                  <span>Sync iCal Airbnb / Booking {settings.subscription?.planId === 'free' && '(Option Pro)'}</span>
                </li>
                <li className={`flex items-center gap-1.5 ${settings.subscription?.planId === 'free' ? 'text-stone-400' : 'text-stone-800 font-medium'}`}>
                  {settings.subscription?.planId === 'free' ? (
                    <span className="w-3.5 h-3.5 rounded-full border border-stone-300 inline-block shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                  <span>Générateur de Menus & Recettes IA {settings.subscription?.planId === 'free' && '(Option Pro)'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save & Reset button bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearDemoData}
              className="flex items-center space-x-1.5 bg-stone-200 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-300 hover:border-amber-400 font-bold px-3 py-2 rounded text-xs transition cursor-pointer"
              title="Efface les réservations et clients de démonstration pour démarrer avec vos paramètres réels"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
              <span>Remplacer le mode Démo par mes paramètres</span>
            </button>

            {savedSuccess ? (
              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Opération effectuée avec succès !
              </span>
            ) : (
              <span className="hidden sm:inline text-stone-400 text-[11px]">Enregistrez vos modifications.</span>
            )}
          </div>

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
