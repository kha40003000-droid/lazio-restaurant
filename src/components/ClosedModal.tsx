import { Clock, X } from 'lucide-react';
import { workingHoursLabel } from '../lib';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ClosedModal({ open, onClose }: Props) {
  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center p-4 transition-opacity duration-300 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold-400/25 bg-ink-900 shadow-gold-lg animate-slide-up">
        <div className="h-1.5 w-full bg-gradient-to-l from-italian-red via-cream-200 to-italian-green" />
        <div className="px-6 py-8 text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/30">
            <Clock className="h-8 w-8 text-red-300" />
          </div>
          <h3 className="font-display text-xl font-bold text-cream-50">
            المطعم مغلق حالياً
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-cream-300/75">
            نسعد بخدمتكم يومياً من
            <br />
            <span className="font-bold text-gold-300">12:00 ظهراً</span>{' '}
            <span className="text-cream-300/60">(والجمعة من 2:00 ظهراً)</span> وحتى{' '}
            <span className="font-bold text-gold-300">4:00 فجراً</span>
          </p>
          <p className="mt-2 text-xs text-cream-300/50">{workingHoursLabel()}</p>

          <button
            onClick={onClose}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gold-400/30 px-5 py-2.5 text-sm font-semibold text-cream-100 transition-colors hover:bg-ink-800"
          >
            <X className="h-4 w-4" />
            تصفح المنيو فقط
          </button>
        </div>
      </div>
    </div>
  );
}
