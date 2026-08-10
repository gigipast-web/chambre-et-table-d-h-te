import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Users,
  UtensilsCrossed,
  Receipt,
  CreditCard,
  Sparkles,
  BarChart3,
  Settings,
  Sparkle,
  CheckSquare
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  onOpenSubscription?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onTabChange, onOpenSubscription }) => {
  const handleTabClick = (tabId: string) => {
    if (onTabChange) onTabChange(tabId);
    if (setActiveTab) setActiveTab(tabId);
  };

  const { housekeeping, bookings, dailyMeals, settings } = useApp();
  const sub = settings.subscription || { planId: 'free', planName: 'Gratuit' };

  const pendingCleaning = housekeeping.filter(h => h.status !== 'completed').length;
  const todayStr = "2026-08-04";
  const todayArrivals = bookings.filter(b => b.checkIn === todayStr).length;
  const todayMeal = dailyMeals.find(m => m.date === todayStr);
  const totalMealGuests = todayMeal
    ? todayMeal.guestRegistrations.reduce((acc, r) => acc + r.adults + r.children, 0)
    : 0;

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'bookings', label: 'Réservations', icon: CalendarDays, badge: todayArrivals > 0 ? `${todayArrivals} arr.` : null },
    { id: 'rooms', label: 'Chambres', icon: BedDouble },
    { id: 'guests', label: 'Clients', icon: Users },
    { id: 'table_dhotes', label: 'Table d\'Hôtes', icon: UtensilsCrossed, badge: totalMealGuests > 0 ? `${totalMealGuests} conv.` : null },
    { id: 'invoices', label: 'Factures & Devis', icon: Receipt },
    { id: 'housekeeping', label: 'Ménage', icon: CheckSquare, badge: pendingCleaning > 0 ? `${pendingCleaning}` : null },
    { id: 'analytics', label: 'Rapports & Stats', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-[#2D3436] text-stone-300 flex-shrink-0 min-h-[calc(100vh-3.5rem)] border-r border-stone-800 hidden md:block rounded-r-lg shadow-sm">
      <div className="p-2.5 space-y-0.5">
        <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
          Menu Principal
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#4A6741] text-white shadow-xs font-semibold'
                  : 'hover:bg-stone-800 hover:text-white text-stone-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                  isActive
                    ? 'bg-black/30 text-white'
                    : 'bg-stone-800 text-amber-400 border border-stone-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 mx-2.5 my-2 bg-stone-800/80 rounded border border-stone-700/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Formule SaaS</span>
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
            sub.planId === 'free' ? 'bg-stone-700 text-stone-300' : 'bg-emerald-500 text-stone-900'
          }`}>
            {sub.planId === 'free' ? 'Gratuit' : 'Pro ⚡'}
          </span>
        </div>
        <p className="text-[11px] text-stone-300 font-medium">
          {sub.planName}
        </p>
        <button
          onClick={onOpenSubscription}
          className="w-full bg-[#4A6741] hover:bg-[#3d5636] text-white text-[11px] font-bold py-1 px-2 rounded transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
        >
          <CreditCard className="w-3 h-3" />
          <span>{sub.planId === 'free' ? 'Passer à Pro' : 'Gérer l\'abonnement'}</span>
        </button>
      </div>
    </aside>
  );
};

