import { forwardRef } from 'react';
import { RESTAURANT } from '../data';
import type { CartItem, CustomerInfo, GpsLocation } from '../types';
import { formatDistance } from '../lib';

interface Props {
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  gps: GpsLocation | null;
  distanceM: number | null;
  orderTime: Date;
  orderRefCode: string;
}

export const PaperReceipt = forwardRef<HTMLDivElement, Props>(function PaperReceipt(
  {
    customer,
    items,
    subtotal,
    deliveryFee,
    total,
    gps,
    distanceM,
    orderTime,
    orderRefCode,
  },
  ref,
) {
  const payLabel =
    customer.payment === 'cash'
      ? 'كاش عند الاستلام'
      : 'فيزا مع الدليفري عند الاستلام';

  const fullAddress = [
    customer.street,
    customer.house && `عمارة ${customer.house}`,
    customer.floor && `دور ${customer.floor}`,
    customer.apartment && `شقة ${customer.apartment}`,
    customer.landmark,
  ]
    .filter(Boolean)
    .join('، ');

  const fmtTime = (d: Date) =>
    d.toLocaleString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <div
      ref={ref}
      className="paper-receipt receipt-top receipt-bottom relative w-full max-w-[360px] rounded-md px-6 py-8 text-ink-900 shadow-receipt"
      style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
    >
      {/* Brand header */}
      <div className="flex flex-col items-center text-center">
        <span
          className="text-3xl font-black tracking-[0.18em] text-ink-900"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          LAZIO
        </span>
        <div className="my-2 h-[3px] w-16 italian-flag rounded-full" />
        <p className="font-serif text-xs font-bold text-ink-800">بيتزا لاتسيو</p>
        <p className="mt-1 text-[10px] text-ink-700/70">{RESTAURANT.address}</p>
        <p className="text-[10px] text-ink-700/70" dir="ltr">
          {RESTAURANT.phone}
        </p>
      </div>

      <Dashed />

      {/* Meta */}
      <div className="space-y-1 text-[11px] text-ink-800">
        <Row label="رقم الطلب" value={`#${orderRefCode}`} />
        <Row label="وقت الطلب" value={fmtTime(orderTime)} />
        <Row label="التوصيل المتوقع" value="30 - 60 دقيقة" />
      </div>

      <Dashed />

      {/* Customer (live binding) */}
      <div className="space-y-1 text-[11px] text-ink-800">
        <p className="font-bold text-ink-900">العميل: {customer.name || '—'}</p>
        <p dir="ltr" className="text-right">
          الهاتف: {customer.phone || '—'}
        </p>
        <p>العنوان: {fullAddress || '—'}</p>
        {gps && (
          <p className="break-all text-[10px] text-ink-700/70" dir="ltr">
            GPS: {gps.mapsUrl}
          </p>
        )}
      </div>

      <Dashed />

      {/* Items */}
      <table className="w-full text-[11px] text-ink-800">
        <thead>
          <tr className="border-b border-ink-700/40 text-ink-900">
            <th className="py-1 text-right font-bold">الصنف</th>
            <th className="py-1 text-center font-bold">×</th>
            <th className="py-1 text-left font-bold">السعر</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-3 text-center text-ink-700/50">
                لا توجد أصناف بعد
              </td>
            </tr>
          ) : (
            items.map((it) => (
              <tr key={it.id} className="border-b border-dotted border-ink-700/25">
                <td className="py-1.5 pr-1 text-right align-top">
                  <div className="font-semibold text-ink-900">{it.name}</div>
                  <div className="text-[10px] text-ink-700/70">
                    {it.size}
                    {it.stuffedCrust && ` · ${it.stuffedCrust.label}`}
                    {it.sauces?.ranch && ' · رانش'}
                    {it.sauces?.bbq && ' · باربكيو'}
                    {it.sharqiPizza && ` · ${it.sharqiPizza.label}`}
                  </div>
                </td>
                <td className="py-1.5 text-center align-top">{it.qty}</td>
                <td className="py-1.5 pl-1 text-left align-top font-semibold">
                  {it.lineTotal}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Dashed />

      {/* Totals */}
      <div className="space-y-1 text-[11px] text-ink-800">
        <Row label="الإجمالي الفرعي" value={`${subtotal} ج.م`} />
        <Row
          label="رسوم التوصيل"
          value={
            distanceM != null
              ? `${deliveryFee} ج.م · ${formatDistance(distanceM)}`
              : gps
                ? `${deliveryFee} ج.م`
                : 'بانتظار الموقع'
          }
        />
      </div>

      <div className="mt-3 flex items-center justify-between rounded-md bg-ink-900 px-3 py-2.5 text-cream-50">
        <span className="text-xs font-bold">الإجمالي</span>
        <span className="text-xl font-black text-gold-300">{total} ج.م</span>
      </div>

      <Dashed />

      <div className="space-y-1 text-[11px] text-ink-800">
        <Row label="الدفع" value={payLabel} />
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-col items-center text-center">
        <p className="text-[11px] font-bold text-ink-900">شكراً لاختياركم LAZIO</p>
        <p className="text-[10px] text-ink-700/70">نتمنى لكم وجبة شهية</p>
        <div className="mt-2 flex gap-1 text-gold-500">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="text-[11px]">★</span>
          ))}
        </div>
      </div>
    </div>
  );
});

function Dashed() {
  return <div className="my-3 border-t-2 border-dashed border-ink-700/30" />;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-ink-700/80">{label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  );
}
