import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../cart';

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, onClose, onCheckout }: Props) {
  const { items, setQty, remove, subtotal, count, clear } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-md flex-col border-r border-gold-400/20 bg-ink-900 shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gold-400/15 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gold-400" />
            <h2 className="font-display text-lg font-bold text-cream-50">
              سلة الطلبات
            </h2>
            {count > 0 && (
              <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-xs font-bold text-gold-300">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-cream-200 transition-colors hover:bg-ink-700"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 grid h-20 w-20 place-items-center rounded-2xl border border-gold-400/20 bg-ink-850">
              <ShoppingBag className="h-9 w-9 text-gold-400/40" />
            </div>
            <p className="font-semibold text-cream-100">السلة فارغة</p>
            <p className="mt-1 text-sm text-cream-300/60">
              أضف بعض الأطباق الشهية لتبدأ طلبك
            </p>
          </div>
        ) : (
          <>
            <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-3">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className="rounded-xl border border-ink-600 bg-ink-850 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-cream-50">
                          {it.name}
                        </p>
                        <p className="text-xs text-cream-300/60">
                          {it.size}
                          {it.stuffedCrust && ` · ${it.stuffedCrust.label}`}
                          {it.sauces?.ranch && ' · رانش'}
                          {it.sauces?.bbq && ' · باربكيو'}
                          {it.sharqiPizza && ` · ${it.sharqiPizza.label}`}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(it.id)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        aria-label="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-lg border border-ink-600 bg-ink-800 p-0.5">
                        <button
                          onClick={() => setQty(it.id, it.qty - 1)}
                          className="grid h-6 w-6 place-items-center rounded-md text-cream-200 hover:bg-ink-600"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-cream-50">
                          {it.qty}
                        </span>
                        <button
                          onClick={() => setQty(it.id, it.qty + 1)}
                          className="grid h-6 w-6 place-items-center rounded-md text-cream-200 hover:bg-ink-600"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-end">
                        <p className="text-xs text-cream-300/60">
                          {it.unitPrice} × {it.qty}
                        </p>
                        <p className="font-bold text-gold-300">
                          {it.lineTotal} ج.م
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gold-400/15 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-cream-200/80">الإجمالي الفرعي</span>
                <span className="font-display text-xl font-black text-gold-300">
                  {subtotal} ج.م
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clear}
                  className="rounded-xl border border-ink-600 px-4 py-3 text-sm font-semibold text-cream-200/70 transition-colors hover:border-red-500/40 hover:text-red-400"
                >
                  مسح
                </button>
                <button
                  onClick={onCheckout}
                  className="flex-1 rounded-xl bg-crimson-500 px-4 py-3 text-sm font-bold text-cream-50 transition-all hover:bg-crimson-400 active:scale-[0.98]"
                >
                  إتمام الطلب
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
