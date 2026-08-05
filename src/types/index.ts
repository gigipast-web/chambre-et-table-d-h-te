export type RoomStatus = 'available' | 'occupied' | 'cleaning_needed' | 'maintenance';

export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: {
    adults: number;
    children: number;
    maxTotal: number;
  };
  basePrice: number;
  seasonalRates: {
    lowSeason: number;
    midSeason: number;
    highSeason: number;
    weekendExtra: number;
  };
  amenities: string[];
  photos: string[];
  status: RoomStatus;
  surface: number; // in m²
  floor: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  dietaryPreferences: string[];
  allergies: string[];
  privateNotes: string;
  vipTag?: boolean;
  createdAt: string;
}

export type BookingStatus = 'confirmed' | 'deposit_paid' | 'checked_in' | 'checked_out' | 'cancelled';
export type BookingSource = 'direct' | 'airbnb' | 'booking.com' | 'abritel' | 'phone';

export interface Booking {
  id: string;
  bookingNumber: string;
  guestId: string;
  guestName: string;
  roomId: string;
  roomName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  numberOfAdults: number;
  numberOfChildren: number;
  status: BookingStatus;
  source: BookingSource;
  nightlyRate: number;
  totalNights: number;
  totalRoomAmount: number;
  touristTaxAmount: number;
  tableDhotesOption: boolean;
  tableDhotesMealsCount: number;
  tableDhotesTotal: number;
  extrasTotal: number;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  notes?: string;
  specialRequests?: string;
  createdDate: string;
}

export interface MealRegistration {
  id: string;
  bookingId?: string;
  guestId?: string;
  guestName: string;
  adults: number;
  children: number;
  allergiesNote?: string;
  dietaryRestrictions?: string[];
  tableNumber?: number;
  specialRequests?: string;
}

export interface DailyMealMenu {
  id: string;
  date: string; // YYYY-MM-DD
  menuTitle: string;
  starter: string;
  mainCourse: string;
  cheese?: string;
  dessert: string;
  wines?: string;
  adultPrice: number;
  childPrice: number;
  guestRegistrations: MealRegistration[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  tvaRate: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'cancelled';
export type PaymentMethod = 'CB' | 'Espèces' | 'Chèque' | 'Virement' | 'ANCV';

export interface Invoice {
  id: string;
  type: 'facture' | 'devis';
  number: string;
  date: string;
  dueDate: string;
  bookingId?: string;
  guestId?: string;
  guestName: string;
  guestAddress: string;
  guestEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  touristTaxTotal: number;
  tvaTotal: number;
  totalTTC: number;
  depositPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
}

export type HousekeepingStatus = 'to_do' | 'in_progress' | 'completed';

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  taskType: 'checkout_clean' | 'stayover_refresh' | 'deep_clean' | 'inspection';
  status: HousekeepingStatus;
  assignedTo: string;
  notes?: string;
  checklist: Array<{
    id: string;
    label: string;
    completed: boolean;
  }>;
}

export interface ICalFeed {
  id: string;
  name: string;
  platform: string;
  url: string;
  roomId: string;
  lastSync?: string;
}

export interface EstablishmentSettings {
  name: string;
  ownerName: string;
  address: string;
  phone: string;
  email: string;
  siret: string;
  tvaNumber: string;
  touristTaxRate: number; // Euro per adult/night
  defaultTvaRate: number; // e.g. 10
  wifiSsid: string;
  wifiPassword: string;
  checkInTime: string;
  checkOutTime: string;
  iCalFeeds: ICalFeed[];
}

export interface GiftVoucher {
  id: string;
  code: string;
  purchaserName: string;
  beneficiaryName: string;
  value: number;
  expiryDate: string;
  status: 'valid' | 'used' | 'expired';
}

export interface PaymentRecord {
  id: string;
  date: string;
  invoiceId?: string;
  bookingId?: string;
  guestName: string;
  amount: number;
  method: PaymentMethod;
  type: 'acompte' | 'solde' | 'table_dhotes' | 'extra';
  notes?: string;
}
