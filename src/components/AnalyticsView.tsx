import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, BedDouble, Utensils, Euro, Users } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { bookings, dailyMeals, rooms } = useApp();

  // Monthly Revenue breakdown data
  const monthlyData = [
    { month: 'Jan', nuitees: 2400, table: 850, total: 3250 },
    { month: 'Fév', nuitees: 2800, table: 920, total: 3720 },
    { month: 'Mar', nuitees: 3400, table: 1100, total: 4500 },
    { month: 'Avr', nuitees: 4200, table: 1450, total: 5650 },
    { month: 'Mai', nuitees: 5800, table: 1900, total: 7700 },
    { month: 'Juin', nuitees: 7200, table: 2400, total: 9600 },
    { month: 'Juil', nuitees: 9400, table: 3100, total: 12500 },
    { month: 'Août', nuitees: 10800, table: 3600, total: 14400 }
  ];

  // Occupancy rate trend
  const occupancyData = [
    { month: 'Jan', rate: 42 },
    { month: 'Fév', rate: 48 },
    { month: 'Mar', rate: 58 },
    { month: 'Avr', rate: 68 },
    { month: 'Mai', rate: 78 },
    { month: 'Juin', rate: 86 },
    { month: 'Juil', rate: 94 },
    { month: 'Août', rate: 96 }
  ];

  // Booking Source distribution
  const sourceData = [
    { name: 'Direct (Site/Tél)', value: 45, color: '#d97706' },
    { name: 'Booking.com', value: 25, color: '#2563eb' },
    { name: 'Airbnb', value: 20, color: '#e11d48' },
    { name: 'Abritel / Autre', value: 10, color: '#0d9488' }
  ];

  return (
    <div className="space-y-4 pb-8">
      {/* Title Header - High Density Banner */}
      <div className="bg-[#2D3436] text-white p-3.5 rounded-lg shadow-sm border border-stone-800">
        <h1 className="text-base font-bold text-white tracking-tight">Rapports & Statistiques Financières</h1>
        <p className="text-[11px] text-stone-300 mt-0.5">
          Analysez la rentabilité de vos chambres, vos revenus de table d'hôtes et le taux d'occupation.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Taux d'Occupation</span>
          <p className="text-2xl font-mono font-bold text-stone-900 mt-0.5">96 %</p>
          <span className="text-emerald-700 text-[10px] font-bold mt-0.5 inline-block">↑ +12% vs. mois dernier</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">RevPAR (Revenu / Chambre)</span>
          <p className="text-2xl font-mono font-bold text-stone-900 mt-0.5">138 €</p>
          <span className="text-stone-500 text-[10px] font-medium mt-0.5 inline-block">Saison haute estivale</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">CA Table d'Hôtes (Août)</span>
          <p className="text-2xl font-mono font-bold text-emerald-800 mt-0.5">3 600 €</p>
          <span className="text-stone-500 text-[10px] font-medium mt-0.5 inline-block">102 couverts servis</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Panier Moyen Réservation</span>
          <p className="text-2xl font-mono font-bold text-stone-900 mt-0.5">680 €</p>
          <span className="text-stone-500 text-[10px] font-medium mt-0.5 inline-block">Moyenne: 3.8 nuits</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Revenue breakdown */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-xs text-stone-900">Chiffre d'Affaires Mensuel (Hébergement vs Table)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="month" stroke="#78716c" fontSize={10} />
                <YAxis stroke="#78716c" fontSize={10} />
                <Tooltip />
                <Bar dataKey="nuitees" name="Nuitées (€)" fill="#4A6741" radius={[3, 3, 0, 0]} />
                <Bar dataKey="table" name="Table d'Hôtes (€)" fill="#2D3436" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Occupancy Rate Trend */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-xs text-stone-900">Évolution du Taux d'Occupation (%)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="month" stroke="#78716c" fontSize={10} />
                <YAxis stroke="#78716c" fontSize={10} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" name="Taux d'occupation (%)" stroke="#4A6741" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

};
