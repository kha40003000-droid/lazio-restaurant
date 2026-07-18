import { DELIVERY, STREET_BOUNDARIES } from './data';
import type { GpsLocation } from './types';

type Point = { lat: number; lng: number };

/** Haversine distance in meters between two coords. */
export function haversineMeters(a: Point, b: Point): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * Shortest distance (meters) from point `p` to the line segment `a`–`b`.
 * Uses a local equirectangular projection so the projection math is sound.
 */
function pointToSegmentMeters(p: Point, a: Point, b: Point): number {
  const toXY = (pt: Point) => {
    const x = pt.lng * Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180)) * 111320;
    const y = pt.lat * 111320;
    return { x, y };
  };
  const P = toXY(p);
  const A = toXY(a);
  const B = toXY(b);
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return haversineMeters(p, a);
  let t = ((P.x - A.x) * dx + (P.y - A.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const closest: Point = {
    lat: a.lat + t * (b.lat - a.lat),
    lng: a.lng + t * (b.lng - a.lng),
  };
  return haversineMeters(p, closest);
}

/**
 * Boundary-based delivery fee for Khatem El Morsaleen street.
 *  - Within 500m of the street line (the corridor) -> base 15 EGP flat.
 *  - Outside the corridor -> distance to the NEAREST street endpoint,
 *    +5 EGP for every 500m (or fraction) beyond the base.
 */
export function computeDeliveryFee(loc: GpsLocation): {
  fee: number;
  distanceM: number;
  steps: number;
  inCorridor: boolean;
} {
  const { west, east } = STREET_BOUNDARIES;
  const distToStreet = pointToSegmentMeters(loc, west, east);

  if (distToStreet <= DELIVERY.corridorWidthM) {
    return {
      fee: DELIVERY.baseFee,
      distanceM: distToStreet,
      steps: 0,
      inCorridor: true,
    };
  }

  const distToNearestEnd = Math.min(
    haversineMeters(loc, west),
    haversineMeters(loc, east),
  );
  const steps = Math.ceil(distToNearestEnd / DELIVERY.stepM);
  return {
    fee: DELIVERY.baseFee + steps * DELIVERY.stepFee,
    distanceM: distToNearestEnd,
    steps,
    inCorridor: false,
  };
}

export function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} م`;
  return `${(m / 1000).toFixed(2)} كم`;
}

export function formatPrice(n: number): string {
  return `${n} ${'ج.م'}`;
}

export function makeMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

const LS_ORDER_KEY = 'lazio_last_order';
const LS_CART_KEY = 'lazio_cart';

export function saveLastOrder(order: unknown): void {
  try {
    localStorage.setItem(LS_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function loadLastOrder<T>(): T | null {
  try {
    const raw = localStorage.getItem(LS_ORDER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearLastOrder(): void {
  try {
    localStorage.removeItem(LS_ORDER_KEY);
  } catch {
    /* ignore */
  }
}

export function saveCart(items: unknown): void {
  try {
    localStorage.setItem(LS_CART_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function loadCart<T>(): T | null {
  try {
    const raw = localStorage.getItem(LS_CART_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Working hours:
 *  - Friday: 2:00 PM -> 4:00 AM (next morning)
 *  - Saturday–Thursday: 12:00 PM (noon) -> 4:00 AM (next morning)
 */
export function isRestaurantOpen(now: Date = new Date()): boolean {
  const h = now.getHours();
  const isFriday = now.getDay() === 5; // 0=Sun ... 5=Fri, 6=Sat
  const openHour = isFriday ? 14 : 12;
  return h >= openHour || h < 4;
}

export function workingHoursLabel(): string {
  return 'يومياً من 12:00 ظهراً (والجمعة من 2:00 ظهراً) وحتى 4:00 فجراً';
}

/** Compress order data into a URL-safe string for the interactive receipt link. */
export function encodeOrderData(data: unknown): string {
  return encodeURIComponent(JSON.stringify(data));
}

export function decodeOrderData<T>(raw: string): T | null {
  try {
    return JSON.parse(decodeURIComponent(raw)) as T;
  } catch {
    return null;
  }
}

/** Read ?orderData= from the current URL, if present. */
export function readOrderDataFromUrl<T>(): T | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('orderData');
    return raw ? decodeOrderData<T>(raw) : null;
  } catch {
    return null;
  }
}
