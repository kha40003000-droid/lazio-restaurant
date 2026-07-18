import { useEffect, useState } from 'react';
import { CartProvider, useCart } from './cart';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Menu } from './components/Menu';
import { CartDrawer } from './components/CartDrawer';
import { Checkout } from './components/Checkout';
import { ReorderBanner } from './components/ReorderBanner';
import { ClosedModal } from './components/ClosedModal';
import { ReceiptView } from './components/ReceiptView';
import {
  loadLastOrder,
  clearLastOrder,
  isRestaurantOpen,
  workingHoursLabel,
  readOrderDataFromUrl,
} from './lib';
import type { SavedOrder, ReceiptPayload } from './types';
import { RESTAURANT } from './data';

type View = 'menu' | 'checkout';

function AppInner() {
  const { count, clear, add } = useCart();
  const [view, setView] = useState<View>('menu');
  const [cartOpen, setCartOpen] = useState(false);
  const [closedOpen, setClosedOpen] = useState(false);
  const [open, setOpen] = useState(() => isRestaurantOpen());
  const [bannerOrder, setBannerOrder] = useState<SavedOrder | null>(() =>
    loadLastOrder<SavedOrder>(),
  );
  // Interactive receipt from ?orderData=
  const [receiptPayload, setReceiptPayload] = useState<ReceiptPayload | null>(() =>
    readOrderDataFromUrl<ReceiptPayload>(),
  );

  // Re-check open status every minute
  useEffect(() => {
    const id = setInterval(() => setOpen(isRestaurantOpen()), 60_000);
    return () => clearInterval(id);
  }, []);

  const goToCheckout = () => {
    if (!open) {
      setClosedOpen(true);
      return;
    }
    setCartOpen(false);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToMenu = () => {
    setView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reorder = () => {
    if (!open) {
      setClosedOpen(true);
      return;
    }
    if (!bannerOrder) return;
    clear();
    bannerOrder.items.forEach((it) =>
      add({ ...it, id: it.id + '-' + Date.now() }),
    );
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dismissBanner = () => {
    clearLastOrder();
    setBannerOrder(null);
  };

  // Exit interactive receipt view and return to menu
  const exitReceiptView = () => {
    setReceiptPayload(null);
    // Strip ?orderData= from the URL so the menu loads normally on refresh
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('orderData');
      window.history.replaceState({}, document.title, url.toString());
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Interactive receipt view takes over the screen
  if (receiptPayload) {
    return (
      <ReceiptView payload={receiptPayload} onBack={exitReceiptView} />
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 text-cream-100">
      <Header
        cartCount={count}
        onCartClick={() => setCartOpen(true)}
        open={open}
      />

      {view === 'menu' ? (
        <main>
          <Hero />
          {bannerOrder && (
            <ReorderBanner
              order={bannerOrder}
              onReorder={reorder}
              onDismiss={dismissBanner}
            />
          )}
          <Menu />
          <Footer />
        </main>
      ) : (
        <main>
          <Checkout onBack={backToMenu} />
          <Footer />
        </main>
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={goToCheckout}
      />
      <ClosedModal open={closedOpen} onClose={() => setClosedOpen(false)} />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gold-400/12 bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="text-center sm:text-right">
            <span
              className="text-2xl font-black tracking-[0.18em] text-cream-50"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              LAZIO
            </span>
            <div className="my-2 h-[3px] w-16 italian-flag rounded-full" />
            <p className="font-serif text-sm text-gold-300/90">بيتزا لاتسيو</p>
            <p className="mt-2 text-xs text-cream-300/55">
              {RESTAURANT.address}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 text-center sm:items-end">
            <div className="flex items-center gap-2 rounded-full bg-crimson-500/12 px-4 py-2 ring-1 ring-crimson-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson-400 animate-pulse" />
              <span className="text-xs font-semibold text-gold-200">
                {workingHoursLabel()}
              </span>
            </div>
            <a
              href={`tel:${RESTAURANT.phone}`}
              className="text-sm font-semibold text-gold-300 hover:text-gold-200"
              dir="ltr"
            >
              {RESTAURANT.phone}
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-ink-700 pt-6 text-center text-xs text-cream-300/40">
          © {new Date().getFullYear()} LAZIO · بيتزا لاتسيو · جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}
