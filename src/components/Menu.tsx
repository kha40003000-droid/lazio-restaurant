import { useEffect, useRef, useState } from 'react';
import { menuData, PIZZA_CATEGORY, PIE_CATEGORY } from '../data';
import type { MenuItem } from '../types';
import { PizzaCard } from './PizzaCard';
import { PieCard } from './PieCard';
import { ItemCard } from './ItemCard';
import { CustomizeModal } from './CustomizeModal';

export function Menu() {
  const [active, setActive] = useState(0);
  const [customItem, setCustomItem] = useState<{ item: MenuItem; category: string } | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(Number((e.target as HTMLElement).dataset.idx));
          }
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToCategory = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section id="menu" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* Sticky category rail */}
        <div className="sticky top-[60px] z-30 -mx-4 mb-10 bg-ink-950/90 px-4 py-3 backdrop-blur-2xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {menuData.map((cat, idx) => (
              <button
                key={cat.category}
                onClick={() => scrollToCategory(idx)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  active === idx
                    ? 'bg-crimson-500 text-cream-50 shadow-crimson'
                    : 'border border-gold-400/15 bg-ink-850 text-cream-200/75 hover:border-gold-400/50 hover:text-cream-50'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {menuData.map((cat, idx) => (
            <div
              key={cat.category}
              data-idx={idx}
              ref={(el) => (sectionRefs.current[idx] = el)}
              className="scroll-mt-32"
            >
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-display text-2xl font-extrabold text-cream-50 sm:text-3xl">
                  {cat.category}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-l from-gold-400/30 to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.items.map((item) => {
                  if (cat.category === PIZZA_CATEGORY) {
                    return (
                      <PizzaCard
                        key={item.name}
                        item={item}
                        onCustomize={(it) => setCustomItem({ item: it, category: cat.category })}
                      />
                    );
                  }
                  if (cat.category === PIE_CATEGORY) {
                    return (
                      <PieCard
                        key={item.name}
                        item={item}
                        category={cat.category}
                        onCustomize={(it) => setCustomItem({ item: it, category: cat.category })}
                      />
                    );
                  }
                  return (
                    <ItemCard
                      key={item.name}
                      item={item}
                      category={cat.category}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CustomizeModal
        open={customItem !== null}
        item={customItem?.item ?? null}
        itemCategory={customItem?.category ?? ''}
        onClose={() => setCustomItem(null)}
      />
    </>
  );
}
