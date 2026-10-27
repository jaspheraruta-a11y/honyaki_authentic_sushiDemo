import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DishDetailModal } from './components/DishDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { DemoDisclaimerModal } from './components/DemoDisclaimerModal';

import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ServicesPage } from './pages/ServicesPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { CateringPage } from './pages/CateringPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { AdminDashboard } from './pages/AdminDashboard';

import { MenuItem, CartItem, Promotion, RestaurantSettings, Order } from './types';
import { restaurantStore } from './lib/store';
import { DemoModeProvider, useDemoMode } from './context/DemoModeContext';

function AppContent() {
  const { isDemoMode, openDemoModal } = useDemoMode();

  // Current Route State (defaults to pathname or '/')
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || window.location.pathname || '/';
  });

  const [settings, setSettings] = useState<RestaurantSettings>(() => restaurantStore.getSettings());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => restaurantStore.getMenuItems());
  const [categories, setCategories] = useState(() => restaurantStore.getCategories());

  // Cart State (Persisted in LocalStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('honyaki_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDishForModal, setSelectedDishForModal] = useState<MenuItem | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('honyaki_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Cart storage sync failed', e);
    }
  }, [cartItems]);

  // Handle browser popstate / hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace('#', '');
      const path = hash || window.location.pathname || '/';
      setCurrentRoute(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Handlers with Demo Mode Enforcement
  const handleAddToCart = (
    dish: MenuItem,
    quantity: number,
    selectedVariants: { name: string; price_adjustment: number }[],
    selectedAddons: { name: string; price: number }[]
  ) => {
    if (isDemoMode) {
      openDemoModal();
      return;
    }

    const existingIndex = cartItems.findIndex((item) => {
      if (item.menuItem.id !== dish.id) return false;
      const vMatch = JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants);
      const aMatch = JSON.stringify(item.selectedAddons) === JSON.stringify(selectedAddons);
      return vMatch && aMatch;
    });

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          menuItem: dish,
          quantity,
          selectedVariants,
          selectedAddons,
        },
      ]);
    }
  };

  const handleQuickAdd = (dish: MenuItem) => {
    if (isDemoMode) {
      openDemoModal();
      return;
    }
    handleAddToCart(dish, 1, [], []);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    const updated = [...cartItems];
    updated[index].quantity = quantity;
    setCartItems(updated);
  };

  const handleRemoveCartItem = (index: number) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const handleApplyPromo = (code: string) => {
    const promos = restaurantStore.getPromotions();
    const found = promos.find((p) => p.code.toUpperCase() === code && p.is_active);
    if (!found) {
      return { success: false, message: 'Invalid or expired voucher code.' };
    }

    const subtotal = cartItems.reduce((sum, item) => {
      const basePrice = item.menuItem.price + item.selectedVariants.reduce((vSum, v) => vSum + v.price_adjustment, 0);
      const addonsPrice = item.selectedAddons.reduce((aSum, a) => aSum + a.price, 0);
      return sum + (basePrice + addonsPrice) * item.quantity;
    }, 0);

    if (subtotal < found.minimum_order_amount) {
      return {
        success: false,
        message: `Requires a minimum order spend of ₱${found.minimum_order_amount.toLocaleString()}.`,
      };
    }

    setAppliedPromo(found);
    return { success: true, message: `Voucher ${found.code} applied successfully!` };
  };

  const handleOrderCompleted = (order: Order) => {
    // Refresh items to show decremented stock
    setMenuItems(restaurantStore.getMenuItems());
  };

  const handleCheckoutClick = () => {
    if (isDemoMode) {
      openDemoModal();
      return;
    }
    navigateTo('/checkout');
  };

  const featuredDishes = menuItems.filter((d) => d.is_featured);
  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Route Dispatcher
  const renderCurrentPage = () => {
    // Check dynamic route: /order/:orderNumber
    if (currentRoute.startsWith('/order/')) {
      const orderNumber = currentRoute.replace('/order/', '');
      return (
        <OrderTrackingPage
          orderNumber={orderNumber}
          onNavigate={navigateTo}
          settings={settings}
        />
      );
    }

    switch (currentRoute) {
      case '/menu':
        return (
          <MenuPage
            categories={categories}
            menuItems={menuItems}
            onOpenDishModal={(dish) => setSelectedDishForModal(dish)}
            onQuickAdd={handleQuickAdd}
          />
        );
      case '/services':
        return <ServicesPage settings={settings} onNavigate={navigateTo} />;
      case '/reservations':
        return <ReservationsPage settings={settings} onNavigate={navigateTo} />;
      case '/catering':
        return <CateringPage settings={settings} onNavigate={navigateTo} />;
      case '/about':
        return <AboutPage settings={settings} onNavigate={navigateTo} />;
      case '/contact':
        return <ContactPage settings={settings} />;
      case '/cart':
      case '/checkout':
        return (
          <CheckoutPage
            cartItems={cartItems}
            appliedPromo={appliedPromo}
            settings={settings}
            onClearCart={handleClearCart}
            onOrderCompleted={handleOrderCompleted}
            onNavigate={navigateTo}
          />
        );
      case '/my-account':
      case '/my-orders':
      case '/my-reservations':
        return <CustomerAccountPage onNavigate={navigateTo} />;
      case '/admin':
        return (
          <AdminDashboard
            onNavigate={navigateTo}
            settings={settings}
            onUpdateSettings={(newSettings) => setSettings(newSettings)}
          />
        );
      case '/':
      default:
        return (
          <HomePage
            onNavigate={navigateTo}
            featuredDishes={featuredDishes}
            onOpenDishModal={(dish) => setSelectedDishForModal(dish)}
            settings={settings}
          />
        );
    }
  };

  const isAdminRoute = currentRoute === '/admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e10] text-[#f4f2ee] font-sans antialiased">
      
      {/* Top Header */}
      {!isAdminRoute && (
        <Header
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          settings={settings}
        />
      )}

      {/* Main Page Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Bottom Footer */}
      {!isAdminRoute && (
        <Footer onNavigate={navigateTo} settings={settings} />
      )}

      {/* Dish Customization Modal */}
      <DishDetailModal
        dish={selectedDishForModal}
        onClose={() => setSelectedDishForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutClick}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={() => setAppliedPromo(null)}
      />

      {/* Initial Page Load Session Demo Disclaimer Modal */}
      <DemoDisclaimerModal />

    </div>
  );
}

export default function App() {
  return (
    <DemoModeProvider>
      <AppContent />
    </DemoModeProvider>
  );
}
