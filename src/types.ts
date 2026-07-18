export type Size = 'S' | 'M' | 'L';

export type Prices = Partial<Record<Size, number>>;

export interface MenuItem {
  name: string;
  prices: Prices;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export type StuffedCrustKey =
  | 'none'
  | 'stuffed_crust_s'
  | 'stuffed_crust_m'
  | 'stuffed_crust_l';

export interface SauceAddon {
  ranch: boolean;
  bbq: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  category: string;
  size: Size;
  basePrice: number;
  qty: number;
  // Pizza-only extras
  stuffedCrust?: {
    key: StuffedCrustKey;
    label: string;
    price: number;
  };
  sauces?: {
    ranch: boolean;
    bbq: boolean;
    price: number;
  };
  // Pie-only extra (البيتزا الشرقي) — price depends on selected size
  sharqiPizza?: {
    label: string;
    price: number;
  };
  unitPrice: number; // base + extras
  lineTotal: number; // unitPrice * qty
}

export interface CustomerInfo {
  name: string;
  phone: string;
  street: string;
  house: string;
  floor: string;
  apartment: string;
  landmark: string;
  payment: 'cash' | 'visa';
}

export interface GpsLocation {
  lat: number;
  lng: number;
  mapsUrl: string;
}

export interface SavedOrder {
  customer: CustomerInfo;
  gps: GpsLocation | null;
  items: CartItem[];
  deliveryFee: number;
  total: number;
  timestamp: number;
  orderRefCode?: string;
}

/** Shape encoded into the ?orderData= URL for the interactive receipt view. */
export interface ReceiptPayload {
  customer: CustomerInfo;
  items: CartItem[];
  deliveryFee: number;
  total: number;
  subtotal: number;
  gps: GpsLocation | null;
  distanceM: number | null;
  orderRefCode: string;
  orderTime: number; // epoch ms
}
