import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia" as any,
    });
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable CORS & open headers for PWA crawlers and PWABuilder
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

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

  // Stripe status endpoint
  app.get("/api/stripe/config", (req, res) => {
    const stripe = getStripeClient();
    res.json({
      configured: !!stripe,
      publishableKeyPresent: !!process.env.VITE_STRIPE_PUBLISHABLE_KEY,
      publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || null,
    });
  });

  // Create Stripe Checkout Session
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const stripe = getStripeClient();
      if (!stripe) {
        return res.status(400).json({
          success: false,
          error: "Stripe n'est pas encore configuré avec STRIPE_SECRET_KEY. Mode simulation actif.",
          simulated: true,
        });
      }

      const { planId, billingCycle, successUrl, cancelUrl } = req.body;
      let amountEuro = 19;
      let planName = "Formule Pro Mensuelle";

      if (planId?.startsWith("pro")) {
        amountEuro = billingCycle === "yearly" ? 180 : 19;
        planName = billingCycle === "yearly" ? "Formule Pro Annuelle" : "Formule Pro Mensuelle";
      } else if (planId?.startsWith("premium")) {
        amountEuro = billingCycle === "yearly" ? 384 : 39;
        planName = billingCycle === "yearly" ? "Formule Domaine Annuelle" : "Formule Domaine Mensuelle";
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: planName,
                description: `Abonnement SaaS Mas des Lavandes - ${planName}`,
              },
              unit_amount: amountEuro * 100, // cents
            },
            quantity: 1,
          },
        ],
        success_url: successUrl || `${process.env.APP_URL || "http://localhost:3000"}?payment=success&plan=${planId}`,
        cancel_url: cancelUrl || `${process.env.APP_URL || "http://localhost:3000"}?payment=canceled`,
      });

      res.json({ success: true, url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error("Error creating Stripe session:", error);
      res.status(500).json({ success: false, error: error.message });
    }
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
        model: "gemini-2.5-flash",
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
Type de courriel : ${type === "welcome" ? "E-mail de bienvenue et consignes d'arrivée (J-2)" : type === "thank_you" ? "Remerciements après séjour et demande d'avis" : "Confirmation de réservation"}.
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
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      const emailContent = parsed.body
        ? (parsed.subject ? `Objet : ${parsed.subject}\n\n${parsed.body}` : parsed.body)
        : (typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
      res.json({ success: true, email: parsed, emailContent });
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
        model: "gemini-2.5-flash",
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
