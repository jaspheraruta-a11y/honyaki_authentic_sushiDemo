import React, { useEffect, useRef } from 'react';
import { X, Info, Phone, MapPin } from 'lucide-react';
import { DEMO_STRINGS } from '../lib/demoConfig';

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerElement?: HTMLElement | null;
}

export const DemoModeModal: React.FC<DemoModeModalProps> = ({
  isOpen,
  onClose,
  triggerElement,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Capture active element for focus restoration
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = triggerElement || (document.activeElement as HTMLElement | null);

      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus primary action button after entrance
      const timer = setTimeout(() => {
        primaryButtonRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
        // Restore focus to triggering element
        if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen, triggerElement]);

  // Handle Escape key and keyboard focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes the modal
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Tab trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-black/75 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        // Dismiss when clicking outside modal surface
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
        aria-describedby="demo-modal-description"
        className="relative w-full max-w-[480px] bg-[#faf7f2] text-[#1c1917] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e5dfd5] overflow-hidden max-h-[90dvh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        {/* Subtle decorative top accent strip with Honyaki red & gold */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#d97706]" />

        {/* Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede7de] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#991b1b]"
          aria-label="Close demo notice"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Content Container */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto overscroll-contain">
          
          {/* Header Zone: Refined Icon & Title */}
          <div className="flex items-start gap-3.5 pr-8">
            <div className="w-11 h-11 rounded-2xl bg-[#fee2e2]/70 border border-[#fecaca] text-[#991b1b] flex items-center justify-center shrink-0 shadow-xs">
              <Info className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] text-[#991b1b] font-bold block mb-1">
                Client Concept Preview
              </span>
              <h2
                id="demo-modal-title"
                className="font-serif text-xl sm:text-2xl font-bold text-[#1c1917] tracking-tight leading-tight"
              >
                {DEMO_STRINGS.title}
              </h2>
            </div>
          </div>

          {/* Body Message */}
          <div
            id="demo-modal-description"
            className="text-xs sm:text-sm text-[#44403c] leading-relaxed font-normal space-y-3"
          >
            <p>
              {DEMO_STRINGS.message}
            </p>
          </div>

          {/* Quick Restaurant Contact Card */}
          <div className="rounded-xl bg-[#f2ece2] border border-[#e2d8cb] p-3 sm:p-3.5 space-y-2 text-xs text-[#44403c]">
            <div className="flex items-center gap-2 font-medium text-[#1c1917]">
              <Phone className="w-3.5 h-3.5 text-[#991b1b] shrink-0" />
              <span>Direct Phone & Inquiries:</span>
              <a
                href={`tel:${DEMO_STRINGS.restaurantPhone.replace(/\s+/g, '')}`}
                className="font-mono text-[#991b1b] font-bold hover:underline"
              >
                {DEMO_STRINGS.restaurantPhone}
              </a>
            </div>
            <div className="flex items-start gap-2 text-[11px] text-[#78716c]">
              <MapPin className="w-3.5 h-3.5 text-[#b91c1c] shrink-0 mt-0.5" />
              <span>{DEMO_STRINGS.restaurantAddress}</span>
            </div>
          </div>

          {/* Footer Notice Box */}
          <div className="rounded-xl bg-[#fee2e2]/40 border border-[#fca5a5]/40 p-3 sm:p-3.5 text-xs text-[#7f1d1d] leading-relaxed">
            <span className="font-semibold block mb-0.5">Please Note:</span>
            {DEMO_STRINGS.footerNotice}
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 pt-3 sm:pt-4 border-t border-[#e8e2d8] bg-[#f5efe6] flex flex-col gap-2 shrink-0">
          <button
            ref={primaryButtonRef}
            type="button"
            onClick={onClose}
            className="w-full py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] active:bg-[#7f1d1d] shadow-md shadow-red-950/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#991b1b] focus:ring-offset-2 min-h-[44px] flex items-center justify-center"
          >
            {DEMO_STRINGS.buttonText}
          </button>
        </div>

      </div>
    </div>
  );
};
