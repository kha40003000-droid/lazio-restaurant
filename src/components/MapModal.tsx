import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, LocateFixed, Check, X, Loader2 } from 'lucide-react';
import { RESTAURANT } from '../data';
import {
  computeDeliveryFee,
  formatDistance,
  makeMapsUrl,
} from '../lib';
import type { GpsLocation } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (loc: GpsLocation, fee: number, distanceM: number) => void;
  initial?: GpsLocation | null;
}

export function MapModal({ open, onClose, onConfirm, initial }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [loc, setLoc] = useState<GpsLocation | null>(initial ?? null);
  const [locating, setLocating] = useState(false);

  // Restaurant marker (sleek gold pin)
  const restaurantIcon = L.divIcon({
    className: '',
    html: '<div style="width:20px;height:20px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#8C1D1D;border:2px solid #070707;box-shadow:0 0 0 4px rgba(140,29,29,0.25)"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 18],
  });
  const userIcon = L.divIcon({
    className: '',
    html: '<div style="width:16px;height:16px;border-radius:50%;background:#070707;border:3px solid #C5A880;box-shadow:0 0 0 4px rgba(197,168,128,0.3)"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  useEffect(() => {
    if (!open || !containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [RESTAURANT.coords.lat, RESTAURANT.coords.lng],
      zoom: 14,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);
    L.marker([RESTAURANT.coords.lat, RESTAURANT.coords.lng], { icon: restaurantIcon })
      .addTo(map)
      .bindTooltip('بيتزا لاتسيو', { permanent: false });
    mapRef.current = map;

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setUserPin(lat, lng);
    });

    // ensure correct sizing after mount
    setTimeout(() => map.invalidateSize(), 150);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open && initial) setUserPin(initial.lat, initial.lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const setUserPin = (lat: number, lng: number) => {
    const map = mapRef.current;
    if (!map) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { icon: userIcon, draggable: true })
        .addTo(map)
        .on('dragend', (e) => {
          const m = e.target as L.Marker;
          const p = m.getLatLng();
          setUserPin(p.lat, p.lng);
        });
    }
    setLoc({ lat, lng, mapsUrl: makeMapsUrl(lat, lng) });
  };

  const useMyLocation = () => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const map = mapRef.current;
        setUserPin(latitude, longitude);
        map?.flyTo([latitude, longitude], 16);
        setLocating(false);
      },
      () => {
        alert('تعذّر تحديد موقعك. برجاء تحديد الموقع يدوياً على الخريطة.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const info = loc ? computeDeliveryFee(loc) : null;

  const confirm = () => {
    if (!loc || !info) return;
    // هنا بنبعت تكلفة التوصيل 0 للمطعم دايماً
    onConfirm(loc, 0, info.distanceM);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gold-400/30 bg-ink-900 shadow-gold-lg animate-slide-up">
        <div className="flex items-center justify-between border-b border-gold-400/15 px-5 py-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gold-400" />
            <h3 className="font-display text-lg font-bold text-cream-50">
              حدد موقع التوصيل
            </h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-cream-200 hover:bg-ink-700"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={containerRef}
          className="h-72 w-full sm:h-80"
          style={{ display: open ? 'block' : 'none' }}
        />

        <div className="flex flex-wrap items-center gap-2 px-5 py-3">
          <button
            onClick={useMyLocation}
            disabled={locating}
            className="inline-flex items-center gap-2 rounded-lg border border-gold-400/40 bg-gold-400/10 px-3 py-2 text-sm font-semibold text-gold-200 transition-colors hover:bg-gold-400/20 disabled:opacity-60"
          >
            {locating ? (
              <Loader2 className="h-4 w-4 animate-spin-slow" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            موقعي الحالي
          </button>
          <span className="text-xs text-cream-300/60">
            أو اضغط على الخريطة / اسحب الدبوس
          </span>
        </div>

        {info && loc ? (
          <div className="mx-5 mb-4 rounded-xl border border-gold-400/25 bg-ink-850 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-cream-200/80">المسافة من المطعم</span>
              <span className="font-semibold text-cream-50">
                {formatDistance(info.distanceM)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-cream-200/80">رسوم التوصيل</span>
              {/* تعديل العرض هنا ليصبح ثابت 0 ج.م */}
              <span className="font-display text-lg font-black text-gold-300">
                0 ج.م
              </span>
            </div>
            <p className="mt-2 break-all text-[11px] text-cream-300/50" dir="ltr">
              {loc.mapsUrl}
            </p>
          </div>
        ) : (
          <p className="mx-5 mb-4 rounded-xl border border-ink-600 bg-ink-850 p-4 text-center text-sm text-cream-300/60">
            برجاء تحديد موقعك على الخريطة لحساب رسوم التوصيل
          </p>
        )}

        <div className="flex gap-2 border-t border-gold-400/15 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-ink-600 px-4 py-2.5 text-sm font-semibold text-cream-200/70 hover:border-gold-400/40"
          >
            إلغاء
          </button>
          <button
            onClick={confirm}
            disabled={!loc}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-crimson-500 px-4 py-2.5 text-sm font-bold text-cream-50 transition-all hover:bg-crimson-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            تأكيد الموقع
          </button>
        </div>
      </div>
    </div>
  );
}
