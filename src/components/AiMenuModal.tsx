import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ChefHat, Check, Wine, RefreshCw } from 'lucide-react';

interface AiMenuModalProps {
  onClose: () => void;
}

export const AiMenuModal: React.FC<AiMenuModalProps> = ({ onClose }) => {
  const { addDailyMeal } = useApp();

  const [theme, setTheme] = useState("Gastronomie Provençale & Produits du Terroir");
  const [dietaryConstraints, setDietaryConstraints] = useState("1 Sans Gluten, Produits de saison uniquement");
  const [date, setDate] = useState("2026-08-04");

  const [loading, setLoading] = useState(false);
  const [generatedMenu, setGeneratedMenu] = useState<{
    menuTitle: string;
    starter: string;
    mainCourse: string;
    cheese?: string;
    dessert: string;
    wines?: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, dietaryConstraints })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedMenu(data.menu);
      } else {
        alert("Erreur lors de la génération. Veuillez réessayer.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la communication avec le serveur AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyMenu = () => {
    if (!generatedMenu) return;

    addDailyMeal({
      date,
      menuTitle: generatedMenu.menuTitle,
      starter: generatedMenu.starter,
      mainCourse: generatedMenu.mainCourse,
      cheese: generatedMenu.cheese || "Plateau de fromages AOP affinés",
      dessert: generatedMenu.dessert,
      wines: generatedMenu.wines || "Côtes de Provence AOP Château de Berne",
      adultPrice: 32,
      childPrice: 16,
      maxSeats: 16,
      guestRegistrations: []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-lg w-full p-4 space-y-3 shadow-2xl border border-stone-300 text-xs">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-stone-800" />
            <h2 className="font-bold text-sm text-stone-900">Assistant Culinaire IA Gemini</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer">×</button>
        </div>

        <div className="space-y-2.5">
          <div>
            <label className="block font-bold text-stone-700 mb-0.5">Date du service</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded font-mono font-bold text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-0.5">Inspirations / Thème du Repas</label>
            <input
              type="text"
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-[#4A6741]"
              placeholder="Ex: Cuisine Périgourdine, Dîner sous les oliviers, Produits de la mer..."
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-0.5">Régimes ou contraintes d'allergies à intégrer</label>
            <input
              type="text"
              value={dietaryConstraints}
              onChange={e => setDietaryConstraints(e.target.value)}
              className="w-full p-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:ring-1 focus:ring-[#4A6741]"
              placeholder="Ex: 1 Végétarien, Sans Lactose..."
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2 bg-[#2D3436] hover:bg-stone-800 text-white font-medium rounded transition cursor-pointer flex items-center justify-center space-x-2 text-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-stone-300" />
                <span>Création du menu par l'IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-stone-300" />
                <span>Générer la proposition de Menu</span>
              </>
            )}
          </button>
        </div>

        {/* Display generated result */}
        {generatedMenu && (
          <div className="bg-[#2D3436] text-stone-100 p-3 rounded border border-stone-700 space-y-2 text-xs">
            <h3 className="font-bold text-xs text-amber-300 border-b border-stone-700 pb-1.5">
              {generatedMenu.menuTitle}
            </h3>

            <div className="space-y-1 text-[11px]">
              <p><strong>Entrée :</strong> {generatedMenu.starter}</p>
              <p><strong>Plat :</strong> {generatedMenu.mainCourse}</p>
              {generatedMenu.cheese && <p><strong>Fromages :</strong> {generatedMenu.cheese}</p>}
              <p><strong>Dessert :</strong> {generatedMenu.dessert}</p>
              {generatedMenu.wines && <p className="text-amber-200">🍷 <strong>Accord vins :</strong> {generatedMenu.wines}</p>}
            </div>

            <button
              onClick={handleApplyMenu}
              className="w-full py-1.5 bg-[#4A6741] hover:bg-[#3d5636] text-white font-medium rounded transition cursor-pointer flex items-center justify-center space-x-1 text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Valider & Inscrire ce menu pour le {date}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

};
