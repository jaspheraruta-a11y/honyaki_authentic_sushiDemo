import React, { useState } from 'react';
import { X, Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { MenuItem, MenuItemVariant, MenuItemAddon } from '../types';
import { useDemoMode } from '../context/DemoModeContext';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    dish: MenuItem,
    quantity: number,
    selectedVariants: { name: string; price_adjustment: number }[],
    selectedAddons: { name: string; price: number }[]
  ) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  onClose,
  onAddToCart,
}) => {
  const { isDemoMode, openDemoModal } = useDemoMode();
  if (!dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | null>(
    dish.variants && dish.variants.length > 0 ? dish.variants[0] : null
  );
  const [selectedAddons, setSelectedAddons] = useState<MenuItemAddon[]>([]);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const basePrice = dish.price + (selectedVariant ? selectedVariant.price_adjustment : 0);
  const addonsTotal = selectedAddons.reduce((sum, add) => sum + add.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (addon: MenuItemAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAdd = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (isDemoMode) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      openDemoModal(e?.currentTarget || null);
      return;
    }

    setAddedAnimation(true);
    onAddToCart(
      dish,
      quantity,
      selectedVariant ? [{ name: selectedVariant.name, price_adjustment: selectedVariant.price_adjustment }] : [],
      selectedAddons.map((a) => ({ name: a.name, price: a.price }))
    );
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 400);
  };

  const isOutOfStock = !dish.is_available || dish.stock_quantity <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#141417] border-t sm:border border-[#27272c] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col my-0 sm:my-8 animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dish Image with Fallback Container */}
        <div className="relative aspect-[16/9] w-full bg-[#1b1b20] overflow-hidden">
          <img
            src={dish.image_url}
            alt={dish.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              // Graceful fallback to styled neutral surface if image fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-black/30 pointer-events-none" />
          
          {dish.is_featured && (
            <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-amber-200 bg-amber-950/80 border border-amber-600/30 px-2.5 py-1 rounded">
              Chef's Signature
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 overscroll-contain">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                {dish.name}
              </h3>
              <span className="font-mono text-xl font-bold text-amber-300 tabular-nums">
                ₱{totalPrice.toLocaleString()}
              </span>
            </div>

            {dish.japanese_name && (
              <p className="text-xs text-neutral-400 font-serif tracking-widest mt-0.5">
                {dish.japanese_name}
              </p>
            )}

            <p className="text-sm text-neutral-300 leading-relaxed mt-2.5">
              {dish.description}
            </p>

            {/* Stock status indicator */}
            <div className="mt-3 flex items-center gap-2 text-xs">
              {isOutOfStock ? (
                <span className="text-red-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> Sold Out for Today
                </span>
              ) : dish.stock_quantity <= dish.low_stock_threshold ? (
                <span className="text-amber-400 font-medium">
                  Limited stock remaining: {dish.stock_quantity} orders left
                </span>
              ) : (
                <span className="text-emerald-400/90 font-medium">
                  Available fresh from sushi bar
                </span>
              )}
            </div>
          </div>

          {/* Variants Selection (if any) */}
          {dish.variants && dish.variants.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#222227]">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
                Select Size / Set
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dish.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#991b1b] bg-[#211617] text-white shadow-sm'
                          : 'border-[#27272f] bg-[#1a1a20] text-neutral-300 hover:border-neutral-500'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="font-mono text-neutral-400 tabular-nums">
                        {v.price_adjustment > 0 ? `+₱${v.price_adjustment}` : v.price_adjustment < 0 ? `-₱${Math.abs(v.price_adjustment)}` : 'Standard'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons Selection (if any) */}
          {dish.addons && dish.addons.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#222227]">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
                Optional Add-ons & Condiments
              </label>
              <div className="space-y-2">
                {dish.addons.map((add) => {
                  const isChecked = selectedAddons.some((a) => a.id === add.id);
                  return (
                    <button
                      key={add.id}
                      type="button"
                      onClick={() => toggleAddon(add)}
                      className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'border-amber-600/60 bg-amber-950/20 text-white'
                          : 'border-[#27272f] bg-[#1a1a20] text-neutral-300 hover:border-neutral-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-amber-600 border-amber-600 text-black' : 'border-neutral-500'}`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{add.name}</span>
                      </div>
                      <span className="font-mono text-amber-300 tabular-nums">+₱{add.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Quantity Stepper & Submit (Sticky Footer) */}
        <div className="p-4 sm:p-5 border-t border-[#222227] bg-[#101013] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#2a2a32] rounded-xl bg-[#18181e] p-1 w-full sm:w-auto justify-between min-h-[44px]">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-mono font-semibold text-white text-sm tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(dish.stock_quantity, quantity + 1))}
              disabled={quantity >= dish.stock_quantity || isOutOfStock}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`w-full sm:w-auto flex-1 py-3 px-6 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[46px] ${
              isOutOfStock
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-[#991b1b] hover:bg-[#b91c1c] text-white shadow-lg shadow-red-950/40'
            }`}
          >
            {isOutOfStock ? (
              'Currently Sold Out'
            ) : addedAnimation ? (
              <>
                <Check className="w-4 h-4" /> Added to Order!
              </>
            ) : (
              <>
                <span>Add to Order</span>
                <span>·</span>
                <span className="font-mono tabular-nums">₱{totalPrice.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
