import { RotateCcw, X, ShoppingBag } from 'lucide-react';
import type { SavedOrder } from '../types';

interface Props {
  order: SavedOrder | null;
  onReorder: () => void;
  onDismiss: () => void;
}

export function ReorderBanner({ order, onReorder, onDismiss }: Props) {
  if (!order) return null;
  const itemsCount = order.items.reduce((s, i) => s + i.qty, 0);
  const date = new Date(order.timestamp).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <div className="gradient-border relative overflow-hidden rounded-2xl border border-gold-400/20 bg-ink-850 p-4 shadow-card sm:p-5">
        <div className="pointer-events-none absolute -left-12 top-0 h-full w-44 bg-gold-400/8 blur-3xl" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-400/12 ring-1 ring-gold-400/30">
              <ShoppingBag className="h-5 w-5 text-gold-300" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-cream-50 sm:text-base">
                إعادة طلب نفس الطلب الأخير
              </p>
              <p className="mt-0.5 text-xs text-cream-300/70">
                {itemsCount} صنف · إجمالي {order.total} ج.م · {date}
                {order.gps ? ` · توصيل ${order.deliveryFee} ج.م` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReorder}
              className="inline-flex items-center gap-2 rounded-xl bg-crimson-500 px-4 py-2.5 text-sm font-bold text-cream-50 transition-all hover:bg-crimson-400 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              إعادة الطلب
            </button>
            <button
              onClick={onDismiss}
              className="grid h-9 w-9 place-items-center rounded-lg text-cream-200/70 transition-colors hover:bg-ink-700 hover:text-cream-50"
              aria-label="إخفاء"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
