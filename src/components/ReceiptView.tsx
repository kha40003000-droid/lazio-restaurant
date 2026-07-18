import { Printer, ArrowRight } from 'lucide-react';
import { PaperReceipt } from './PaperReceipt';
import type { ReceiptPayload } from '../types';
import { RESTAURANT } from '../data';

interface Props {
  payload: ReceiptPayload;
  onBack: () => void;
}

export function ReceiptView({ payload, onBack }: Props) {
  const {
    customer,
    items,
    deliveryFee,
    total,
    subtotal,
    gps,
    distanceM,
    orderRefCode,
    orderTime,
  } = payload;

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-ink-950 print:bg-white">
      {/* Top bar — hidden when printing */}
      <div className="sticky top-0 z-30 border-b border-gold-400/12 bg-ink-950/90 backdrop-blur-2xl print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-gold-400/25 px-3 py-2 text-sm font-semibold text-cream-100 transition-colors hover:bg-ink-800"
          >
            <ArrowRight className="h-4 w-4" />
            العودة
          </button>
          <div className="text-center">
            <p className="font-display text-sm font-bold text-cream-50">
              عرض الفاتورة التفاعلية
            </p>
            <p className="text-[10px] text-cream-300/50">#{orderRefCode}</p>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-crimson-500 px-3 py-2 text-sm font-bold text-cream-50 transition-colors hover:bg-crimson-400"
          >
            <Printer className="h-4 w-4" />
            طباعة
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-10 sm:px-6">
        {/* Restaurant banner */}
        <div className="mb-6 text-center print:hidden">
          <span
            className="text-3xl font-black tracking-[0.18em] text-cream-50"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            LAZIO
          </span>
          <div className="mx-auto my-2 h-[3px] w-16 italian-flag rounded-full" />
          <p className="font-serif text-sm text-gold-300/90">بيتزا لاتسيو</p>
          <p className="mt-1 text-xs text-cream-300/55">{RESTAURANT.address}</p>
        </div>

        <PaperReceipt
          customer={customer}
          items={items}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          gps={gps}
          distanceM={distanceM}
          orderTime={new Date(orderTime)}
          orderRefCode={orderRefCode}
        />
      </div>
    </div>
  );
}
