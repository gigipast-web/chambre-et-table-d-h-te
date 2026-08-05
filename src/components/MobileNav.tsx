import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  UtensilsCrossed,
  Receipt,
  MoreHorizontal
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMoreMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, onOpenMoreMenu }) => {
  const mainTabs = [
    { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
    { id: 'bookings', label: 'Réservations', icon: CalendarDays },
    { id: 'rooms', label: 'Chambres', icon: BedDouble },
    { id: 'table_dhotes', label: 'Table d\'hôtes', icon: UtensilsCrossed },
    { id: 'invoices', label: 'Factures', icon: Receipt },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-stone-800 z-40 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={onOpenMoreMenu}
          className="flex flex-col items-center py-1 px-2.5 rounded-lg text-xs font-medium text-stone-400 hover:text-stone-200 cursor-pointer"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Plus</span>
        </button>
      </div>
    </nav>
  );
};
