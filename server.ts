import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing in process.env");
    }
    return new GoogleGenAI({
      apiKey: apiKey || "dummy-key-for-dev",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Menu Generator for Table d'Hôtes
  app.post("/api/ai/generate-menu", async (req, res) => {
    try {
      const { theme, season, dietaryConstraints, region, numGuests } = req.body;
      const ai = getAiClient();

      const prompt = `Tu es un chef cuisinier renommé de table d'hôtes en France (${region || "Provence/Luberon"}).
Rédige un menu gourmand du jour pour la saison (${season || "Été"}) avec les informations suivantes :
- Thème culinaire : ${theme || "Cuisine provençale du terroir"}
- Nombre de convives : ${numGuests || 10}
- Contraintes alimentaires & allergies à respecter impérativement : ${dietaryConstraints || "Aucune"}

Format de réponse souhaité (en JSON strict avec les clés suivantes) :
{
  "menuTitle": "Nom évocateur du menu",
  "starter": "Entrée raffinée",
  "mainCourse": "Plat principal avec garniture",
  "cheese": "Sélection de fromages régionaux",
  "dessert": "Dessert gourmand de saison",
  "wines": "Accord mets & vins recommandé",
  "chefTips": "Conseils de préparation ou note d'attention pour les allergies"
}

Réponds UNIQUEMENT avec l'objet JSON valide sans blocs de code markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ success: true, menu: parsed });
    } catch (error: any) {
      console.error("Error generating menu with AI:", error);
      res.status(500).json({ success: false, error: error.message || "Erreur lors de la génération du menu AI." });
    }
  });

  // AI Email Generator for Guest Confirmations or Welcome Notes
  app.post("/api/ai/generate-email", async (req, res) => {
    try {
      const { guestName, roomName, checkIn, checkOut, type, wifiCode, totalAmount, specialNotes } = req.body;
      const ai = getAiClient();

      const prompt = `Tu es le propriétaire chaleureux et attentionné d'une maison d'hôtes de charme en France (Domaine du Mas des Lavandes à Gordes).
Rédige un courriel en français pour le client ${guestName}.
Type de courriel : ${type === "welcome" ? "E-mail de bienvenue et consignes d'arrivée (J-2)" : "Confirmation de réservation"}.
Détails :
- Chambre : ${roomName}
- Arrivée : ${checkIn} (Check-in à partir de 16h)
- Départ : ${checkOut} (Check-out jusqu'à 11h)
- Wi-Fi : ${wifiCode || "MasDesLavandes_Guest"}
- Montant total : ${totalAmount ? totalAmount + " €" : "Voir facture"}
- Notes particulières / Demandes : ${specialNotes || "Aucune"}

Le ton doit être chaleureux, raffiné, accueillant et professionnel.
Fournis un objet et le corps de l'e-mail sous format JSON avec les clés "subject" et "body".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ success: true, email: parsed });
    } catch (error: any) {
      console.error("Error generating email with AI:", error);
      res.status(500).json({ success: false, error: error.message || "Erreur lors de la rédaction de l'e-mail." });
    }
  });

  // AI Summary of Guest Profile / VIP Brief
  app.post("/api/ai/summarize-guest", async (req, res) => {
    try {
      const { guest, stayHistory } = req.body;
      const ai = getAiClient();

      const prompt = `Fais une synthèse rapide en 3 puces clés pour l'hôte de la maison d'hôtes au sujet du client ${guest.firstName} ${guest.lastName}.
Préférences alimentaires : ${guest.dietaryPreferences?.join(", ") || "Aucune"}
Allergies : ${guest.allergies?.join(", ") || "Aucune"}
Notes privées : ${guest.privateNotes || "Aucune"}
Historique des séjours : ${stayHistory || "Premier séjour"}

Inclus une recommandation pour lui offrir un accueil mémorable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });

      res.json({ success: true, summary: response.text });
    } catch (error: any) {
      console.error("Error summarizing guest profile:", error);
      res.status(500).json({ success: false, error: error.message || "Erreur de synthèse client." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
