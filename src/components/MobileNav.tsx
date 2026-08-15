import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  UtensilsCrossed,
  Receipt,
  MoreHorizontal,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  X,
  Phone,
  Sparkles
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  onOpenMoreMenu?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  onTabChange,
}) => {
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  const handleTabSelect = (tabId: string) => {
    if (setActiveTab) setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
    setShowMoreSheet(false);
  };

  const mainTabs = [
    { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
    { id: 'bookings', label: 'Planning', icon: CalendarDays },
    { id: 'table_dhotes', label: 'Table d\'hôtes', icon: UtensilsCrossed },
    { id: 'invoices', label: 'Factures', icon: Receipt },
  ];

  const moreItems = [
    { id: 'rooms', label: 'Chambres & Tarifs', icon: BedDouble },
    { id: 'guests', label: 'Fichier Clients', icon: Users },
    { id: 'housekeeping', label: 'Ménage & Entretien', icon: CheckSquare },
    { id: 'analytics', label: 'Rapports & Stats', icon: BarChart3 },
    { id: 'guide', label: 'Guide d\'utilisation', icon: BookOpen, badge: 'Aide' },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#2D3436] border-t border-stone-800 z-40 px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab.id)}
                className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 mb-0.5 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => handleTabSelect('guide')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'guide' ? 'text-emerald-400 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className={`w-4.5 h-4.5 mb-0.5 ${activeTab === 'guide' ? 'text-emerald-400' : 'text-stone-400'}`} />
            <span className="text-[10px] tracking-tight">Guide</span>
          </button>

          <button
            onClick={() => setShowMoreSheet(true)}
            className="flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium text-stone-400 hover:text-stone-200 cursor-pointer"
          >
            <MoreHorizontal className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile More Bottom Sheet */}
      {showMoreSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs md:hidden animate-fade-in">
          <div className="bg-[#2D3436] rounded-t-2xl border-t border-stone-700 p-4 max-h-[80vh] overflow-y-auto space-y-4 text-stone-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-[#4A6741] flex items-center justify-center text-white text-xs font-bold font-serif">
                  M
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Menu & Modules
                </span>
              </div>
              <button
                onClick={() => setShowMoreSheet(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabSelect(item.id)}
                    className={`flex items-center space-x-2.5 p-3 rounded-lg text-xs font-medium transition text-left cursor-pointer border ${
                      isActive
                        ? 'bg-[#4A6741] text-white border-emerald-500 font-bold'
                        : 'bg-stone-800/90 text-stone-300 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    <div className="flex-1 truncate">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-1.5 text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-mono">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-400 space-y-1">
              <p className="font-bold text-stone-200">Besoin d'assistance directe ?</p>
              <p className="text-[11px]">Notre équipe est à votre écoute pour toute question technique ou réglementaire.</p>
              <a
                href="tel:0681535770"
                className="inline-flex items-center space-x-1 text-emerald-400 font-bold pt-1 hover:underline text-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>06 81 53 57 70</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
