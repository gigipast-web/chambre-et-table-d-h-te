import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DailyMealMenu, MealRegistration } from '../types';
import {
  Utensils,
  Plus,
  Printer,
  Sparkles,
  Users,
  ShieldAlert,
  Calendar,
  Euro,
  Wine,
  ChefHat,
  Trash2,
  Edit,
  CheckCircle2
} from 'lucide-react';

interface TableDhotesViewProps {
  onOpenAiMenuModal: () => void;
}

export const TableDhotesView: React.FC<TableDhotesViewProps> = ({ onOpenAiMenuModal }) => {
  const { dailyMeals, addDailyMeal, updateDailyMeal, deleteDailyMeal, addGuestToMeal, removeGuestFromMeal } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(() => dailyMeals[0]?.date || new Date().toISOString().split('T')[0]);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showKitchenPrintView, setShowKitchenPrintView] = useState(false);

  // Current meal for selected date
  const currentMeal = dailyMeals.find(m => m.date === selectedDate);

  // Registration form state
  const [newReg, setNewReg] = useState<Omit<MealRegistration, 'id'>>({
    guestName: '',
    adults: 2,
    children: 0,
    allergiesNote: '',
    dietaryRestrictions: []
  });

  const totalAdults = currentMeal
    ? currentMeal.guestRegistrations.reduce((sum, r) => sum + r.adults, 0)
    : 0;

  const totalChildren = currentMeal
    ? currentMeal.guestRegistrations.reduce((sum, r) => sum + r.children, 0)
    : 0;

  const totalRevenue = currentMeal
    ? totalAdults * currentMeal.adultPrice + totalChildren * currentMeal.childPrice
    : 0;

  const handleAddRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMeal || !newReg.guestName) return;

    addGuestToMeal(currentMeal.id, newReg);
    setShowAddGuestModal(false);
    setNewReg({
      guestName: '',
      adults: 2,
      children: 0,
      allergiesNote: '',
      dietaryRestrictions: []
    });
  };

  const handlePrintKitchenSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Title & Actions - High Density Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#2D3436] text-white p-3.5 rounded-lg shadow-sm border border-stone-800">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Gestion de la Table d'Hôtes</h1>
          <p className="text-[11px] text-stone-300 mt-0.5">
            Inscrivez vos convives, gérez les menus du soir, suivez les allergies et imprimez les fiches de cuisine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAiMenuModal}
            className="flex items-center space-x-1 bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium px-3 py-1.5 rounded text-xs transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Générateur de Menu IA</span>
          </button>

          <button
            onClick={handlePrintKitchenSheet}
            className="flex items-center space-x-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium px-3 py-1.5 rounded text-xs border border-stone-700 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer Fiche Cuisine</span>
          </button>
        </div>
      </div>

      {/* Date Switcher Bar */}
      <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-stone-600" />
          <span className="font-bold text-stone-700">Date du service :</span>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold px-2.5 py-1 rounded focus:outline-none focus:ring-1 focus:ring-[#4A6741] cursor-pointer"
          />
        </div>

        {currentMeal && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded font-mono font-bold border border-stone-200">
              {totalAdults} Ad. + {totalChildren} Enf. ({totalAdults + totalChildren} couverts)
            </span>
            <span className="bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded font-mono font-bold border border-emerald-200">
              {totalRevenue} €
            </span>
          </div>
        )}
      </div>

      {/* Main Meal Display Grid */}
      {currentMeal ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Menu Card (Left 1 col) */}
          <div className="bg-[#2D3436] text-white p-4 rounded-lg shadow-sm border border-stone-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-700 pb-2.5">
              <div className="flex items-center space-x-1.5">
                <ChefHat className="w-4 h-4 text-amber-300" />
                <h2 className="font-bold text-sm text-white">Menu du Jour</h2>
              </div>
              <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700">
                {currentMeal.date}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-amber-200 text-xs mb-3">
                {currentMeal.menuTitle}
              </h3>

              <div className="space-y-2 text-[11px]">
                <div className="bg-stone-800/80 p-2 rounded border border-stone-700">
                  <p className="text-amber-300 font-bold uppercase text-[9px] tracking-wider mb-0.5">Entrée</p>
                  <p className="text-stone-200 font-medium">{currentMeal.starter}</p>
                </div>

                <div className="bg-stone-800/80 p-2 rounded border border-stone-700">
                  <p className="text-amber-300 font-bold uppercase text-[9px] tracking-wider mb-0.5">Plat Principal</p>
                  <p className="text-stone-200 font-medium">{currentMeal.mainCourse}</p>
                </div>

                {currentMeal.cheese && (
                  <div className="bg-stone-800/80 p-2 rounded border border-stone-700">
                    <p className="text-amber-300 font-bold uppercase text-[9px] tracking-wider mb-0.5">Fromages</p>
                    <p className="text-stone-200 font-medium">{currentMeal.cheese}</p>
                  </div>
                )}

                <div className="bg-stone-800/80 p-2 rounded border border-stone-700">
                  <p className="text-amber-300 font-bold uppercase text-[9px] tracking-wider mb-0.5">Dessert</p>
                  <p className="text-stone-200 font-medium">{currentMeal.dessert}</p>
                </div>

                {currentMeal.wines && (
                  <div className="p-2 bg-stone-800/90 rounded border border-stone-700 flex items-start space-x-1.5">
                    <Wine className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-300 font-bold text-[10px]">Accords Vins Recommandés</p>
                      <p className="text-stone-300 italic text-[10px]">{currentMeal.wines}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price tag */}
            <div className="pt-3 border-t border-stone-700 flex items-center justify-between text-[11px] font-medium text-stone-300">
              <span>Tarif Ad. : <strong className="text-white font-mono">{currentMeal.adultPrice} €</strong></span>
              <span>Tarif Enf. : <strong className="text-white font-mono">{currentMeal.childPrice} €</strong></span>
            </div>
          </div>

          {/* Guest Registration Table (Right 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-200">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-stone-700" />
                  <h3 className="font-bold text-xs text-stone-900">
                    Convives Inscrits ({currentMeal.guestRegistrations.length} groupes)
                  </h3>
                </div>

                <button
                  onClick={() => setShowAddGuestModal(true)}
                  className="flex items-center space-x-1 bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium px-2.5 py-1 rounded text-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Inscrire Convives</span>
                </button>
              </div>

              {/* Guest Registration Items */}
              <div className="space-y-2">
                {currentMeal.guestRegistrations.map((reg, idx) => (
                  <div
                    key={reg.id}
                    className="p-2.5 rounded border border-stone-200 bg-stone-50 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded bg-stone-200 text-stone-900 text-[10px] font-bold flex items-center justify-center font-mono">
                          N°{idx + 1}
                        </span>
                        <h4 className="font-bold text-stone-900">{reg.guestName}</h4>
                      </div>

                      <p className="text-[11px] text-stone-600 font-medium">
                        👥 {reg.adults} adulte{reg.adults > 1 ? 's' : ''} {reg.children > 0 && ` + ${reg.children} enfant(s)`}
                      </p>

                      {reg.allergiesNote && (
                        <p className="text-[11px] text-rose-800 bg-rose-50 p-1 rounded border border-rose-200 font-medium flex items-center space-x-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                          <span>Allergies : {reg.allergiesNote}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-stone-900">
                        {reg.adults * currentMeal.adultPrice + reg.children * currentMeal.childPrice} €
                      </span>

                      <button
                        onClick={() => removeGuestFromMeal(currentMeal.id, reg.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition cursor-pointer"
                        title="Retirer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (

        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 space-y-4">
          <Utensils className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800">Aucun menu défini pour le {selectedDate}</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Créez un menu gourmand pour cette date ou utilisez l'assistant culinaire IA Gemini pour inventer un menu du terroir.
          </p>
          <button
            onClick={onOpenAiMenuModal}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Générer un Menu avec l'IA</span>
          </button>
        </div>
      )}

      {/* PRINTABLE KITCHEN SHEET (Secret print wrapper) */}
      {currentMeal && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 text-black z-50">
          <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold font-serif uppercase">Fiche de Service Cuisine - Table d'Hôtes</h1>
              <p className="text-sm">Domaine du Mas des Lavandes • Service du Soir</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{currentMeal.date}</p>
              <p className="text-sm font-bold">{totalAdults + totalChildren} Couverts ({totalAdults} ad. / {totalChildren} enf.)</p>
            </div>
          </div>

          <div className="mb-6 p-4 border border-black bg-stone-50 space-y-2 text-sm">
            <h2 className="font-bold text-base border-b border-black pb-1 uppercase">{currentMeal.menuTitle}</h2>
            <p><strong>Entrée :</strong> {currentMeal.starter}</p>
            <p><strong>Plat :</strong> {currentMeal.mainCourse}</p>
            {currentMeal.cheese && <p><strong>Fromages :</strong> {currentMeal.cheese}</p>}
            <p><strong>Dessert :</strong> {currentMeal.dessert}</p>
          </div>

          <h3 className="font-bold text-base mb-2 uppercase border-b border-black pb-1">Listing des Convives & Instructions</h3>
          <table className="w-full text-left border-collapse border border-black text-xs mb-6">
            <thead>
              <tr className="bg-stone-200 border-b border-black">
                <th className="p-2 border-r border-black">Table / Nom</th>
                <th className="p-2 border-r border-black">Adultes</th>
                <th className="p-2 border-r border-black">Enfants</th>
                <th className="p-2">Consignes & Allergies</th>
              </tr>
            </thead>
            <tbody>
              {currentMeal.guestRegistrations.map((reg, idx) => (
                <tr key={idx} className="border-b border-black">
                  <td className="p-2 border-r border-black font-bold">{reg.guestName}</td>
                  <td className="p-2 border-r border-black">{reg.adults}</td>
                  <td className="p-2 border-r border-black">{reg.children}</td>
                  <td className="p-2 font-bold text-red-800">{reg.allergiesNote || "Aucune"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 text-xs text-stone-500 italic text-center">
            Fiche émise le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')} • Gîte & Table d'Hôtes Manager
          </div>
        </div>
      )}

      {/* MODAL: ADD GUEST REGISTRATION */}
      {showAddGuestModal && currentMeal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900">Inscrire des convives au repas</h3>
              <button onClick={() => setShowAddGuestModal(false)} className="text-stone-400 hover:text-stone-600 text-xl font-bold cursor-pointer">×</button>
            </div>

            <form onSubmit={handleAddRegistrationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nom du groupe ou du client</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Famille Martin (Chambre Lavande)"
                  value={newReg.guestName}
                  onChange={e => setNewReg({ ...newReg, guestName: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Adultes</label>
                  <input
                    type="number"
                    min={1}
                    value={newReg.adults}
                    onChange={e => setNewReg({ ...newReg, adults: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Enfants</label>
                  <input
                    type="number"
                    min={0}
                    value={newReg.children}
                    onChange={e => setNewReg({ ...newReg, children: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Allergies / Régimes particuliers</label>
                <input
                  type="text"
                  placeholder="Ex: 1 Végétarien, Sans Gluten, Allergie Arachides..."
                  value={newReg.allergiesNote}
                  onChange={e => setNewReg({ ...newReg, allergiesNote: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-4 py-2 bg-stone-100 font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl shadow"
                >
                  Inscrire au repas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
