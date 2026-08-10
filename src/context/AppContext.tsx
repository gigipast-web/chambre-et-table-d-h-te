import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
  Room,
  Guest,
  Booking,
  DailyMealMenu,
  Invoice,
  HousekeepingTask,
  EstablishmentSettings,
  GiftVoucher,
  PaymentRecord,
  MealRegistration
} from '../types';
import {
  initialRooms,
  initialGuests,
  initialBookings,
  initialDailyMeals,
  initialInvoices,
  initialHousekeeping,
  initialSettings,
  initialGiftVouchers,
  initialPaymentRecords
} from '../data/initialData';

interface AppContextType {
  rooms: Room[];
  guests: Guest[];
  bookings: Booking[];
  dailyMeals: DailyMealMenu[];
  invoices: Invoice[];
  housekeeping: HousekeepingTask[];
  settings: EstablishmentSettings;
  giftVouchers: GiftVoucher[];
  payments: PaymentRecord[];
  isSyncing: boolean;

  // Room actions
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;

  // Guest actions
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt'>) => Guest;
  updateGuest: (guest: Guest) => void;
  deleteGuest: (id: string) => void;

  // Booking actions
  addBooking: (booking: Omit<Booking, 'id' | 'bookingNumber' | 'createdDate'>) => Booking;
  batchImportBookingsAndGuests: (
    items: Array<{
      guestData: Omit<Guest, 'id' | 'createdAt'>;
      bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdDate'> & {
        bookingNumber?: string;
      };
    }>
  ) => { importedBookingsCount: number; importedGuestsCount: number };
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;

  // Table d'hôte actions
  addDailyMeal: (meal: Omit<DailyMealMenu, 'id'>) => void;
  updateDailyMeal: (meal: DailyMealMenu) => void;
  deleteDailyMeal: (id: string) => void;
  addGuestToMeal: (mealId: string, registration: Omit<MealRegistration, 'id'>) => void;
  removeGuestFromMeal: (mealId: string, registrationId: string) => void;

  // Invoice actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'number'>) => Invoice;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  createInvoiceFromBooking: (bookingId: string, type?: 'facture' | 'devis') => Invoice;

  // Housekeeping actions
  updateHousekeepingStatus: (taskId: string, status: HousekeepingTask['status']) => void;
  toggleHousekeepingChecklist: (taskId: string, itemIdx: number) => void;
  addHousekeepingTask: (task: Omit<HousekeepingTask, 'id'>) => void;

  // Settings & Extras
  updateSettings: (newSettings: EstablishmentSettings) => void;
  updateSubscription: (planId: import('../types').SubscriptionPlanId, cycle?: 'monthly' | 'yearly', cardLast4?: string) => void;
  startProTrial: () => void;
  cancelSubscription: () => void;
  addGiftVoucher: (voucher: Omit<GiftVoucher, 'id'>) => void;
  updateGiftVoucherStatus: (id: string, status: GiftVoucher['status']) => void;
  addPaymentRecord: (payment: Omit<PaymentRecord, 'id'>) => void;

  // Reset & Clear Demo
  resetDemoData: () => void;
  clearDemoDataAndApplyNewParameters: (customSettings?: Partial<EstablishmentSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'gite_manager_app_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [dailyMeals, setDailyMeals] = useState<DailyMealMenu[]>(initialDailyMeals);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>(initialHousekeeping);
  const [settings, setSettings] = useState<EstablishmentSettings>(initialSettings);
  const [giftVouchers, setGiftVouchers] = useState<GiftVoucher[]>(initialGiftVouchers);
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPaymentRecords);

  // Load from Firestore on User change
  useEffect(() => {
    if (!user) {
      // Fallback to local storage if no user logged in
      const savedSettings = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
      if (savedSettings) {
        try { setSettings({ ...initialSettings, ...JSON.parse(savedSettings) }); } catch (e) {}
      }
      return;
    }

    let isMounted = true;
    const loadUserData = async () => {
      setIsSyncing(true);
      try {
        const dataDocRef = doc(db, 'users', user.uid, 'workspace', 'data');
        const docSnap = await getDoc(dataDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (isMounted) {
            if (data.rooms) setRooms(data.rooms);
            if (data.guests) setGuests(data.guests);
            if (data.bookings) setBookings(data.bookings);
            if (data.dailyMeals) setDailyMeals(data.dailyMeals);
            if (data.invoices) setInvoices(data.invoices);
            if (data.housekeeping) setHousekeeping(data.housekeeping);
            if (data.settings) setSettings({ ...initialSettings, ...data.settings });
            if (data.giftVouchers) setGiftVouchers(data.giftVouchers);
            if (data.payments) setPayments(data.payments);
          }
        } else {
          // Initialize fresh data for this user
          const isDemoAccount = user.email === 'demo@domaine-lavandes.fr';

          const customSettings: EstablishmentSettings = {
            ...initialSettings,
            name: userProfile?.establishmentName || 'Mon Établissement',
            ownerName: userProfile?.displayName || user.displayName || 'Gérant',
            email: user.email || initialSettings.email,
            subscription: {
              planId: 'free',
              planName: 'Formule Découverte (Gratuit)',
              status: 'active',
              billingCycle: 'monthly',
              priceEuro: 0,
              startDate: new Date().toISOString().split('T')[0],
              renewalDate: 'Sans engagement'
            }
          };

          const starterRoom: Room[] = [
            {
              id: "room-1",
              name: "Chambre 1",
              description: "Première chambre de votre établissement.",
              capacity: {
                adults: 2,
                children: 1,
                maxTotal: 3
              },
              basePrice: 90,
              seasonalRates: {
                lowSeason: 80,
                midSeason: 90,
                highSeason: 110,
                weekendExtra: 10
              },
              amenities: ["Wifi Gratuit", "Lit Double", "Salle de bain privée", "Climatisation"],
              photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"],
              status: "available",
              surface: 22,
              floor: "Rez-de-chaussée"
            }
          ];

          const initialPayload = isDemoAccount ? {
            rooms: initialRooms,
            guests: initialGuests,
            bookings: initialBookings,
            dailyMeals: initialDailyMeals,
            invoices: initialInvoices,
            housekeeping: initialHousekeeping,
            settings: customSettings,
            giftVouchers: initialGiftVouchers,
            payments: initialPaymentRecords
          } : {
            rooms: starterRoom,
            guests: [],
            bookings: [],
            dailyMeals: [],
            invoices: [],
            housekeeping: [],
            settings: customSettings,
            giftVouchers: [],
            payments: []
          };

          if (isMounted) {
            setRooms(initialPayload.rooms);
            setGuests(initialPayload.guests);
            setBookings(initialPayload.bookings);
            setDailyMeals(initialPayload.dailyMeals);
            setInvoices(initialPayload.invoices);
            setHousekeeping(initialPayload.housekeeping);
            setSettings(customSettings);
            setGiftVouchers(initialPayload.giftVouchers);
            setPayments(initialPayload.payments);
          }
          await setDoc(dataDocRef, initialPayload);
        }
      } catch (err) {
        console.error("Error loading user data from Firestore:", err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    loadUserData();

    return () => { isMounted = false; };
  }, [user, userProfile]);

  // Helper to sanitize undefined values before sending to Firestore
  const sanitizeForFirestore = (obj: any) => {
    return JSON.parse(JSON.stringify(obj, (key, value) => (value === undefined ? null : value)));
  };

  // Save changes to Firestore & Local Storage
  const saveToFirestore = async (overrideData?: Partial<{
    rooms: Room[];
    guests: Guest[];
    bookings: Booking[];
    dailyMeals: DailyMealMenu[];
    invoices: Invoice[];
    housekeeping: HousekeepingTask[];
    settings: EstablishmentSettings;
    giftVouchers: GiftVoucher[];
    payments: PaymentRecord[];
  }>) => {
    // Save to local storage for instant offline resilience
    try {
      if (overrideData?.settings) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(overrideData.settings));
      }
    } catch (e) {}

    if (!user) return;
    try {
      const dataDocRef = doc(db, 'users', user.uid, 'workspace', 'data');
      const payload = sanitizeForFirestore({
        rooms: overrideData?.rooms ?? rooms,
        guests: overrideData?.guests ?? guests,
        bookings: overrideData?.bookings ?? bookings,
        dailyMeals: overrideData?.dailyMeals ?? dailyMeals,
        invoices: overrideData?.invoices ?? invoices,
        housekeeping: overrideData?.housekeeping ?? housekeeping,
        settings: overrideData?.settings ?? settings,
        giftVouchers: overrideData?.giftVouchers ?? giftVouchers,
        payments: overrideData?.payments ?? payments,
        updatedAt: new Date().toISOString()
      });
      await setDoc(dataDocRef, payload, { merge: true });
    } catch (e) {
      console.warn("Firestore sync warning:", e);
    }
  };

  // ROOM ACTIONS
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = { ...roomData, id: `room-${Date.now()}` };
    const next = [...rooms, newRoom];
    setRooms(next);
    saveToFirestore({ rooms: next });
  };

  const updateRoom = (updatedRoom: Room) => {
    const next = rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r);
    setRooms(next);
    saveToFirestore({ rooms: next });
  };

  const deleteRoom = (id: string) => {
    const next = rooms.filter(r => r.id !== id);
    setRooms(next);
    saveToFirestore({ rooms: next });
  };

  // GUEST ACTIONS
  const addGuest = (guestData: Omit<Guest, 'id' | 'createdAt'>) => {
    const newGuest: Guest = {
      ...guestData,
      id: `guest-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const next = [newGuest, ...guests];
    setGuests(next);
    saveToFirestore({ guests: next });
    return newGuest;
  };

  const updateGuest = (updatedGuest: Guest) => {
    const next = guests.map(g => g.id === updatedGuest.id ? updatedGuest : g);
    setGuests(next);
    saveToFirestore({ guests: next });
  };

  const deleteGuest = (id: string) => {
    const next = guests.filter(g => g.id !== id);
    setGuests(next);
    saveToFirestore({ guests: next });
  };

  // BOOKING ACTIONS
  const addBooking = (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdDate'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `res-${Date.now()}`,
      bookingNumber: `RES-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    const nextBookings = [newBooking, ...bookings];
    setBookings(nextBookings);

    const todayStr = new Date().toISOString().split('T')[0];
    let nextRooms = rooms;
    if (newBooking.checkIn === todayStr) {
      nextRooms = rooms.map(r => r.id === newBooking.roomId ? { ...r, status: 'occupied' as const } : r);
      setRooms(nextRooms);
    }

    saveToFirestore({ bookings: nextBookings, rooms: nextRooms });
    return newBooking;
  };

  const batchImportBookingsAndGuests = (
    items: Array<{
      guestData: Omit<Guest, 'id' | 'createdAt'>;
      bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdDate'> & {
        bookingNumber?: string;
      };
    }>
  ) => {
    let currentGuests = [...guests];
    let currentBookings = [...bookings];
    let importedGuestsCount = 0;
    let importedBookingsCount = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    items.forEach((item, index) => {
      // Find matching guest by email or by full name
      const emailLower = item.guestData.email.trim().toLowerCase();
      const fullNameLower = `${item.guestData.firstName} ${item.guestData.lastName}`.trim().toLowerCase();

      let targetGuest = currentGuests.find(g => {
        if (emailLower && g.email.trim().toLowerCase() === emailLower) return true;
        const gName = `${g.firstName} ${g.lastName}`.trim().toLowerCase();
        if (fullNameLower && gName === fullNameLower) return true;
        return false;
      });

      if (!targetGuest) {
        targetGuest = {
          ...item.guestData,
          id: `guest-imp-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
          createdAt: todayStr
        };
        currentGuests = [targetGuest, ...currentGuests];
        importedGuestsCount++;
      }

      const bookingNum = item.bookingData.bookingNumber?.trim() || `RES-IMP-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: Booking = {
        ...item.bookingData,
        id: `res-imp-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
        bookingNumber: bookingNum,
        guestId: targetGuest.id,
        guestName: `${targetGuest.firstName} ${targetGuest.lastName}`.trim() || item.bookingData.guestName,
        createdDate: todayStr
      };

      currentBookings = [newBooking, ...currentBookings];
      importedBookingsCount++;
    });

    setGuests(currentGuests);
    setBookings(currentBookings);
    saveToFirestore({ guests: currentGuests, bookings: currentBookings });

    return { importedBookingsCount, importedGuestsCount };
  };

  const updateBooking = (updatedBooking: Booking) => {
    const next = bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b);
    setBookings(next);
    saveToFirestore({ bookings: next });
  };

  const deleteBooking = (id: string) => {
    const next = bookings.filter(b => b.id !== id);
    setBookings(next);
    saveToFirestore({ bookings: next });
  };

  // MEAL ACTIONS
  const addDailyMeal = (mealData: Omit<DailyMealMenu, 'id'>) => {
    const newMeal: DailyMealMenu = { ...mealData, id: `meal-${Date.now()}` };
    const next = [newMeal, ...dailyMeals];
    setDailyMeals(next);
    saveToFirestore({ dailyMeals: next });
  };

  const updateDailyMeal = (updatedMeal: DailyMealMenu) => {
    const next = dailyMeals.map(m => m.id === updatedMeal.id ? updatedMeal : m);
    setDailyMeals(next);
    saveToFirestore({ dailyMeals: next });
  };

  const deleteDailyMeal = (id: string) => {
    const next = dailyMeals.filter(m => m.id !== id);
    setDailyMeals(next);
    saveToFirestore({ dailyMeals: next });
  };

  const addGuestToMeal = (mealId: string, registration: Omit<MealRegistration, 'id'>) => {
    const newReg: MealRegistration = { ...registration, id: `reg-${Date.now()}` };
    const next = dailyMeals.map(m => {
      if (m.id === mealId) {
        return { ...m, guestRegistrations: [...m.guestRegistrations, newReg] };
      }
      return m;
    });
    setDailyMeals(next);
    saveToFirestore({ dailyMeals: next });
  };

  const removeGuestFromMeal = (mealId: string, registrationId: string) => {
    const next = dailyMeals.map(m => {
      if (m.id === mealId) {
        return {
          ...m,
          guestRegistrations: m.guestRegistrations.filter(r => r.id !== registrationId)
        };
      }
      return m;
    });
    setDailyMeals(next);
    saveToFirestore({ dailyMeals: next });
  };

  // INVOICE ACTIONS
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'number'>) => {
    const prefix = invoiceData.type === 'devis' ? 'DEV' : 'FAC';
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      number: `${prefix}-2026-${Math.floor(100 + Math.random() * 900)}`
    };
    const next = [newInvoice, ...invoices];
    setInvoices(next);
    saveToFirestore({ invoices: next });
    return newInvoice;
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    const next = invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv);
    setInvoices(next);
    saveToFirestore({ invoices: next });
  };

  const deleteInvoice = (id: string) => {
    const next = invoices.filter(inv => inv.id !== id);
    setInvoices(next);
    saveToFirestore({ invoices: next });
  };

  const createInvoiceFromBooking = (bookingId: string, type: 'facture' | 'devis' = 'facture'): Invoice => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error("Réservation introuvable");

    const guest = guests.find(g => g.id === booking.guestId);
    const todayStr = new Date().toISOString().split('T')[0];

    const items = [
      {
        id: `item-b1`,
        description: `Hébergement ${booking.roomName} (${booking.totalNights} nuitée${booking.totalNights > 1 ? 's' : ''})`,
        quantity: booking.totalNights,
        unitPrice: booking.nightlyRate,
        totalPrice: booking.totalRoomAmount,
        tvaRate: settings.defaultTvaRate
      }
    ];

    if (booking.tableDhotesTotal > 0) {
      items.push({
        id: `item-b2`,
        description: `Table d'Hôtes (${booking.tableDhotesMealsCount} repas)`,
        quantity: booking.tableDhotesMealsCount,
        unitPrice: Math.round((booking.tableDhotesTotal / (booking.tableDhotesMealsCount || 1)) * 100) / 100,
        totalPrice: booking.tableDhotesTotal,
        tvaRate: 10
      });
    }

    if (booking.extrasTotal > 0) {
      items.push({
        id: `item-b3`,
        description: `Suppléments & Boissons`,
        quantity: 1,
        unitPrice: booking.extrasTotal,
        totalPrice: booking.extrasTotal,
        tvaRate: 20
      });
    }

    if (booking.touristTaxAmount > 0) {
      const taxRate = typeof settings.touristTaxRate === 'number' && !isNaN(settings.touristTaxRate) ? settings.touristTaxRate : 1.5;
      items.push({
        id: `item-b4`,
        description: `Taxe de séjour (${booking.numberOfAdults} adulte${booking.numberOfAdults > 1 ? 's' : ''} x ${booking.totalNights} nuits @ ${taxRate.toFixed(2)}€)`,
        quantity: booking.numberOfAdults * booking.totalNights,
        unitPrice: taxRate,
        totalPrice: booking.touristTaxAmount,
        tvaRate: 0
      });
    }

    const subtotal = booking.totalRoomAmount + booking.tableDhotesTotal + booking.extrasTotal;
    const defaultTva = typeof settings.defaultTvaRate === 'number' && !isNaN(settings.defaultTvaRate) ? settings.defaultTvaRate : 10;
    const tvaTotal = subtotal * (defaultTva / 100);

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      type,
      number: `${type === 'devis' ? 'DEV' : 'FAC'}-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: todayStr,
      dueDate: booking.checkOut || todayStr,
      bookingId: booking.id,
      guestId: booking.guestId,
      guestName: booking.guestName,
      guestAddress: guest ? `${guest.address}, ${guest.city}` : "",
      guestEmail: guest?.email || "",
      items,
      subtotal,
      touristTaxTotal: booking.touristTaxAmount,
      tvaTotal,
      totalTTC: booking.totalAmount,
      depositPaid: booking.depositPaid,
      balanceDue: booking.balanceDue,
      status: booking.balanceDue === 0 ? 'paid' : (booking.depositPaid > 0 ? 'partially_paid' : 'sent')
    };

    const next = [newInvoice, ...invoices];
    setInvoices(next);
    saveToFirestore({ invoices: next });
    return newInvoice;
  };

  // HOUSEKEEPING ACTIONS
  const updateHousekeepingStatus = (taskId: string, status: HousekeepingTask['status']) => {
    let nextRooms = rooms;
    const nextTasks = housekeeping.map(t => {
      if (t.id === taskId) {
        if (status === 'completed') {
          nextRooms = rooms.map(r => r.id === t.roomId ? { ...r, status: 'available' as const } : r);
          setRooms(nextRooms);
        }
        return { ...t, status };
      }
      return t;
    });
    setHousekeeping(nextTasks);
    saveToFirestore({ housekeeping: nextTasks, rooms: nextRooms });
  };

  const toggleHousekeepingChecklist = (taskId: string, itemIdx: number) => {
    const nextTasks = housekeeping.map(t => {
      if (t.id === taskId) {
        const updatedChecklist = [...t.checklist];
        updatedChecklist[itemIdx] = {
          ...updatedChecklist[itemIdx],
          completed: !updatedChecklist[itemIdx].completed
        };
        const allCompleted = updatedChecklist.every(c => c.completed);
        return {
          ...t,
          checklist: updatedChecklist,
          status: allCompleted ? ('completed' as const) : ('in_progress' as const)
        };
      }
      return t;
    });
    setHousekeeping(nextTasks);
    saveToFirestore({ housekeeping: nextTasks });
  };

  const addHousekeepingTask = (taskData: Omit<HousekeepingTask, 'id'>) => {
    const newTask: HousekeepingTask = { ...taskData, id: `hk-${Date.now()}` };
    const next = [newTask, ...housekeeping];
    setHousekeeping(next);
    saveToFirestore({ housekeeping: next });
  };

  // SETTINGS & EXTRAS
  const updateSettings = (newSettings: EstablishmentSettings) => {
    const rawTax = newSettings.touristTaxPerAdultPerNight ?? newSettings.touristTaxRate;
    const tax = typeof rawTax === 'number' && !isNaN(rawTax) ? rawTax : 1.5;
    const depositPct = typeof newSettings.depositPercentage === 'number' && !isNaN(newSettings.depositPercentage) ? newSettings.depositPercentage : 30;
    const tva = typeof newSettings.defaultTvaRate === 'number' && !isNaN(newSettings.defaultTvaRate) ? newSettings.defaultTvaRate : 10;

    const mergedSettings: EstablishmentSettings = {
      ...initialSettings,
      ...newSettings,
      name: newSettings.name || initialSettings.name,
      ownerName: newSettings.ownerName || initialSettings.ownerName,
      address: newSettings.address || '',
      email: newSettings.email || '',
      phone: newSettings.phone || '',
      siret: newSettings.siret || '',
      tvaNumber: newSettings.tvaNumber || '',
      touristTaxRate: tax,
      touristTaxPerAdultPerNight: tax,
      depositPercentage: depositPct,
      defaultTvaRate: tva,
      wifiSsid: newSettings.wifiSsid || '',
      wifiPassword: newSettings.wifiPassword || '',
      checkInTime: newSettings.checkInTime || '16:00',
      checkOutTime: newSettings.checkOutTime || '11:00',
      iCalFeeds: newSettings.iCalFeeds || []
    };

    setSettings(mergedSettings);
    saveToFirestore({ settings: mergedSettings });
  };

  const updateSubscription = (
    planId: import('../types').SubscriptionPlanId,
    cycle: 'monthly' | 'yearly' = 'monthly',
    cardLast4?: string
  ) => {
    let name = 'Formule Découverte (Gratuit)';
    let price = 0;

    if (planId.startsWith('pro')) {
      name = cycle === 'yearly' ? 'Formule Pro (Annuel)' : 'Formule Pro (Mensuel)';
      price = cycle === 'yearly' ? 180 : 19;
    } else if (planId.startsWith('premium')) {
      name = cycle === 'yearly' ? 'Formule Domaine (Annuel)' : 'Formule Domaine (Mensuel)';
      price = cycle === 'yearly' ? 384 : 39;
    }

    const today = new Date().toISOString().split('T')[0];
    const renewal = new Date();
    if (cycle === 'yearly') {
      renewal.setFullYear(renewal.getFullYear() + 1);
    } else {
      renewal.setMonth(renewal.getMonth() + 1);
    }

    const newSub: import('../types').SubscriptionState = {
      planId,
      planName: name,
      status: 'active',
      billingCycle: cycle,
      priceEuro: price,
      startDate: today,
      renewalDate: planId === 'free' ? 'Sans engagement' : renewal.toISOString().split('T')[0],
      paymentMethodLast4: cardLast4 || settings.subscription?.paymentMethodLast4 || '4242'
    };

    const nextSettings = { ...settings, subscription: newSub };
    setSettings(nextSettings);
    saveToFirestore({ settings: nextSettings });
  };

  const startProTrial = () => {
    const today = new Date();
    const trialEnds = new Date();
    trialEnds.setDate(today.getDate() + 14);

    const newSub: import('../types').SubscriptionState = {
      planId: 'pro_monthly',
      planName: 'Formule Pro (Essai Gratuit 14j)',
      status: 'trialing',
      billingCycle: 'monthly',
      priceEuro: 0,
      startDate: today.toISOString().split('T')[0],
      renewalDate: trialEnds.toISOString().split('T')[0],
      trialEndsDate: trialEnds.toISOString().split('T')[0],
      paymentMethodLast4: 'Carte de test'
    };

    const nextSettings = { ...settings, subscription: newSub };
    setSettings(nextSettings);
    saveToFirestore({ settings: nextSettings });
  };

  const cancelSubscription = () => {
    const newSub: import('../types').SubscriptionState = {
      planId: 'free',
      planName: 'Formule Découverte (Gratuit)',
      status: 'active',
      billingCycle: 'monthly',
      priceEuro: 0,
      startDate: new Date().toISOString().split('T')[0],
      renewalDate: 'Sans engagement'
    };

    const nextSettings = { ...settings, subscription: newSub };
    setSettings(nextSettings);
    saveToFirestore({ settings: nextSettings });
  };

  const addGiftVoucher = (voucherData: Omit<GiftVoucher, 'id'>) => {
    const newVoucher: GiftVoucher = { ...voucherData, id: `gv-${Date.now()}` };
    const next = [newVoucher, ...giftVouchers];
    setGiftVouchers(next);
    saveToFirestore({ giftVouchers: next });
  };

  const updateGiftVoucherStatus = (id: string, status: GiftVoucher['status']) => {
    const next = giftVouchers.map(v => v.id === id ? { ...v, status } : v);
    setGiftVouchers(next);
    saveToFirestore({ giftVouchers: next });
  };

  const addPaymentRecord = (paymentData: Omit<PaymentRecord, 'id'>) => {
    const newPayment: PaymentRecord = { ...paymentData, id: `pay-${Date.now()}` };
    const nextPayments = [newPayment, ...payments];
    setPayments(nextPayments);

    let nextInvoices = invoices;
    if (paymentData.invoiceId) {
      nextInvoices = invoices.map(inv => {
        if (inv.id === paymentData.invoiceId) {
          const newDeposit = inv.depositPaid + paymentData.amount;
          const newBalance = Math.max(0, inv.totalTTC - newDeposit);
          return {
            ...inv,
            depositPaid: newDeposit,
            balanceDue: newBalance,
            status: newBalance === 0 ? ('paid' as const) : ('partially_paid' as const),
            paymentMethod: paymentData.method
          };
        }
        return inv;
      });
      setInvoices(nextInvoices);
    }

    saveToFirestore({ payments: nextPayments, invoices: nextInvoices });
  };

  // RESET & CLEAR DEMO
  const resetDemoData = () => {
    setRooms(initialRooms);
    setGuests(initialGuests);
    setBookings(initialBookings);
    setDailyMeals(initialDailyMeals);
    setInvoices(initialInvoices);
    setHousekeeping(initialHousekeeping);
    setSettings(initialSettings);
    setGiftVouchers(initialGiftVouchers);
    setPayments(initialPaymentRecords);
    saveToFirestore({
      rooms: initialRooms,
      guests: initialGuests,
      bookings: initialBookings,
      dailyMeals: initialDailyMeals,
      invoices: initialInvoices,
      housekeeping: initialHousekeeping,
      settings: initialSettings,
      giftVouchers: initialGiftVouchers,
      payments: initialPaymentRecords
    });
  };

  const clearDemoDataAndApplyNewParameters = (customSettings?: Partial<EstablishmentSettings>) => {
    const mergedSettings: EstablishmentSettings = {
      ...initialSettings,
      name: customSettings?.name || userProfile?.establishmentName || settings.name || 'Mon Établissement',
      ownerName: customSettings?.ownerName || userProfile?.displayName || settings.ownerName || 'Gérant',
      email: customSettings?.email || user?.email || settings.email || initialSettings.email,
      siret: customSettings?.siret || '',
      wifiSsid: customSettings?.wifiSsid || '',
      wifiPassword: customSettings?.wifiPassword || '',
      iCalFeeds: [],
      subscription: settings.subscription || {
        planId: 'free',
        planName: 'Formule Découverte (Gratuit)',
        status: 'active',
        billingCycle: 'monthly',
        priceEuro: 0,
        startDate: new Date().toISOString().split('T')[0],
        renewalDate: 'Sans engagement'
      }
    };

    const starterRoom: Room[] = [
      {
        id: "room-1",
        name: "Chambre 1",
        description: "Première chambre de votre établissement.",
        capacity: {
          adults: 2,
          children: 1,
          maxTotal: 3
        },
        basePrice: 90,
        seasonalRates: {
          lowSeason: 80,
          midSeason: 90,
          highSeason: 110,
          weekendExtra: 10
        },
        amenities: ["Wifi Gratuit", "Lit Double", "Salle de bain privée", "Climatisation"],
        photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"],
        status: "available",
        surface: 22,
        floor: "Rez-de-chaussée"
      }
    ];

    setRooms(starterRoom);
    setGuests([]);
    setBookings([]);
    setDailyMeals([]);
    setInvoices([]);
    setHousekeeping([]);
    setSettings(mergedSettings);
    setGiftVouchers([]);
    setPayments([]);

    saveToFirestore({
      rooms: starterRoom,
      guests: [],
      bookings: [],
      dailyMeals: [],
      invoices: [],
      housekeeping: [],
      settings: mergedSettings,
      giftVouchers: [],
      payments: []
    });
  };

  return (
    <AppContext.Provider
      value={{
        rooms,
        guests,
        bookings,
        dailyMeals,
        invoices,
        housekeeping,
        settings,
        giftVouchers,
        payments,
        isSyncing,
        addRoom,
        updateRoom,
        deleteRoom,
        addGuest,
        updateGuest,
        deleteGuest,
        addBooking,
        batchImportBookingsAndGuests,
        updateBooking,
        deleteBooking,
        addDailyMeal,
        updateDailyMeal,
        deleteDailyMeal,
        addGuestToMeal,
        removeGuestFromMeal,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        createInvoiceFromBooking,
        updateHousekeepingStatus,
        toggleHousekeepingChecklist,
        addHousekeepingTask,
        updateSettings,
        updateSubscription,
        startProTrial,
        cancelSubscription,
        addGiftVoucher,
        updateGiftVoucherStatus,
        addPaymentRecord,
        resetDemoData,
        clearDemoDataAndApplyNewParameters
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
