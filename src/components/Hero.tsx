import { ChevronDown, UtensilsCrossed } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-gold-400/8 blur-3xl" />
        <div className="absolute -left-32 top-1/2 h-96 w-96 rounded-full bg-gold-700/8 blur-3xl" />
      </div>

      {/* Subtle vertical grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, #C5A880 1px, transparent 1px)',
          backgroundSize: '64px 100%',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        {/* Italian flag accent bar */}
        <div className="mx-auto mb-8 h-[3px] w-24 italian-flag rounded-full animate-fade-in" />

        <p className="mb-3 font-serif text-sm text-gold-300/90 tracking-wide animate-fade-up">
          الطعم الإيطالي الأصيل
        </p>

        <h1
          className="text-6xl font-black leading-none tracking-[0.12em] text-cream-50 sm:text-7xl lg:text-8xl animate-fade-up"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          LAZIO
        </h1>

        <p className="mt-4 font-display text-xl font-light text-cream-200/70 animate-fade-up">
          بيتزا لاتسيو
        </p>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-cream-300/60 sm:text-base animate-fade-up">
          عجينة طازجة يومياً، موتزاريلا فاخرة، صوص إيطالي أصيل، وحشوات
          مختارة بعناية. من قلب الجيزة إلى مائدتك.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up">
          <a
            href="#menu"
            className="inline-flex items-center gap-2 rounded-full bg-crimson-500 px-7 py-3.5 text-sm font-bold text-cream-50 shadow-crimson transition-all hover:bg-crimson-400 hover:shadow-crimson-lg active:scale-95"
          >
            <UtensilsCrossed className="h-4 w-4" />
            تصفح المنيو
          </a>
          <a
            href="#menu"
            className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-transparent px-7 py-3.5 text-sm font-semibold text-cream-100 transition-all hover:border-gold-400/60 hover:bg-gold-400/5"
          >
            اطلب الآن
          </a>
        </div>

        <a
          href="#menu"
          className="mt-14 inline-flex flex-col items-center gap-1 text-cream-300/40 transition-colors hover:text-gold-300 animate-fade-in"
        >
          <span className="text-[10px] tracking-widest">SCROLL</span>
          <ChevronDown className="h-4 w-4 animate-float" />
        </a>
      </div>
    </section>
  );
}
