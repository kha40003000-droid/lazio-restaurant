import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { MenuItem, Size, CartItem } from '../types';
import { uid } from '../lib';
import { useCart } from '../cart';

interface Props {
  item: MenuItem;
  category: string;
}

export function ItemCard({ item, category }: Props) {
  const { add } = useCart();
  const sizes = Object.keys(item.prices) as Size[];
  const [size, setSize] = useState<Size>(sizes[0]);
  const [qty, setQty] = useState(1);

  const unitPrice = item.prices[size] ?? 0;

  const handleAdd = () => {
    const cartItem: CartItem = {
      id: uid(),
      name: item.name,
      category,
      size,
      basePrice: unitPrice,
      qty,
      unitPrice,
      lineTotal: unitPrice * qty,
    };
    add(cartItem);
    setQty(1);
  };

  return (
    <div className="card-lift flex w-full flex-col overflow-hidden rounded-xl border border-gold-400/15 bg-ink-850 shadow-card hover:border-gold-400/35">
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-l from-crimson-500/70 via-crimson-700/30 to-transparent" />

      <div className="flex flex-1 flex-col px-4 py-3">
        {/* Name */}
        <h3 className="mb-1.5 font-display text-sm font-bold leading-tight text-cream-50">
          {item.name}
        </h3>
        <p className="mb-2.5 truncate text-[10px] text-cream-300/45">{category}</p>

        {/* Circular size badges — tight, clickable */}
        <div className="mb-2.5 flex items-center gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className="flex flex-col items-center gap-0.5"
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-full border text-[10px] font-black transition-all ${
                  s === size
                    ? 'border-crimson-500 bg-crimson-500 text-cream-50'
                    : 'border-gold-400/25 bg-ink-800 text-gold-300 hover:border-gold-400/55'
                }`}
              >
                {s}
              </span>
              <span className="text-[9px] font-semibold text-cream-300/55">
                {item.prices[s]}
              </span>
            </button>
          ))}
        </div>

        {/* Quantity + Add — compact row */}
        <div className="mt-auto flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-lg border border-ink-600 bg-ink-800 p-0.5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-6 w-6 place-items-center rounded text-cream-200 transition-colors hover:bg-ink-600"
              aria-label="إنقاص"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-5 text-center text-xs font-bold text-cream-50">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              className="grid h-6 w-6 place-items-center rounded text-cream-200 transition-colors hover:bg-ink-600"
              aria-label="زيادة"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-crimson-500 px-2 py-2 text-xs font-bold text-cream-50 transition-all hover:bg-crimson-400 active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            إضافة
            <span className="text-[10px] opacity-80">{unitPrice * qty} ج.م</span>
          </button>
        </div>
      </div>
    </div>
  );
}
