import { Plus } from 'lucide-react';
import type { MenuItem, Size } from '../types';
import { SHARQI_PIZZA_LABEL, SHARQI_PIZZA_PRICE } from '../data';

interface Props {
  item: MenuItem;
  category: string;
  onCustomize: (item: MenuItem) => void;
}

export function PieCard({ item, onCustomize }: Props) {
  const sizes = Object.keys(item.prices) as Size[];
  const minPrice = Math.min(...sizes.map((s) => item.prices[s]!));
  const maxPrice = Math.max(...sizes.map((s) => item.prices[s]!));

  return (
    <div className="card-lift flex w-full flex-col overflow-hidden rounded-xl border border-gold-400/15 bg-ink-850 shadow-card hover:border-gold-400/35">
      <div className="h-1 w-full bg-gradient-to-l from-crimson-500/70 via-crimson-700/30 to-transparent" />

      <div className="flex flex-1 flex-col px-4 py-3">
        {/* Name + chip */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-bold leading-tight text-cream-50">
            {item.name}
          </h3>
          <span className="shrink-0 rounded bg-crimson-500/12 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-crimson-300 ring-1 ring-crimson-500/25">
            فطيرة
          </span>
        </div>

        {/* Circular size badges — tight */}
        <div className="mb-2.5 flex items-center gap-2">
          {sizes.map((s) => (
            <div key={s} className="flex flex-col items-center gap-0.5">
              <span className="grid h-7 w-7 place-items-center rounded-full border border-gold-400/25 bg-ink-800 text-[10px] font-black text-gold-300">
                {s}
              </span>
              <span className="text-[9px] font-semibold text-cream-300/55">
                {item.prices[s]}
              </span>
            </div>
          ))}
          <div className="mr-auto flex flex-col items-end leading-none">
            <span className="text-[9px] text-cream-300/45">يبدأ من</span>
            <span className="font-display text-sm font-black text-cream-50">
              {minPrice}
              {maxPrice !== minPrice && (
                <span className="text-[10px] font-medium text-cream-300/50"> — {maxPrice}</span>
              )}
              <span className="mr-0.5 text-[9px] font-medium text-gold-300">ج.م</span>
            </span>
          </div>
        </div>

        {/* Sharqi hint */}
        <p className="mb-2 truncate text-[10px] text-cream-300/50">
          {SHARQI_PIZZA_LABEL}: +{SHARQI_PIZZA_PRICE['S']} / +{SHARQI_PIZZA_PRICE['L']} ج.م
        </p>

        {/* Compact customize button */}
        <button
          onClick={() => onCustomize(item)}
          className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-lg bg-crimson-500 px-3 py-2 text-xs font-bold text-cream-50 transition-all hover:bg-crimson-400 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          تخصيص الإضافات
        </button>
      </div>
    </div>
  );
}
