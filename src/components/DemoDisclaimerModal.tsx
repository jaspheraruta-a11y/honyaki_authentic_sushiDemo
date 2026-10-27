import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Phone, MapPin, ArrowRight, ShieldAlert } from 'lucide-react';
import { DEMO_DISCLAIMER_CONFIG } from '../lib/demoConfig';

interface DemoDisclaimerModalProps {
  /**
   * Optional control prop. If not supplied, the modal reads and writes
   * acknowledgment state from sessionStorage automatically.
   */
  isOpen?: boolean;
  onAcknowledge?: () => void;
}

export const DemoDisclaimerModal: React.FC<DemoDisclaimerModalProps> = ({
  isOpen: controlledIsOpen,
  onAcknowledge,
}) => {
  // Determine initial state: if controlled prop is provided, use it;
  // otherwise inspect sessionStorage to show only on new browsing sessions.
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DEMO_DISCLAIMER_CONFIG.storageKey) !== 'true';
    } catch {
      // In private browsing or environments where sessionStorage is blocked, default to true
      return true;
    }
  });

  const isVisible = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  // Manage body scroll locking and initial focus
  useEffect(() => {
    if (!isVisible) return;

    // Lock background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus primary CTA button after mounting
    const timer = setTimeout(() => {
      primaryButtonRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisible]);

  // Handle focus trap and prevent accidental dismissal via Escape key
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent accidental dismissal via Escape key - visitor MUST explicitly acknowledge
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Keyboard Focus Trap within modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: if on first element, wrap to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isVisible]);

  const handleAcknowledge = () => {
    try {
      sessionStorage.setItem(DEMO_DISCLAIMER_CONFIG.storageKey, 'true');
    } catch (e) {
      console.warn('Unable to persist disclaimer acknowledgment to sessionStorage:', e);
    }

    setInternalIsOpen(false);
    onAcknowledge?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 lg:p-6 bg-black/85 backdrop-blur-md select-none"
      role="presentation"
      // Intentionally do NOT close on backdrop click to satisfy requirement:
      // "Prevent accidental dismissal by clicking outside the modal or pressing Escape."
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-disclaimer-title"
        aria-describedby="demo-disclaimer-description"
        className="relative w-full max-w-xl bg-[#141418] text-[#f4f2ee] rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/95 border border-[#2d2d38] overflow-hidden max-h-[92dvh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none select-text"
      >
        {/* Decorative artisanal red & gold Japanese top accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#d97706]" />

        {/* Modal Scrollable Content Container */}
        <div
          id="demo-disclaimer-description"
          className="p-5 sm:p-7 space-y-5 overflow-y-auto overscroll-contain"
        >
          {/* Header Zone: Badge, Icon & Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                PROPOSAL PREVIEW
              </span>
              <span className="text-neutral-500 text-xs">·</span>
              <span className="text-xs text-neutral-400 font-medium">
                Valencia City, Bukidnon
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#991b1b]/15 border border-[#991b1b]/35 text-[#f87171] flex items-center justify-center shrink-0 shadow-inner mt-0.5">
                <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h2
                  id="demo-disclaimer-title"
                  className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide leading-tight"
                >
                  {DEMO_DISCLAIMER_CONFIG.title}
                </h2>
                <p className="text-xs text-neutral-400 font-serif tracking-widest mt-1">
                  HONYAKI AUTHENTIC SUSHI VALENCIA
                </p>
              </div>
            </div>
          </div>

          {/* Welcome Intro */}
          <p className="font-serif text-base sm:text-lg text-amber-100 font-semibold leading-snug">
            {DEMO_DISCLAIMER_CONFIG.welcome}
          </p>

          {/* Core Body Message */}
          <div className="space-y-3.5 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
            <p>
              {DEMO_DISCLAIMER_CONFIG.paragraph1}
            </p>

            {/* Crucial Notice Callout Box */}
            <div className="rounded-xl bg-[#231517] border border-[#991b1b]/50 p-3.5 sm:p-4 space-y-1 text-red-200 shadow-sm">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-red-300 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Important Notice</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-red-100">
                {DEMO_DISCLAIMER_CONFIG.paragraph2}
              </p>
            </div>

            <p>
              {DEMO_DISCLAIMER_CONFIG.paragraph3}
            </p>
          </div>

          {/* Footer Contact & Inquiries Reminder Card */}
          <div className="rounded-xl bg-[#1b1a19] border border-[#d97706]/30 p-3.5 sm:p-4 space-y-2.5 text-xs text-neutral-300">
            <div className="text-[#f59e0b] font-medium leading-relaxed">
              {DEMO_DISCLAIMER_CONFIG.footerReminder}
            </div>

            <div className="pt-1.5 border-t border-[#2e2a27] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-neutral-400">Direct Inquiries:</span>
                <a
                  href={`tel:${DEMO_DISCLAIMER_CONFIG.restaurantPhone.replace(/\s+/g, '')}`}
                  className="font-mono text-emerald-400 font-bold hover:underline"
                >
                  {DEMO_DISCLAIMER_CONFIG.restaurantPhone}
                </a>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-[#b91c1c] shrink-0" />
                <span>ASV Townhouse, Sayre Hwy, Valencia City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 pt-3 sm:pt-4 border-t border-[#23232b] bg-[#101013] shrink-0">
          <button
            ref={primaryButtonRef}
            type="button"
            onClick={handleAcknowledge}
            className="w-full py-3.5 sm:py-4 px-6 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] active:bg-[#7f1d1d] shadow-lg shadow-red-950/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#991b1b] focus:ring-offset-2 focus:ring-offset-[#101013] min-h-[48px] flex items-center justify-center gap-2 group"
          >
            <span>{DEMO_DISCLAIMER_CONFIG.buttonText}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
