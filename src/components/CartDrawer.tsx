import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, AlertCircle } from 'lucide-react';
import { CartItem, Promotion } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  appliedPromo: Promotion | null;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const basePrice = item.menuItem.price + item.selectedVariants.reduce((vSum, v) => vSum + v.price_adjustment, 0);
    const addonsPrice = item.selectedAddons.reduce((aSum, a) => aSum + a.price, 0);
    return sum + (basePrice + addonsPrice) * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discount_type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedPromo.discount_value) / 100);
    } else {
      discountAmount = Math.min(subtotal, appliedPromo.discount_value);
    }
  }

  const estimatedTotal = Math.max(0, subtotal - discountAmount);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = onApplyPromo(promoCodeInput.trim().toUpperCase());
    if (res.success) {
      setPromoFeedback({ type: 'success', text: res.message });
      setPromoCodeInput('');
    } else {
      setPromoFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-[#131316] border-l border-[#25252b] h-[100dvh] flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#242429] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">
              Your Order
            </h3>
            <span className="text-xs text-neutral-400 tabular-nums">
              ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-neutral-400 hover:text-white rounded-lg hover:bg-[#1f1f26] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 overscroll-contain">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#1b1b22] flex items-center justify-center text-neutral-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-base font-serif font-bold text-white">Your cart is empty</p>
              <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                Explore our fresh nigiri, specialty maki rolls, and ramen to add dishes to your dining order.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-colors cursor-pointer min-h-[44px]"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const basePrice = item.menuItem.price + item.selectedVariants.reduce((vSum, v) => vSum + v.price_adjustment, 0);
              const addonsPrice = item.selectedAddons.reduce((aSum, a) => aSum + a.price, 0);
              const lineTotal = (basePrice + addonsPrice) * item.quantity;

              return (
                <div
                  key={`${item.menuItem.id}-${idx}`}
                  className="p-3 sm:p-3.5 rounded-xl bg-[#18181e] border border-[#26262e] space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <img
                        src={item.menuItem.image_url}
                        alt={item.menuItem.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover bg-neutral-900 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0 flex-1 pr-1">
                        <h4 className="text-xs font-semibold text-white leading-snug break-words">
                          {item.menuItem.name}
                        </h4>
                        
                        {item.selectedVariants.length > 0 && (
                          <p className="text-[11px] text-amber-200/90 mt-0.5 truncate">
                            {item.selectedVariants.map((v) => v.name).join(', ')}
                          </p>
                        )}
                        
                        {item.selectedAddons.length > 0 && (
                          <p className="text-[10px] text-neutral-400 mt-0.5 truncate">
                            + {item.selectedAddons.map((a) => a.name).join(', ')}
                          </p>
                        )}

                        <span className="font-mono text-xs font-semibold text-amber-300 tabular-nums block mt-1">
                          ₱{lineTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="text-neutral-500 hover:text-red-400 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer transition-colors shrink-0"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#22222a]">
                    <span className="text-[11px] text-neutral-400">Quantity</span>
                    <div className="flex items-center border border-[#2d2d38] rounded-lg bg-[#131316]">
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-semibold text-white tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        disabled={item.quantity >= item.menuItem.stock_quantity}
                        className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout Summary with Safe Area Inset Support */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#242429] bg-[#101013] space-y-3 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
            
            {/* Promo Code Input */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-600/30 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-300 min-w-0">
                    <Tag className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-semibold truncate">Promo: {appliedPromo.code}</span>
                  </div>
                  <button
                    onClick={onRemovePromo}
                    className="text-neutral-400 hover:text-white text-[11px] cursor-pointer shrink-0 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Voucher Code"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 bg-[#17171d] border border-[#2b2b35] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400 uppercase tracking-wider min-w-0"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#25252f] hover:bg-[#323240] text-neutral-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoFeedback && (
                <p className={`text-[11px] mt-1 ${promoFeedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {promoFeedback.text}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white tabular-nums">₱{subtotal.toLocaleString()}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({appliedPromo.code})</span>
                  <span className="font-mono tabular-nums">-₱{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-500 text-[11px]">
                <span>Fulfillment Fee</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-white pt-1.5 border-t border-[#22222a]">
                <span>Estimated Total</span>
                <span className="font-mono text-amber-300 text-base tabular-nums">
                  ₱{estimatedTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 cursor-pointer min-h-[46px]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
