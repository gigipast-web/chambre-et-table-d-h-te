import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  BedDouble,
  Utensils,
  CalendarCheck,
  RefreshCw,
  Bell,
  Home
} from 'lucide-react';

interface NavbarProps {
  onOpenNewBooking?: () => void;
  onOpenAiEmailModal?: () => void;
  onOpenAiAssistant?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewBooking,
  onOpenAiEmailModal,
  onOpenAiAssistant,
  activeTab,
  setActiveTab
}) => {
  const { settings, rooms, dailyMeals, resetDemoData } = useApp();

  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const todayStr = "2026-08-04"; // relative current date
  const todayMeal = dailyMeals.find(m => m.date === todayStr);
  const mealGuestsCount = todayMeal
    ? todayMeal.guestRegistrations.reduce((acc, r) => acc + r.adults + r.children, 0)
    : 0;

  return (
    <header className="bg-[#2D3436] text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Establishment Name */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => setActiveTab && setActiveTab('dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-[#4A6741] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm">
              M
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-semibold text-sm tracking-tight text-white">
                  {settings.name}
                </h1>
                <span className="bg-stone-800 text-emerald-400 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono border border-stone-700">
                  Gordes
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block leading-tight">
                Gestion Intelligente de Chambres & Table d'Hôtes
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges - High Density */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 bg-stone-800/80 px-2.5 py-1 rounded border border-stone-700/60 text-xs">
              <BedDouble className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-stone-300">
                Chambres: <strong className="text-white font-semibold">{occupiedRooms}/{rooms.length}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-1.5 bg-stone-800/80 px-2.5 py-1 rounded border border-stone-700/60 text-xs">
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-stone-300">
                Table ce soir: <strong className="text-white font-semibold">{mealGuestsCount} couvert{mealGuestsCount > 1 ? 's' : ''}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-1.5 bg-stone-800/80 px-2.5 py-1 rounded border border-stone-700/60 text-xs">
              <CalendarCheck className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-stone-300 font-medium">
                Mardi 4 Août 2026
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {onOpenNewBooking && (
              <button
                onClick={onOpenNewBooking}
                className="bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium px-2.5 py-1 rounded text-xs transition-colors cursor-pointer flex items-center space-x-1"
              >
                <span>+ Nouvelle Réservation</span>
              </button>
            )}

            <button
              onClick={() => onOpenAiEmailModal ? onOpenAiEmailModal() : onOpenAiAssistant?.()}
              className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-500 text-white font-medium px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
              title="Assistant IA Cuisinier & Concierge Gemini"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">IA Concierge</span>
            </button>

            <button
              onClick={() => {
                if (confirm("Réinitialiser les données avec la démonstration par défaut ?")) {
                  resetDemoData();
                }
              }}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors cursor-pointer"
              title="Réinitialiser les données de démo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

