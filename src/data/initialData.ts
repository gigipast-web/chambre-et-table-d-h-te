import {
  Room,
  Guest,
  Booking,
  DailyMealMenu,
  Invoice,
  HousekeepingTask,
  EstablishmentSettings,
  GiftVoucher,
  PaymentRecord
} from '../types';

export const initialSettings: EstablishmentSettings = {
  name: "Domaine du Mas des Lavandes",
  ownerName: "Sophie & Marc Dubois",
  address: "1420 Route des Collines, 84220 Gordes",
  phone: "04 90 72 18 40",
  email: "contact@masdeslavandes-gordes.fr",
  siret: "892 341 012 00018",
  tvaNumber: "FR 42 892341012",
  touristTaxRate: 1.50, // € per adult / night
  defaultTvaRate: 10,
  wifiSsid: "MasDesLavandes_Guest",
  wifiPassword: "Provence2026!",
  checkInTime: "16:00",
  checkOutTime: "11:00",
  iCalFeeds: [
    {
      id: "ical-1",
      name: "Chambre Lavande - Airbnb",
      platform: "Airbnb",
      url: "https://www.airbnb.fr/calendar/ical/12345678.ics",
      roomId: "room-1",
      lastSync: "Aujourd'hui à 08:30"
    },
    {
      id: "ical-2",
      name: "Suite Olivier - Booking.com",
      platform: "Booking.com",
      url: "https://admin.booking.com/hotel/hotelical/987654.ics",
      roomId: "room-3",
      lastSync: "Aujourd'hui à 09:15"
    }
  ]
};

export const initialRooms: Room[] = [
  {
    id: "room-1",
    name: "Chambre Lavande",
    description: "Chambre spacieuse avec terrasse privée et vue imprenable sur le vallon des lavandes et le Luberon.",
    capacity: { adults: 2, children: 1, maxTotal: 3 },
    basePrice: 125,
    seasonalRates: {
      lowSeason: 105,
      midSeason: 125,
      highSeason: 155,
      weekendExtra: 15
    },
    amenities: ["Wi-Fi", "Climatisation", "Vue Jardin", "Lit King Size", "Terrasse Privative", "Machine Nespresso"],
    photos: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80"
    ],
    status: "occupied",
    surface: 28,
    floor: "Rez-de-chaussée"
  },
  {
    id: "room-2",
    name: "Chambre Romarin",
    description: "Ambiance provencale chaleureuse, tommettes d'époque, grande salle d'eau italienne et douces teintes ocre.",
    capacity: { adults: 2, children: 0, maxTotal: 2 },
    basePrice: 110,
    seasonalRates: {
      lowSeason: 95,
      midSeason: 110,
      highSeason: 140,
      weekendExtra: 10
    },
    amenities: ["Wi-Fi", "Climatisation", "Douche Italienne", "Lit Queen Size", "Sèche-cheveux"],
    photos: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80"
    ],
    status: "cleaning_needed",
    surface: 24,
    floor: "1er étage"
  },
  {
    id: "room-3",
    name: "Suite Olivier",
    description: "Notre plus vaste suite luxueuse avec salon indépendant, baignoire îlot et balcon panoramique.",
    capacity: { adults: 2, children: 2, maxTotal: 4 },
    basePrice: 175,
    seasonalRates: {
      lowSeason: 145,
      midSeason: 175,
      highSeason: 220,
      weekendExtra: 25
    },
    amenities: ["Wi-Fi", "Climatisation", "Baignoire Îlot", "Balcon Panoramique", "Lit Super King", "Coin Salon", "Mini-bar"],
    photos: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80"
    ],
    status: "occupied",
    surface: 42,
    floor: "1er étage"
  },
  {
    id: "room-4",
    name: "Chambre Mimosa",
    description: "Chambre lumineuse aux touches ensoleillées, accessible aux personnes à mobilité réduite.",
    capacity: { adults: 2, children: 1, maxTotal: 3 },
    basePrice: 115,
    seasonalRates: {
      lowSeason: 95,
      midSeason: 115,
      highSeason: 145,
      weekendExtra: 10
    },
    amenities: ["Wi-Fi", "Climatisation", "Accès PMR", "Lit Modulable", "Terrasse Ombragée"],
    photos: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80"
    ],
    status: "available",
    surface: 26,
    floor: "Rez-de-chaussée"
  },
  {
    id: "room-5",
    name: "Le Pigeonnier",
    description: "Gîte atypique sur 2 niveaux aménagé dans l'ancien pigeonnier du mas avec coin cuisine privé.",
    capacity: { adults: 2, children: 2, maxTotal: 4 },
    basePrice: 160,
    seasonalRates: {
      lowSeason: 130,
      midSeason: 160,
      highSeason: 200,
      weekendExtra: 20
    },
    amenities: ["Wi-Fi", "Kitchenette équipée", "Duplex", "Climatisation", "Entrée Indépendante", "Barbecue Privé"],
    photos: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"
    ],
    status: "occupied",
    surface: 38,
    floor: "Bâtiment indépendant"
  }
];

export const initialGuests: Guest[] = [
  {
    id: "guest-1",
    firstName: "Lucas",
    lastName: "Martin",
    email: "lucas.martin@email.fr",
    phone: "06 12 34 56 78",
    address: "12 Rue de la République",
    city: "Lyon",
    country: "France",
    dietaryPreferences: ["Sans Gluten"],
    allergies: ["Fruits à coque"],
    privateNotes: "Client habitué. Fête son anniversaire de mariage lors de ce séjour.",
    vipTag: true,
    createdAt: "2025-09-10"
  },
  {
    id: "guest-2",
    firstName: "Pierre",
    lastName: "Dupont",
    email: "pierre.dupont@orange.fr",
    phone: "06 87 65 43 21",
    address: "45 Avenue Foch",
    city: "Paris",
    country: "France",
    dietaryPreferences: [],
    allergies: [],
    privateNotes: "Préfère un oreiller supplémentaire et le café serré.",
    vipTag: false,
    createdAt: "2026-02-14"
  },
  {
    id: "guest-3",
    firstName: "Emma & Thomas",
    lastName: "Lefebvre",
    email: "t.lefebvre@gmail.com",
    phone: "07 44 22 11 33",
    address: "8 Place du Capitole",
    city: "Toulouse",
    country: "France",
    dietaryPreferences: ["Végétarien"],
    allergies: ["Lactose"],
    privateNotes: "S'intéressent aux cours de cuisine du chef et à la randonnée.",
    vipTag: true,
    createdAt: "2026-04-01"
  },
  {
    id: "guest-4",
    firstName: "Hans & Helga",
    lastName: "Müller",
    email: "h.mueller@berlin-mail.de",
    phone: "+49 171 9876543",
    address: "Kurfürstendamm 110",
    city: "Berlin",
    country: "Allemagne",
    dietaryPreferences: [],
    allergies: ["Arachides"],
    privateNotes: "Parlent allemand et anglais. Amateurs de vins rosés de Provence.",
    vipTag: false,
    createdAt: "2026-05-18"
  },
  {
    id: "guest-5",
    firstName: "Sophie",
    lastName: "Bernard",
    email: "sophie.bernard@sfr.fr",
    phone: "06 55 44 33 22",
    address: "27 Boulevard de la Croisette",
    city: "Cannes",
    country: "France",
    dietaryPreferences: ["Végane"],
    allergies: [],
    privateNotes: "Arrivée tardive vers 19h30.",
    vipTag: false,
    createdAt: "2026-06-02"
  },
  {
    id: "guest-6",
    firstName: "John & Claire",
    lastName: "Smith",
    email: "john.smith@uk-advisors.co.uk",
    phone: "+44 7700 900123",
    address: "14 Kensington Road",
    city: "Londres",
    country: "Royaume-Uni",
    dietaryPreferences: ["Sans Lactose"],
    allergies: [],
    privateNotes: "Demande un taxi pour la gare d'Avignon TGV au départ.",
    vipTag: true,
    createdAt: "2026-06-25"
  }
];

// Today's date setting relative string helper
const today = "2026-08-04";

export const initialBookings: Booking[] = [
  {
    id: "res-1",
    bookingNumber: "RES-2026-081",
    guestId: "guest-1",
    guestName: "Lucas Martin",
    roomId: "room-1",
    roomName: "Chambre Lavande",
    checkIn: "2026-08-04",
    checkOut: "2026-08-07",
    numberOfAdults: 2,
    numberOfChildren: 0,
    status: "checked_in",
    source: "direct",
    nightlyRate: 125,
    totalNights: 3,
    totalRoomAmount: 375,
    touristTaxAmount: 9.00, // 1.50€ * 2 adults * 3 nights
    tableDhotesOption: true,
    tableDhotesMealsCount: 4,
    tableDhotesTotal: 140, // 35€ * 4 repas
    extrasTotal: 20,
    totalAmount: 544,
    depositPaid: 200,
    balanceDue: 344,
    notes: "Arrivée prévue à 15h30.",
    specialRequests: "Bouteille de champagne en chambre à l'arrivée",
    createdDate: "2026-07-10"
  },
  {
    id: "res-2",
    bookingNumber: "RES-2026-079",
    guestId: "guest-2",
    guestName: "Pierre Dupont",
    roomId: "room-2",
    roomName: "Chambre Romarin",
    checkIn: "2026-08-01",
    checkOut: "2026-08-04",
    numberOfAdults: 2,
    numberOfChildren: 0,
    status: "checked_out",
    source: "booking.com",
    nightlyRate: 110,
    totalNights: 3,
    totalRoomAmount: 330,
    touristTaxAmount: 9.00,
    tableDhotesOption: true,
    tableDhotesMealsCount: 2,
    tableDhotesTotal: 70,
    extrasTotal: 15,
    totalAmount: 424,
    depositPaid: 424,
    balanceDue: 0,
    notes: "Départ ce matin effectué à 10h15.",
    createdDate: "2026-06-15"
  },
  {
    id: "res-3",
    bookingNumber: "RES-2026-083",
    guestId: "guest-3",
    guestName: "Emma & Thomas Lefebvre",
    roomId: "room-3",
    roomName: "Suite Olivier",
    checkIn: "2026-08-03",
    checkOut: "2026-08-08",
    numberOfAdults: 2,
    numberOfChildren: 1,
    status: "checked_in",
    source: "direct",
    nightlyRate: 175,
    totalNights: 5,
    totalRoomAmount: 875,
    touristTaxAmount: 15.00, // 1.50€ * 2 adults * 5 nights
    tableDhotesOption: true,
    tableDhotesMealsCount: 6, // 2 adults x 2 nights + 1 child x 2 nights
    tableDhotesTotal: 176,
    extrasTotal: 30,
    totalAmount: 1096,
    depositPaid: 350,
    balanceDue: 746,
    notes: "Aiment participer à la table d'hôtes tous les soirs.",
    specialRequests: "Chaise haute pour l'enfant",
    createdDate: "2026-07-18"
  },
  {
    id: "res-4",
    bookingNumber: "RES-2026-084",
    guestId: "guest-5",
    guestName: "Sophie Bernard",
    roomId: "room-5",
    roomName: "Le Pigeonnier",
    checkIn: "2026-08-04",
    checkOut: "2026-08-09",
    numberOfAdults: 2,
    numberOfChildren: 1,
    status: "confirmed",
    source: "airbnb",
    nightlyRate: 160,
    totalNights: 5,
    totalRoomAmount: 800,
    touristTaxAmount: 15.00,
    tableDhotesOption: true,
    tableDhotesMealsCount: 4,
    tableDhotesTotal: 122,
    extrasTotal: 0,
    totalAmount: 937,
    depositPaid: 300,
    balanceDue: 637,
    notes: "Arrivée prévue ce soir vers 18h00.",
    createdDate: "2026-07-22"
  },
  {
    id: "res-5",
    bookingNumber: "RES-2026-088",
    guestId: "guest-4",
    guestName: "Hans & Helga Müller",
    roomId: "room-2",
    roomName: "Chambre Romarin",
    checkIn: "2026-08-05",
    checkOut: "2026-08-10",
    numberOfAdults: 2,
    numberOfChildren: 0,
    status: "deposit_paid",
    source: "direct",
    nightlyRate: 110,
    totalNights: 5,
    totalRoomAmount: 550,
    touristTaxAmount: 15.00,
    tableDhotesOption: true,
    tableDhotesMealsCount: 4,
    tableDhotesTotal: 140,
    extrasTotal: 25,
    totalAmount: 730,
    depositPaid: 250,
    balanceDue: 480,
    notes: "Réservation confirmée par e-mail.",
    createdDate: "2026-07-28"
  },
  {
    id: "res-6",
    bookingNumber: "RES-2026-090",
    guestId: "guest-6",
    guestName: "John & Claire Smith",
    roomId: "room-4",
    roomName: "Chambre Mimosa",
    checkIn: "2026-08-08",
    checkOut: "2026-08-15",
    numberOfAdults: 2,
    numberOfChildren: 0,
    status: "confirmed",
    source: "abritel",
    nightlyRate: 115,
    totalNights: 7,
    totalRoomAmount: 805,
    touristTaxAmount: 21.00,
    tableDhotesOption: false,
    tableDhotesMealsCount: 0,
    tableDhotesTotal: 0,
    extrasTotal: 0,
    totalAmount: 826,
    depositPaid: 250,
    balanceDue: 576,
    notes: "Séjour d'une semaine.",
    createdDate: "2026-08-01"
  }
];

export const initialDailyMeals: DailyMealMenu[] = [
  {
    id: "meal-1",
    date: "2026-08-04",
    menuTitle: "Menu Provençal du Potager",
    starter: "Tartare de tomates de collection, burrata artisanale au pesto de basilic frais et pignons torréfiés",
    mainCourse: "Filet de loup de mer poêlé, mousseline de courgettes aux fleurs du jardin et réduction au thym",
    cheese: "Plateau de chèvres affinés du Banon et miels du Luberon",
    dessert: "Soupe de pêches de vignes infusée à la verveine du mas et tuile aux amandes",
    wines: "AOP Côtes de Provence Rosé - Cuvée Mas des Lavandes 2025",
    adultPrice: 35,
    childPrice: 18,
    guestRegistrations: [
      {
        id: "reg-1",
        bookingId: "res-1",
        guestName: "Lucas Martin (Chambre Lavande)",
        adults: 2,
        children: 0,
        allergiesNote: "1 convive : Sans Gluten, Allergie Fruits à coque (servir sans pignons)",
        dietaryRestrictions: ["Sans Gluten", "Allergie Fruits à coque"],
        tableNumber: 1
      },
      {
        id: "reg-2",
        bookingId: "res-3",
        guestName: "Emma & Thomas Lefebvre (Suite Olivier)",
        adults: 2,
        children: 1,
        allergiesNote: "1 convive Végétarien + Sans Lactose (remplacer burrata par huile d'olive pimentée)",
        dietaryRestrictions: ["Végétarien", "Sans Lactose"],
        tableNumber: 2
      },
      {
        id: "reg-3",
        bookingId: "res-4",
        guestName: "Sophie Bernard (Le Pigeonnier)",
        adults: 2,
        children: 1,
        allergiesNote: "1 convive Végane (menu dédié courgettes farcies au quinoa et herbes)",
        dietaryRestrictions: ["Végane"],
        tableNumber: 3
      },
      {
        id: "reg-4",
        guestName: "Passants locaux (M. & Mme Moreau)",
        adults: 2,
        children: 0,
        allergiesNote: "Aucune allergie signalée",
        dietaryRestrictions: [],
        tableNumber: 4
      }
    ]
  },
  {
    id: "meal-2",
    date: "2026-08-05",
    menuTitle: "Dîner Terroir & Senteurs de la Garrigue",
    starter: "Gazpacho glacé de poivrons doux confits et croustille de tapenade noire",
    mainCourse: "Carré d'agneau rôti au romarin du jardin, tiède de tians de légumes provençaux",
    cheese: "Faisselle de brebis à la confiture de figues fraîches",
    dessert: "Tarte fine feuilletée aux abricots du Roussillon et glace lavande de Sault",
    wines: "AOP Ventoux Rouge - Domaine des Anges 2023",
    adultPrice: 35,
    childPrice: 18,
    guestRegistrations: [
      {
        id: "reg-5",
        bookingId: "res-1",
        guestName: "Lucas Martin",
        adults: 2,
        children: 0,
        allergiesNote: "Sans Gluten",
        dietaryRestrictions: ["Sans Gluten"],
        tableNumber: 1
      },
      {
        id: "reg-6",
        bookingId: "res-5",
        guestName: "Hans & Helga Müller",
        adults: 2,
        children: 0,
        allergiesNote: "Allergie Arachides",
        dietaryRestrictions: ["Allergie Arachides"],
        tableNumber: 2
      }
    ]
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: "inv-1",
    type: "facture",
    number: "FAC-2026-082",
    date: "2026-08-04",
    dueDate: "2026-08-04",
    bookingId: "res-2",
    guestId: "guest-2",
    guestName: "Pierre Dupont",
    guestAddress: "45 Avenue Foch, 75016 Paris",
    guestEmail: "pierre.dupont@orange.fr",
    items: [
      { id: "item-1", description: "Hébergement Chambre Romarin (3 nuitées)", quantity: 3, unitPrice: 110, totalPrice: 330, tvaRate: 10 },
      { id: "item-2", description: "Table d'Hôtes - Repas Adultes (2 personnes)", quantity: 2, unitPrice: 35, totalPrice: 70, tvaRate: 10 },
      { id: "item-3", description: "Consommations Bar / Café & Jus de fruits", quantity: 1, unitPrice: 15, totalPrice: 15, tvaRate: 20 },
      { id: "item-4", description: "Taxe de séjour (2 adultes x 3 nuits @ 1,50€)", quantity: 6, unitPrice: 1.50, totalPrice: 9, tvaRate: 0 }
    ],
    subtotal: 415,
    touristTaxTotal: 9.00,
    tvaTotal: 38.50,
    totalTTC: 424,
    depositPaid: 424,
    balanceDue: 0,
    status: "paid",
    paymentMethod: "CB"
  },
  {
    id: "inv-2",
    type: "facture",
    number: "FAC-2026-081",
    date: "2026-08-04",
    dueDate: "2026-08-07",
    bookingId: "res-1",
    guestId: "guest-1",
    guestName: "Lucas Martin",
    guestAddress: "12 Rue de la République, 69002 Lyon",
    guestEmail: "lucas.martin@email.fr",
    items: [
      { id: "item-5", description: "Hébergement Chambre Lavande (3 nuitées)", quantity: 3, unitPrice: 125, totalPrice: 375, tvaRate: 10 },
      { id: "item-6", description: "Table d'Hôtes (4 repas adultes)", quantity: 4, unitPrice: 35, totalPrice: 140, tvaRate: 10 },
      { id: "item-7", description: "Bouteille de Champagne en chambre", quantity: 1, unitPrice: 20, totalPrice: 20, tvaRate: 20 },
      { id: "item-8", description: "Taxe de séjour (2 adultes x 3 nuits @ 1,50€)", quantity: 6, unitPrice: 1.50, totalPrice: 9, tvaRate: 0 }
    ],
    subtotal: 535,
    touristTaxTotal: 9.00,
    tvaTotal: 49.50,
    totalTTC: 544,
    depositPaid: 200,
    balanceDue: 344,
    status: "partially_paid",
    paymentMethod: "Virement"
  },
  {
    id: "inv-3",
    type: "devis",
    number: "DEV-2026-014",
    date: "2026-08-02",
    dueDate: "2026-08-15",
    guestId: "guest-6",
    guestName: "John & Claire Smith",
    guestAddress: "14 Kensington Road, London, UK",
    guestEmail: "john.smith@uk-advisors.co.uk",
    items: [
      { id: "item-9", description: "Hébergement Chambre Mimosa (7 nuitées)", quantity: 7, unitPrice: 115, totalPrice: 805, tvaRate: 10 },
      { id: "item-10", description: "Taxe de séjour (2 adultes x 7 nuits @ 1,50€)", quantity: 14, unitPrice: 1.50, totalPrice: 21, tvaRate: 0 }
    ],
    subtotal: 805,
    touristTaxTotal: 21.00,
    tvaTotal: 80.50,
    totalTTC: 826,
    depositPaid: 250,
    balanceDue: 576,
    status: "sent"
  }
];

export const initialHousekeeping: HousekeepingTask[] = [
  {
    id: "hk-1",
    roomId: "room-2",
    roomName: "Chambre Romarin",
    date: "2026-08-04",
    taskType: "checkout_clean",
    status: "to_do",
    assignedTo: "Marie",
    notes: "Départ de M. Dupont. Préparer pour arrivée de M. Müller demain.",
    checklist: [
      { id: "c1", label: "Changement complet des draps et taies d'oreiller", completed: false },
      { id: "c2", label: "Remplacement des serviettes de bain et peignoirs", completed: false },
      { id: "c3", label: "Nettoyage et désinfection de la douche italienne et WC", completed: false },
      { id: "c4", label: "Aspiration et lavage des tommettes au sol", completed: false },
      { id: "c5", label: "Réapprovisionnement eau, tisanes et savon à la lavande", completed: false },
      { id: "c6", label: "Vérification télécommande clim et ampoules", completed: false }
    ]
  },
  {
    id: "hk-2",
    roomId: "room-1",
    roomName: "Chambre Lavande",
    date: "2026-08-04",
    taskType: "stayover_refresh",
    status: "completed",
    assignedTo: "Marie",
    notes: "Recouche quotidienne. M. Martin en séjour.",
    checklist: [
      { id: "c7", label: "Faire le lit et arranger les oreillers", completed: true },
      { id: "c8", label: "Changer serviettes laissées au sol", completed: true },
      { id: "c9", label: "Vider les poubelles et aérer la chambre", completed: true },
      { id: "c10", label: "Recharger la machine Nespresso et bouteilles d'eau", completed: true }
    ]
  },
  {
    id: "hk-3",
    roomId: "room-3",
    roomName: "Suite Olivier",
    date: "2026-08-04",
    taskType: "stayover_refresh",
    status: "in_progress",
    assignedTo: "Jean-Paul",
    notes: "Remplacer le lit bébé et mettre serviettes supplémentaires.",
    checklist: [
      { id: "c11", label: "Faire le lit King size et lit enfant", completed: true },
      { id: "c12", label: "Nettoyer baignoire îlot et miroir", completed: false },
      { id: "c13", label: "Recharger mini-bar", completed: false }
    ]
  },
  {
    id: "hk-4",
    roomId: "room-4",
    roomName: "Chambre Mimosa",
    date: "2026-08-04",
    taskType: "inspection",
    status: "completed",
    assignedTo: "Sophie Dubois",
    notes: "Chambre prête pour l'accueil.",
    checklist: [
      { id: "c14", label: "Inspection globale et contrôle qualité", completed: true },
      { id: "c15", label: "Test climatisation et éclairages", completed: true }
    ]
  }
];

export const initialGiftVouchers: GiftVoucher[] = [
  {
    id: "gv-1",
    code: "BON-2026-GORDES",
    purchaserName: "Famille Roussel",
    beneficiaryName: "Mme & M. Mercier",
    value: 250,
    expiryDate: "2026-12-31",
    status: "valid"
  },
  {
    id: "gv-2",
    code: "BON-2026-CUISINE",
    purchaserName: "Chantal Bonnet",
    beneficiaryName: "Julien Bonnet",
    value: 120,
    expiryDate: "2026-10-15",
    status: "valid"
  }
];

export const initialPaymentRecords: PaymentRecord[] = [
  {
    id: "pay-1",
    date: "2026-08-04",
    invoiceId: "inv-1",
    bookingId: "res-2",
    guestName: "Pierre Dupont",
    amount: 424,
    method: "CB",
    type: "solde",
    notes: "Paiement intégral au départ par carte bancaire"
  },
  {
    id: "pay-2",
    date: "2026-07-10",
    bookingId: "res-1",
    guestName: "Lucas Martin",
    amount: 200,
    method: "Virement",
    type: "acompte",
    notes: "Acompte de réservation reçu par virement"
  },
  {
    id: "pay-3",
    date: "2026-07-18",
    bookingId: "res-3",
    guestName: "Emma & Thomas Lefebvre",
    amount: 350,
    method: "CB",
    type: "acompte",
    notes: "Acompte en ligne"
  }
];
