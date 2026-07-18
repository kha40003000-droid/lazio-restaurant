import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  MapPin,
  User,
  Phone,
  Home,
  Building2,
  Layers,
  DoorOpen,
  Navigation,
  Banknote,
  CreditCard,
  Loader2,
  MessageCircle,
  RotateCcw,
  Lock,
  AlertCircle,
} from 'lucide-react';
import type { CartItem, CustomerInfo, SavedOrder, GpsLocation, ReceiptPayload } from '../types';
import { useCart } from '../cart';
import { PaperReceipt } from './PaperReceipt';
import { MapModal } from './MapModal';
import {
  computeDeliveryFee,
  formatDistance,
  isRestaurantOpen,
  loadLastOrder,
  saveLastOrder,
  workingHoursLabel,
  encodeOrderData,
} from '../lib';
import { WHATSAPP_NUMBER, RESTAURANT } from '../data';

interface Props {
  onBack: () => void;
}

const emptyCustomer: CustomerInfo = {
  name: '',
  phone: '',
  street: '',
  house: '',
  floor: '',
  apartment: '',
  landmark: '',
  payment: 'cash',
};

function compressOrderUrl(payload: ReceiptPayload): string {
  try {
    const dataStr = encodeOrderData(payload);
    return `${window.location.origin}?orderData=${dataStr}`;
  } catch {
    return window.location.origin;
  }
}

export function Checkout({ onBack }: Props) {
  const { items, subtotal } = useCart();
  const [customer, setCustomer] = useState<CustomerInfo>(() => {
    try {
      const raw = localStorage.getItem('lazio_customer');
      return raw ? { ...emptyCustomer, ...JSON.parse(raw) } : emptyCustomer;
    } catch {
      return emptyCustomer;
    }
  });
  const [gps, setGps] = useState<GpsLocation | null>(null);
  const [distanceM, setDistanceM] = useState<number | null>(null);
  
  const [mapOpen, setMapOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderRefCode] = useState(() =>
    Math.floor(100000 + Math.random() * 900000).toString(),
  );
  const [orderTime, setOrderTime] = useState(() => new Date());
  const open = isRestaurantOpen();

  useEffect(() => {
    try {
      localStorage.setItem('lazio_customer', JSON.stringify(customer));
    } catch {
      /* ignore */
    }
  }, [customer]);

  const total = subtotal; 
  
  const update = (k: keyof CustomerInfo, v: string) =>
    setCustomer((c) => ({ ...c, [k]: v }));

  const onConfirmGps = (loc: GpsLocation, fee: number, dist: number) => {
    setGps(loc);
    setDistanceM(dist);
  };

  const receiptPayload: ReceiptPayload = useMemo(
    () => ({
      customer,
      items,
      deliveryFee: 0, 
      total,
      subtotal,
      gps,
      distanceM,
      orderRefCode,
      orderTime: orderTime.getTime(),
    }),
    [customer, items, total, subtotal, gps, distanceM, orderRefCode, orderTime],
  );

  const handleSubmit = async () => {
    if (!open) return;
    if (!customer.name.trim() || !customer.phone.trim()) {
      alert('برجاء إدخال الاسم ورقم الهاتف على الأقل');
      return;
    }
    if (items.length === 0) {
      alert('السلة فارغة');
      return;
    }
    setSubmitting(true);
    setOrderTime(new Date());

    saveLastOrder({
      customer,
      gps,
      items,
      deliveryFee: 0,
      total,
      timestamp: Date.now(),
      orderRefCode,
    });

    const receiptUrl = compressOrderUrl(receiptPayload);
    
    const summary = buildOrderSummary(
      customer,
      items,
      total,
      gps,
      distanceM,
      orderRefCode,
      receiptUrl,
    );

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank');

    setSubmitting(false);
    alert('تم تجهيز الطلب! تم فتح واتساب مع تفاصيل الطلب ورابط الفاتورة التفاعلية.');
  };

  const lastOrder = loadLastOrder<SavedOrder>();
  const restoreLastOrder = () => {
    if (!lastOrder) return;
    setCustomer(lastOrder.customer);
    if (lastOrder.gps) {
      setGps(lastOrder.gps);
      setDistanceM(computeDeliveryFee(lastOrder.gps).distanceM);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Top bar */}
      <div className="sticky top-[60px] z-30 border-b border-gold-400/12 bg-ink-950/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-gold-400/25 px-3 py-2 text-sm font-semibold text-cream-100 transition-colors hover:bg-ink-800"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للمنيو
          </button>
          <h2 className="font-display text-lg font-bold text-cream-50 sm:text-xl">
            إتمام الطلب
          </h2>
          {lastOrder && (
            <button
              onClick={restoreLastOrder}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gold-400/12 px-3 py-2 text-xs font-semibold text-gold-200 transition-colors hover:bg-gold-400/22"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              استعادة آخر طلب
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* LEFT: Form */}
          <div className="space-y-5">
            <FormSection title="بيانات العميل">
              <Field
                icon={<User className="h-4 w-4" />}
                label="الاسم"
                value={customer.name}
                onChange={(v) => update('name', v)}
                placeholder="الاسم بالكامل"
              />
              <Field
                icon={<Phone className="h-4 w-4" />}
                label="رقم الهاتف"
                value={customer.phone}
                onChange={(v) => update('phone', v)}
                placeholder="01xxxxxxxxx"
                type="tel"
                dir="ltr"
              />
            </FormSection>

            <FormSection title="عنوان التوصيل">
              <Field
                icon={<Navigation className="h-4 w-4" />}
                label="الشارع"
                value={customer.street}
                onChange={(v) => update('street', v)}
                placeholder="اسم الشارع"
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  icon={<Building2 className="h-4 w-4" />}
                  label="رقم العمارة"
                  value={customer.house}
                  onChange={(v) => update('house', v)}
                  placeholder="12"
                />
                <Field
                  icon={<Layers className="h-4 w-4" />}
                  label="الدور"
                  value={customer.floor}
                  onChange={(v) => update('floor', v)}
                  placeholder="3"
                />
                <Field
                  icon={<DoorOpen className="h-4 w-4" />}
                  label="الشقة"
                  value={customer.apartment}
                  onChange={(v) => update('apartment', v)}
                  placeholder="8"
                />
                <Field
                  icon={<Home className="h-4 w-4" />}
                  label="علامة مميزة"
                  value={customer.landmark}
                  onChange={(v) => update('landmark', v)}
                  placeholder="أمام الصيدلية"
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setMapOpen(true)}
                  className="flex w-full items-center justify-between rounded-xl border border-gold-400/30 bg-gold-400/5 px-4 py-3 text-sm font-semibold text-gold-200 transition-all hover:border-gold-400/60 hover:bg-gold-400/10"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    تحديد الموقع على الخريطة
                  </span>
                  {gps ? (
                    <span className="text-xs text-gold-300 font-medium">
                      المسافة: {distanceM != null ? formatDistance(distanceM) : ''} (التوصيل يُحدد مع المطعم)
                    </span>
                  ) : (
                    <span className="text-xs text-cream-300/50">غير محدد</span>
                  )}
                </button>

                {/* رسالة التنبيه المثبتة تحت اللوكيشن مباشرة */}
                <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-200/90 leading-relaxed">
                  <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    السعر النهائي لا يشمل التوصيل، حساب التوصيل يتم تحديده مع المطعم عبر الـ WhatsApp. لا يتم حساب التوصيل تلقائياً إلا بالتنسيق المباشر.
                  </span>
                </div>
              </div>
            </FormSection>

            <FormSection title="طريقة الدفع">
              <div className="grid grid-cols-1 gap-2">
                <PayOption
                  active={customer.payment === 'cash'}
                  onClick={() => update('payment', 'cash')}
                  icon={<Banknote className="h-5 w-5" />}
                  label="كاش عند الاستلام"
                  desc="ادفع نقداً عند وصول الطلب"
                />
                <PayOption
                  active={customer.payment === 'visa'}
                  onClick={() => update('payment', 'visa')}
                  icon={<CreditCard className="h-5 w-5" />}
                  label="فيزا مع الدليفري عند الاستلام"
                  desc="بطاقة بنكية مع مندوب التوصيل"
                />
              </div>
            </FormSection>

            <button
              onClick={handleSubmit}
              disabled={submitting || !open}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-crimson-500 px-6 py-4 text-base font-bold text-cream-50 shadow-crimson transition-all hover:bg-crimson-400 hover:shadow-crimson-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin-slow" />
              ) : !open ? (
                <Lock className="h-5 w-5" />
              ) : (
                <MessageCircle className="h-5 w-5" />
              )}
              {submitting
                ? 'جاري التجهيز...'
                : !open
                  ? 'المطعم مغلق حالياً'
                  : 'تأكيد الطلب عبر واتساب'}
            </button>

            {!open && (
              <p className="text-center text-xs text-red-300/80">
                {workingHoursLabel()}
              </p>
            )}
          </div>

          {/* RIGHT: Live Receipt */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-l from-gold-400/30 to-transparent" />
              <h3 className="font-display text-sm font-bold text-cream-50">
                الإيصال المباشر
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-gold-400/30 to-transparent" />
            </div>
            <div className="flex justify-center">
              <PaperReceipt
                customer={customer}
                items={items}
                subtotal={subtotal}
                deliveryFee={0} 
                total={total}
                gps={gps}
                distanceM={distanceM}
                orderTime={orderTime}
                orderRefCode={orderRefCode}
                customDeliveryLabel="يتم حساب التوصيل مع المطعم عبر الواتس اب والسعر هذا لا يشمل التوصيل"
              />
            </div>
          </div>
        </div>
      </div>

      <MapModal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        onConfirm={onConfirmGps}
        initial={gps}
      />
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gold-400/15 bg-ink-850 p-5 shadow-card">
      <h3 className="mb-4 font-display text-base font-bold text-cream-50">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  dir,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-cream-200/70">
        {label}
      </span>
      <div className="flex items-center gap-2.5 rounded-xl border border-ink-600 bg-ink-800 px-3.5 py-3 transition-colors focus-within:border-gold-400/60">
        <span className="text-gold-400/80">{icon}</span>
        <input
          type={type}
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-cream-50 placeholder:text-cream-300/40 focus:outline-none"
        />
      </div>
    </label>
  );
}

function PayOption({
  active,
  onClick,
  icon,
  label,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-right transition-all ${
        active
          ? 'border-crimson-500 bg-crimson-500/10 shadow-crimson-glow'
          : 'border-ink-600 bg-ink-800 hover:border-gold-400/40'
      }`}
    >
      <span className={active ? 'text-gold-300' : 'text-cream-200/70'}>{icon}</span>
      <span className="flex-1">
        <span className="block text-sm font-bold text-cream-50">{label}</span>
        <span className="block text-[11px] text-cream-300/60">{desc}</span>
      </span>
      <span
        className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
          active ? 'border-crimson-500 bg-crimson-500' : 'border-ink-600'
        }`}
      >
        {active && <span className="h-2 w-2 rounded-full bg-ink-950" />}
      </span>
    </button>
  );
}

function buildOrderSummary(
  customer: CustomerInfo,
  items: CartItem[],
  total: number,
  gps: GpsLocation | null,
  distanceM: number | null,
  refCode: string,
  receiptUrl: string,
): string {
  const lines: string[] = [];
  lines.push(`*${RESTAURANT.name}* — ${RESTAURANT.tagline}`);
  lines.push(`رقم الطلب: #${refCode}`);
  lines.push('━━━━━━━━━━━━━━━');
  lines.push(`*العميل:* ${customer.name || '—'}`);
  lines.push(`*الهاتف:* ${customer.phone || '—'}`);
  const addr = [
    customer.street,
    customer.house && `عمارة ${customer.house}`,
    customer.floor && `الدور ${customer.floor}`,
    customer.apartment && `شقة ${customer.apartment}`,
    customer.landmark,
  ]
    .filter(Boolean)
    .join('، ');
  lines.push(`*العنوان:* ${addr || '—'}`);
  if (gps) {
    lines.push(`📍 لوكيشن العميل على خرائط جوجل: ${gps.mapsUrl}`);
    if (distanceM != null) lines.push(`*المسافة:* ${formatDistance(distanceM)}`);
  }
  lines.push('━━━━━━━━━━━━━━━');
  lines.push('*تفاصيل الطلب:*');
  items.forEach((it) => {
    let line = `• ${it.name} (${it.size}) × ${it.qty} = ${it.lineTotal} ج.م`;
    const extras: string[] = [];
    if (it.stuffedCrust) extras.push(it.stuffedCrust.label);
    if (it.sauces?.ranch) extras.push('رانش');
    if (it.sauces?.bbq) extras.push('باربكيو');
    if (it.sharqiPizza) extras.push(it.sharqiPizza.label);
    if (extras.length) line += ` [${extras.join('، ')}]`;
    lines.push(line);
  });
  lines.push('━━━━━━━━━━━━━━━');
  lines.push(`الحساب الإجمالي للمنتجات: ${total} ج.م`);
  lines.push(`*التوصيل:* يتم حساب التوصيل مع المطعم عبر الواتس اب والسعر هذا لا يشمل التوصيل`);
  lines.push(
    `طريقة الدفع: ${customer.payment === 'cash' ? 'كاش عند الاستلام' : 'فيزا مع الدليفري عند الاستلام'}`,
  );
  lines.push('━━━━━━━━━━━━━━━');
  lines.push(`🔗 رابط عرض الفاتورة التفاعلية: ${receiptUrl}`);
  return lines.join('\n');
}
