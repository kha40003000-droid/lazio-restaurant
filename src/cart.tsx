import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem } from './types';
import { loadCart, saveCart } from './lib';

interface CartCtx {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart<CartItem[]>() ?? []);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const api = useMemo<CartCtx>(() => {
    const add = (item: CartItem) =>
      setItems((prev) => {
        const idx = prev.findIndex(
          (p) =>
            p.name === item.name &&
            p.category === item.category &&
            p.size === item.size &&
            p.stuffedCrust?.key === item.stuffedCrust?.key &&
            p.sauces?.ranch === item.sauces?.ranch &&
            p.sauces?.bbq === item.sauces?.bbq &&
            !!p.sharqiPizza === !!item.sharqiPizza,
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            qty: next[idx].qty + item.qty,
            lineTotal: (next[idx].unitPrice) * (next[idx].qty + item.qty),
          };
          return next;
        }
        return [...prev, item];
      });

    const remove = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

    const setQty = (id: string, qty: number) =>
      setItems((prev) =>
        prev
          .map((p) =>
            p.id === id
              ? { ...p, qty, lineTotal: p.unitPrice * qty }
              : p,
          )
          .filter((p) => p.qty > 0),
      );

    const clear = () => setItems([]);

    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);

    return { items, add, remove, setQty, clear, count, subtotal };
  }, [items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCart must be used within CartProvider');
  return v;
}
