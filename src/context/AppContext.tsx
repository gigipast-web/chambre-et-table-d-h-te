import React, { createContext, useContext, useState, useEffect } from 'react';
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
  addGiftVoucher: (voucher: Omit<GiftVoucher, 'id'>) => void;
  updateGiftVoucherStatus: (id: string, status: GiftVoucher['status']) => void;
  addPaymentRecord: (payment: Omit<PaymentRecord, 'id'>) => void;

  // Reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'gite_manager_app_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_rooms`);
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_guests`);
    return saved ? JSON.parse(saved) : initialGuests;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_bookings`);
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [dailyMeals, setDailyMeals] = useState<DailyMealMenu[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_meals`);
    return saved ? JSON.parse(saved) : initialDailyMeals;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_housekeeping`);
    return saved ? JSON.parse(saved) : initialHousekeeping;
  });

  const [settings, setSettings] = useState<EstablishmentSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [giftVouchers, setGiftVouchers] = useState<GiftVoucher[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_vouchers`);
    return saved ? JSON.parse(saved) : initialGiftVouchers;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : initialPaymentRecords;
  });

  // LocalStorage persistence effect
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_rooms`, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_guests`, JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_meals`, JSON.stringify(dailyMeals));
  }, [dailyMeals]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_invoices`, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_housekeeping`, JSON.stringify(housekeeping));
  }, [housekeeping]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_vouchers`, JSON.stringify(giftVouchers));
  }, [giftVouchers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_payments`, JSON.stringify(payments));
  }, [payments]);

  // ROOM ACTIONS
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = { ...roomData, id: `room-${Date.now()}` };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (updatedRoom: Room) => {
    setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  // GUEST ACTIONS
  const addGuest = (guestData: Omit<Guest, 'id' | 'createdAt'>) => {
    const newGuest: Guest = {
      ...guestData,
      id: `guest-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGuests(prev => [newGuest, ...prev]);
    return newGuest;
  };

  const updateGuest = (updatedGuest: Guest) => {
    setGuests(prev => prev.map(g => g.id === updatedGuest.id ? updatedGuest : g));
  };

  const deleteGuest = (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
  };

  // BOOKING ACTIONS
  const addBooking = (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdDate'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `res-${Date.now()}`,
      bookingNumber: `RES-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setBookings(prev => [newBooking, ...prev]);

    // Update room status if checking in today
    const todayStr = new Date().toISOString().split('T')[0];
    if (newBooking.checkIn === todayStr) {
      setRooms(prev => prev.map(r => r.id === newBooking.roomId ? { ...r, status: 'occupied' } : r));
    }

    return newBooking;
  };

  const updateBooking = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  // MEAL ACTIONS
  const addDailyMeal = (mealData: Omit<DailyMealMenu, 'id'>) => {
    const newMeal: DailyMealMenu = { ...mealData, id: `meal-${Date.now()}` };
    setDailyMeals(prev => [newMeal, ...prev]);
  };

  const updateDailyMeal = (updatedMeal: DailyMealMenu) => {
    setDailyMeals(prev => prev.map(m => m.id === updatedMeal.id ? updatedMeal : m));
  };

  const deleteDailyMeal = (id: string) => {
    setDailyMeals(prev => prev.filter(m => m.id !== id));
  };

  const addGuestToMeal = (mealId: string, registration: Omit<MealRegistration, 'id'>) => {
    const newReg: MealRegistration = { ...registration, id: `reg-${Date.now()}` };
    setDailyMeals(prev => prev.map(m => {
      if (m.id === mealId) {
        return { ...m, guestRegistrations: [...m.guestRegistrations, newReg] };
      }
      return m;
    }));
  };

  const removeGuestFromMeal = (mealId: string, registrationId: string) => {
    setDailyMeals(prev => prev.map(m => {
      if (m.id === mealId) {
        return {
          ...m,
          guestRegistrations: m.guestRegistrations.filter(r => r.id !== registrationId)
        };
      }
      return m;
    }));
  };

  // INVOICE ACTIONS
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'number'>) => {
    const prefix = invoiceData.type === 'devis' ? 'DEV' : 'FAC';
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      number: `${prefix}-2026-${Math.floor(100 + Math.random() * 900)}`
    };
    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
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
      items.push({
        id: `item-b4`,
        description: `Taxe de séjour (${booking.numberOfAdults} adulte${booking.numberOfAdults > 1 ? 's' : ''} x ${booking.totalNights} nuits @ ${settings.touristTaxRate.toFixed(2)}€)`,
        quantity: booking.numberOfAdults * booking.totalNights,
        unitPrice: settings.touristTaxRate,
        totalPrice: booking.touristTaxAmount,
        tvaRate: 0
      });
    }

    const subtotal = booking.totalRoomAmount + booking.tableDhotesTotal + booking.extrasTotal;
    const tvaTotal = subtotal * (settings.defaultTvaRate / 100);

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

    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  // HOUSEKEEPING ACTIONS
  const updateHousekeepingStatus = (taskId: string, status: HousekeepingTask['status']) => {
    setHousekeeping(prev => prev.map(t => {
      if (t.id === taskId) {
        // If task completed, automatically set room status to 'available'
        if (status === 'completed') {
          setRooms(rPrev => rPrev.map(r => r.id === t.roomId ? { ...r, status: 'available' } : r));
        }
        return { ...t, status };
      }
      return t;
    }));
  };

  const toggleHousekeepingChecklist = (taskId: string, itemIdx: number) => {
    setHousekeeping(prev => prev.map(t => {
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
          status: allCompleted ? 'completed' : 'in_progress'
        };
      }
      return t;
    }));
  };

  const addHousekeepingTask = (taskData: Omit<HousekeepingTask, 'id'>) => {
    const newTask: HousekeepingTask = { ...taskData, id: `hk-${Date.now()}` };
    setHousekeeping(prev => [newTask, ...prev]);
  };

  // SETTINGS & EXTRAS
  const updateSettings = (newSettings: EstablishmentSettings) => {
    setSettings(newSettings);
  };

  const addGiftVoucher = (voucherData: Omit<GiftVoucher, 'id'>) => {
    const newVoucher: GiftVoucher = { ...voucherData, id: `gv-${Date.now()}` };
    setGiftVouchers(prev => [newVoucher, ...prev]);
  };

  const updateGiftVoucherStatus = (id: string, status: GiftVoucher['status']) => {
    setGiftVouchers(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  const addPaymentRecord = (paymentData: Omit<PaymentRecord, 'id'>) => {
    const newPayment: PaymentRecord = { ...paymentData, id: `pay-${Date.now()}` };
    setPayments(prev => [newPayment, ...prev]);

    // If linked to an invoice, update deposit or paid balance
    if (paymentData.invoiceId) {
      setInvoices(iPrev => iPrev.map(inv => {
        if (inv.id === paymentData.invoiceId) {
          const newDeposit = inv.depositPaid + paymentData.amount;
          const newBalance = Math.max(0, inv.totalTTC - newDeposit);
          return {
            ...inv,
            depositPaid: newDeposit,
            balanceDue: newBalance,
            status: newBalance === 0 ? 'paid' : 'partially_paid',
            paymentMethod: paymentData.method
          };
        }
        return inv;
      }));
    }
  };

  // RESET
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
    localStorage.clear();
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
        addRoom,
        updateRoom,
        deleteRoom,
        addGuest,
        updateGuest,
        deleteGuest,
        addBooking,
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
        addGiftVoucher,
        updateGiftVoucherStatus,
        addPaymentRecord,
        resetDemoData
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
