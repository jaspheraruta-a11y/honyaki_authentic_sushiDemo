import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Plus, AlertCircle, Sparkles, Check, UtensilsCrossed } from 'lucide-react';
import { MenuItem, MenuCategory } from '../types';
import { useDemoMode } from '../context/DemoModeContext';

interface MenuPageProps {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  onOpenDishModal: (dish: MenuItem) => void;
  onQuickAdd: (dish: MenuItem) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  categories,
  menuItems,
  onOpenDishModal,
  onQuickAdd,
}) => {
  const { isDemoMode, openDemoModal } = useDemoMode();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    let result = [...menuItems];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category_id === selectedCategory);
    }

    // Availability filter
    if (onlyAvailable) {
      result = result.filter((item) => item.is_available && item.stock_quantity > 0);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.japanese_name && item.japanese_name.includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Featured first, then name
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [menuItems, selectedCategory, searchQuery, sortBy, onlyAvailable]);

  const handleQuickAdd = (dish: MenuItem, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // If dish has variants, open modal so customer picks their choice
    if (dish.variants && dish.variants.length > 0) {
      onOpenDishModal(dish);
    } else {
      if (isDemoMode) {
        e.preventDefault();
        openDemoModal(e.currentTarget);
        return;
      }
      onQuickAdd(dish);
      setQuickAddedId(dish.id);
      setTimeout(() => setQuickAddedId(null), 800);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
      
      {/* Page Header */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#b91c1c] font-semibold">
          <span>Artisanal Menu</span>
          <span>·</span>
          <span>Valencia City, Bukidnon</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-5xl font-bold text-white tracking-wide">
          Our Digital Japanese Menu
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl font-light leading-relaxed">
          Prepared to order using quality sushi-grade seafood, fresh local produce, and traditional Japanese marinades. Prices are in Philippine Pesos (PHP).
        </p>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="bg-[#141418] border border-[#24242c] rounded-2xl p-3.5 sm:p-5 space-y-3 sm:space-y-4 shadow-md">
        
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sushi, ramen, sashimi, platters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400 transition-colors min-h-[40px]"
            />
          </div>

          {/* Sort Dropdown & In Stock Checkbox */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <SlidersHorizontal className="w-4 h-4 text-neutral-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-400 cursor-pointer min-h-[40px] w-full sm:w-auto"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Alphabetical (A–Z)</option>
              </select>
            </div>

            {/* In stock only toggle */}
            <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer select-none min-h-[40px] px-2.5 py-1.5 rounded-xl bg-[#1b1b22] sm:bg-transparent border border-[#2a2a35] sm:border-0 shrink-0">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 rounded border-[#2a2a35] bg-[#141418] text-[#991b1b] focus:ring-0 cursor-pointer"
              />
              <span className="whitespace-nowrap">In Stock</span>
            </label>
          </div>

        </div>

        {/* Category Horizontal Filter Bar (Interactive segmented controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs -mx-1 px-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer min-h-[38px] flex items-center ${
              selectedCategory === 'all'
                ? 'bg-[#991b1b] text-white shadow-sm'
                : 'bg-[#1b1b22] text-neutral-400 hover:text-white hover:bg-[#252530]'
            }`}
          >
            All Dishes ({menuItems.length})
          </button>
          {categories.map((cat) => {
            const count = menuItems.filter((i) => i.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer min-h-[38px] flex items-center ${
                  isSelected
                    ? 'bg-[#991b1b] text-white shadow-sm'
                    : 'bg-[#1b1b22] text-neutral-400 hover:text-white hover:bg-[#252530]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="ml-1.5 opacity-60 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Menu Grid */}
      {menuItems.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-[#131317] border border-[#212128] rounded-2xl p-8 max-w-xl mx-auto shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[#1e1e24] flex items-center justify-center text-amber-400 mx-auto">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Our menu is being updated. Please check back soon.
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            We are currently refreshing our kitchen selections with today's fresh seafood deliveries from Mindanao ports.
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-[#131317] border border-[#212128] rounded-2xl p-8">
          <p className="font-serif text-lg text-white">No dishes found matching your criteria</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search terms or select another category filter to explore our offerings.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyAvailable(false);
            }}
            className="mt-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] rounded-lg hover:bg-[#b91c1c] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((dish) => {
            const isOutOfStock = !dish.is_available || dish.stock_quantity <= 0;
            const hasVariants = dish.variants && dish.variants.length > 0;

            return (
              <div
                key={dish.id}
                onClick={() => onOpenDishModal(dish)}
                className="group bg-[#141418] border border-[#25252e] rounded-2xl overflow-hidden flex flex-col hover:border-neutral-500 transition-all cursor-pointer shadow-md hover:shadow-xl"
              >
                {/* Dish 4:3 Image Container with Styled Fallback */}
                <div className="relative aspect-[4/3] bg-[#1a1a20] overflow-hidden">
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent pointer-events-none" />

                  {/* Price Tag in PHP */}
                  <span className="absolute top-3 right-3 text-xs font-mono font-bold bg-black/80 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-lg border border-neutral-700 tabular-nums">
                    ₱{dish.price}
                  </span>

                  {/* Dietary / Feature Tags */}
                  {dish.dietary_tags && dish.dietary_tags.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                      {dish.dietary_tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-wider bg-black/80 backdrop-blur-sm text-neutral-200 px-2 py-0.5 rounded border border-neutral-700/60 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dish Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-100 transition-colors">
                        {dish.name}
                      </h3>
                    </div>

                    {dish.japanese_name && (
                      <p className="text-[11px] text-neutral-400 font-serif tracking-widest mt-0.5">
                        {dish.japanese_name}
                      </p>
                    )}

                    <p className="text-xs text-neutral-300 line-clamp-2 mt-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-3 border-t border-[#202027] flex items-center justify-between gap-3">
                    
                    {/* Stock Status text */}
                    <div className="text-[11px]">
                      {isOutOfStock ? (
                        <span className="text-red-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> Sold Out
                        </span>
                      ) : dish.stock_quantity <= dish.low_stock_threshold ? (
                        <span className="text-amber-400 font-medium tabular-nums">
                          Only {dish.stock_quantity} left
                        </span>
                      ) : (
                        <span className="text-emerald-400/90 font-medium">
                          In Stock
                        </span>
                      )}
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={(e) => handleQuickAdd(dish, e)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                        isOutOfStock
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : quickAddedId === dish.id
                          ? 'bg-emerald-600 text-white'
                          : hasVariants
                          ? 'bg-[#22222b] hover:bg-[#991b1b] text-neutral-200 hover:text-white'
                          : 'bg-[#991b1b] hover:bg-[#b91c1c] text-white shadow-sm'
                      }`}
                    >
                      {quickAddedId === dish.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added
                        </>
                      ) : hasVariants ? (
                        'Customize'
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Add
                        </>
                      )}
                    </button>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Honest Menu Disclaimer Box */}
      <div className="p-4 rounded-xl bg-[#141419] border border-[#24242e] text-xs text-neutral-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-neutral-200">Notice on Sourcing & Variations:</span>{' '}
          Dishes are prepared fresh daily. Availability of sashimi items may vary depending on seasonal seafood flights from General Santos and Cagayan de Oro.
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-amber-300 hover:underline shrink-0 cursor-pointer"
        >
          Back to Top ↑
        </button>
      </div>

    </div>
  );
};
