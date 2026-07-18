import { Phone, ShoppingCart } from 'lucide-react';
import { RESTAURANT } from '../data';

interface Props {
  cartCount: number;
  onCartClick: () => void;
  open: boolean;
}

export function Header({ cartCount, onCartClick, open }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-gold-400/15 bg-ink-950/90 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <a href="#" className="group flex flex-col items-start leading-none">
          <span className="flex items-end gap-2">
            <span
              className="text-2xl font-black tracking-[0.18em] text-cream-50 sm:text-3xl"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              LAZIO
            </span>
            <span className="hidden font-serif text-xs text-gold-300 sm:inline">
              بيتزا لاتسيو
            </span>
          </span>
          <span className="mt-1 h-[3px] w-16 italian-flag rounded-full opacity-90 transition-all duration-300 group-hover:w-24" />
        </a>

        {/* Center status */}
        <div className="hidden items-center gap-2 lg:flex">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
              open
                ? 'bg-italian-green/15 text-italian-white/90 ring-1 ring-italian-green/40'
                : 'bg-red-500/10 text-red-300 ring-1 ring-red-500/30'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-italian-green' : 'bg-red-400'} ${open ? 'animate-pulse' : ''}`} />
            {open ? 'مفتوح الآن' : 'مغلق حالياً'}
          </span>
          <a
            href={`tel:${RESTAURANT.phone}`}
            className="flex items-center gap-1.5 text-xs text-cream-200/70 transition-colors hover:text-gold-300"
            dir="ltr"
          >
            <Phone className="h-3.5 w-3.5 text-gold-400/80" />
            {RESTAURANT.phone}
          </a>
        </div>

        {/* Cart */}
        <button
          onClick={onCartClick}
          className="relative flex items-center gap-2 rounded-xl bg-crimson-500 px-4 py-2.5 text-sm font-bold text-cream-50 shadow-crimson transition-all hover:bg-crimson-400 active:scale-95"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">السلة</span>
          {cartCount > 0 && (
            <span className="absolute -left-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-italian-red px-1 text-[11px] font-bold text-white ring-2 ring-ink-950 animate-pop">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
