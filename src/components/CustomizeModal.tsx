import { useEffect, useState } from 'react';
import { X, Plus, Minus, Check, SlidersHorizontal } from 'lucide-react';
import type { MenuItem, Size, StuffedCrustKey, CartItem } from '../types';
import {
  SAUCE_PRICE,
  STUFFED_CRUST_OPTIONS,
  PIZZA_CATEGORY,
  PIE_CATEGORY,
  SHARQI_PIZZA_PRICE,
  SHARQI_PIZZA_LABEL,
} from '../data';
import { uid } from '../lib';
import { useCart } from '../cart';

interface Props {
  open: boolean;
  item: MenuItem | null;
  itemCategory: string;
  onClose: () => void;
}

export function CustomizeModal({ open, item, itemCategory, onClose }: Props) {
  const { add } = useCart();
  const isPizza = itemCategory === PIZZA_CATEGORY;
  const isPie = itemCategory === PIE_CATEGORY;

  const sizes = item ? (Object.keys(item.prices) as Size[]) : [];
  const [size, setSize] = useState<Size>('M');
  const [crust, setCrust] = useState<StuffedCrustKey>('none');
  const [ranch, setRanch] = useState(false);
  const [bbq, setBbq] = useState(false);
  const [sharqi, setSharqi] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (item && open) {
      const s = Object.keys(item.prices) as Size[];
      setSize(s[0]);
      setCrust('none');
      setRanch(false);
      setBbq(false);
      setSharqi(false);
      setQty(1);
    }
  }, [item, open]);

  if (!item) return null;

  const basePrice = item.prices[size] ?? 0;
  const crustOpt = STUFFED_CRUST_OPTIONS.find((o) => o.key === crust)!;
  const crustPrice = crustOpt.price;
  const sauceUnit = SAUCE_PRICE[size];
  const saucePrice = (ranch ? sauceUnit : 0) + (bbq ? sauceUnit : 0);
  const sharqiPrice = sharqi ? (SHARQI_PIZZA_PRICE[size] ?? 0) : 0;
  const unitPrice = basePrice + crustPrice + saucePrice + sharqiPrice;

  const handleAdd = () => {
    const cartItem: CartItem = {
      id: uid(),
      name: item.name,
      category: itemCategory,
      size,
      basePrice,
      qty,
      unitPrice,
      lineTotal: unitPrice * qty,
      ...(isPizza && {
        stuffedCrust:
          crust !== 'none'
            ? { key: crust, label: crustOpt.label, price: crustPrice }
            : undefined,
        sauces:
          ranch || bbq ? { ranch, bbq, price: saucePrice } : undefined,
      }),
      ...(isPie && sharqi && {
        sharqiPizza: { label: SHARQI_PIZZA_LABEL, price: sharqiPrice },
      }),
    };
    add(cartItem);
    onClose();
  };

  const title = isPizza ? 'تخصيص البيتزا' : 'تخصيص الفطيرة';

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-end justify-center p-0 transition-opacity duration-300 sm:items-center sm:p-4 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-gold-400/25 bg-ink-900 shadow-gold-lg animate-slide-up sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold-400/12 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-crimson-500/12 ring-1 ring-crimson-500/25">
              <SlidersHorizontal className="h-4 w-4 text-gold-300" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-cream-50">{title}</h3>
              <p className="text-xs text-cream-300/60">{item.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-cream-200 transition-colors hover:bg-ink-700"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-5">
          {/* Size selector (shared) */}
          <Section title="الحجم" hint="اختر الحجم الأساسي">
            <div className="flex gap-3">
              {sizes.map((s) => (
                <CircleSize
                  key={s}
                  label={s}
                  price={item.prices[s]!}
                  active={s === size}
                  onClick={() => setSize(s)}
                />
              ))}
            </div>
          </Section>

          {/* Pizza: stuffed crust + sauces */}
          {isPizza && (
            <>
              <Section title="حشو الأطراف موتزاريلا" hint="حجم مستقل عن حجم البيتزا">
                <div className="grid grid-cols-4 gap-2">
                  {STUFFED_CRUST_OPTIONS.map((o) => (
                    <button
                      key={o.key}
                      onClick={() => setCrust(o.key)}
                      className={`flex flex-col items-center rounded-xl border px-2 py-2.5 transition-all ${
                        o.key === crust
                          ? 'border-gold-400 bg-gold-400/12 text-cream-50'
                          : 'border-ink-600 bg-ink-800 text-cream-200/60 hover:border-gold-400/40'
                      }`}
                    >
                      <span className="text-sm font-bold">{o.short}</span>
                      <span className="mt-0.5 text-[10px] text-gold-300">
                        {o.price === 0 ? 'بدون' : `+${o.price}`}
                      </span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="إضافات الصوص" hint={`+${sauceUnit} ج.م لكل صوص (حجم ${size})`}>
                <div className="grid grid-cols-2 gap-2.5">
                  <SauceChip active={ranch} onClick={() => setRanch((v) => !v)} label="صوص رانش" price={sauceUnit} />
                  <SauceChip active={bbq} onClick={() => setBbq((v) => !v)} label="صوص باربكيو" price={sauceUnit} />
                </div>
              </Section>
            </>
          )}

          {/* Pie: البيتزا الشرقي */}
          {isPie && (
            <Section
              title={SHARQI_PIZZA_LABEL}
              hint={`+${SHARQI_PIZZA_PRICE[size] ?? 0} ج.م (حسب الحجم ${size})`}
            >
              <SauceChip
                active={sharqi}
                onClick={() => setSharqi((v) => !v)}
                label={SHARQI_PIZZA_LABEL}
                price={SHARQI_PIZZA_PRICE[size] ?? 0}
              />
            </Section>
          )}

          {/* Quantity */}
          <Section title="الكمية">
            <div className="flex w-fit items-center gap-2 rounded-xl border border-ink-600 bg-ink-800 p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-8 w-8 place-items-center rounded-lg text-cream-200 transition-colors hover:bg-ink-600"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-bold text-cream-50">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="grid h-8 w-8 place-items-center rounded-lg text-cream-200 transition-colors hover:bg-ink-600"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="border-t border-gold-400/12 px-6 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-cream-300/70">الإجمالي</span>
            <span className="font-display text-xl font-black text-gold-300">
              {unitPrice * qty} ج.م
            </span>
          </div>
          <button
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-crimson-500 py-3.5 text-sm font-bold text-cream-50 transition-all hover:bg-crimson-400 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            إضافة للطلب
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h4 className="text-sm font-bold text-cream-50">{title}</h4>
        {hint && <span className="text-[11px] text-cream-300/50">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function CircleSize({
  label,
  price,
  active,
  onClick,
}: {
  label: string;
  price: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border py-3 transition-all ${
        active
          ? 'border-gold-400 bg-gold-400/10 shadow-gold-glow'
          : 'border-ink-600 bg-ink-800 hover:border-gold-400/40'
      }`}
    >
      <span
        className={`grid h-10 w-10 place-items-center rounded-full text-sm font-black ${
          active ? 'bg-crimson-500 text-cream-50' : 'bg-ink-600 text-cream-200'
        }`}
      >
        {label}
      </span>
      <span className="text-xs font-bold text-gold-300">{price} ج.م</span>
    </button>
  );
}

function SauceChip({
  active,
  onClick,
  label,
  price,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  price: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border px-3 py-3 transition-all ${
        active
          ? 'border-gold-400 bg-gold-400/12 text-cream-50'
          : 'border-ink-600 bg-ink-800 text-cream-200/70 hover:border-gold-400/40'
      }`}
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        {active && <Check className="h-3.5 w-3.5 text-gold-300" />}
        {label}
      </span>
      <span className="text-xs font-bold text-gold-300">+{price}</span>
    </button>
  );
}
