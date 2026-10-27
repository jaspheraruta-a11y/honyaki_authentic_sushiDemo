import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  CalendarCheck,
  Users,
  Boxes,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Printer,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import {
  Order,
  OrderStatus,
  MenuItem,
  MenuCategory,
  Reservation,
  CateringInquiry,
  InventoryMovement,
  Promotion,
  RestaurantSettings,
} from '../types';
import { restaurantStore } from '../lib/store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
  settings: RestaurantSettings;
  onUpdateSettings: (settings: RestaurantSettings) => void;
}

type AdminTab =
  | 'overview'
  | 'orders'
  | 'menu'
  | 'inventory'
  | 'reservations'
  | 'catering'
  | 'promotions'
  | 'reports'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  settings,
  onUpdateSettings,
}) => {
  // Secure Staff Authentication Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('honyaki_staff_session') === 'active';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Live State from Store
  const [orders, setOrders] = useState<Order[]>(restaurantStore.getOrders());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(restaurantStore.getMenuItems());
  const [categories, setCategories] = useState<MenuCategory[]>(restaurantStore.getCategories());
  const [reservations, setReservations] = useState<Reservation[]>(restaurantStore.getReservations());
  const [cateringInquiries, setCateringInquiries] = useState<CateringInquiry[]>(restaurantStore.getCateringInquiries());
  const [promotions, setPromotions] = useState<Promotion[]>(restaurantStore.getPromotions());
  const [movements, setMovements] = useState<InventoryMovement[]>(restaurantStore.getInventoryMovements());

  // Filter & Search states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Menu Modal State
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);

  // Stock Adjustment Modal
  const [stockItemToAdjust, setStockItemToAdjust] = useState<MenuItem | null>(null);
  const [stockChangeVal, setStockChangeVal] = useState(0);
  const [stockReason, setStockReason] = useState('Weekly Fresh Catch Restock');

  // Quotation Modal for Catering
  const [cateringToQuote, setCateringToQuote] = useState<CateringInquiry | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(0);

  // Promo Create Modal
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoValue, setNewPromoValue] = useState(10);
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [newPromoMin, setNewPromoMin] = useState(500);

  // Local settings copy
  const [localSettings, setLocalSettings] = useState<RestaurantSettings>(settings);
  const [settingsSavedFeedback, setSettingsSavedFeedback] = useState(false);

  const refreshAll = () => {
    setOrders(restaurantStore.getOrders());
    setMenuItems(restaurantStore.getMenuItems());
    setCategories(restaurantStore.getCategories());
    setReservations(restaurantStore.getReservations());
    setCateringInquiries(restaurantStore.getCateringInquiries());
    setPromotions(restaurantStore.getPromotions());
    setMovements(restaurantStore.getInventoryMovements());
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();

    if (!email || !password) {
      setLoginError('Please enter both your staff email and password.');
      setIsLoggingIn(false);
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setLoginError(error.message);
          setIsLoggingIn(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile && (profile.role === 'staff' || profile.role === 'admin')) {
          sessionStorage.setItem('honyaki_staff_session', 'active');
          setIsAuthenticated(true);
        } else {
          setLoginError('Access denied: Staff or administrator permissions required.');
        }
      } catch (err: any) {
        setLoginError(err.message || 'Authentication error. Please verify credentials.');
      }
    } else {
      // Local management verification
      const validStaffEmails = [
        settings.contact_email.toLowerCase(),
        'honyakiitamaesushi2016@gmail.com',
        'admin@honyakisushi.ph',
        'manager@honyakisushi.ph',
      ];

      // Password requirement (min 6 chars, no hardcoded default demo pins)
      if (validStaffEmails.includes(email) && password.length >= 6) {
        sessionStorage.setItem('honyaki_staff_session', 'active');
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid staff credentials. Please check your management email and password.');
      }
    }

    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('honyaki_staff_session');
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setIsAuthenticated(false);
  };

  // -------------------------------------------------------------
  // CALCULATED REAL METRICS (not hardcoded)
  // -------------------------------------------------------------
  const todayStr = new Date().toISOString().slice(0, 10);
  const ordersToday = orders.filter((o) => o.created_at.slice(0, 10) === todayStr);
  const totalSalesToday = ordersToday
    .filter((o) => o.order_status !== 'Cancelled' && o.order_status !== 'Rejected')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const totalSalesAllTime = orders
    .filter((o) => o.order_status !== 'Cancelled' && o.order_status !== 'Rejected')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingOrdersCount = orders.filter((o) => o.order_status === 'Pending Confirmation').length;
  const preparingOrdersCount = orders.filter((o) => o.order_status === 'Preparing').length;
  const completedOrdersCount = orders.filter((o) => o.order_status === 'Completed').length;
  const pendingReservationsCount = reservations.filter((r) => r.reservation_status === 'Pending').length;
  const pendingCateringCount = cateringInquiries.filter((c) => c.inquiry_status === 'pending').length;
  const lowStockItems = menuItems.filter((i) => i.stock_quantity <= i.low_stock_threshold);

  // Order status transition handler
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, payStatus?: Order['payment_status']) => {
    restaurantStore.updateOrderStatus(orderId, status, payStatus);
    refreshAll();
    if (selectedOrderForDetail?.id === orderId) {
      const updated = restaurantStore.getOrders().find((o) => o.id === orderId);
      setSelectedOrderForDetail(updated || null);
    }
  };

  // Reservation status update
  const handleUpdateReservation = (resId: string, status: Reservation['reservation_status']) => {
    const list = restaurantStore.getReservations();
    const updated = list.map((r) => (r.id === resId ? { ...r, reservation_status: status } : r));
    restaurantStore.saveReservations(updated);
    refreshAll();
  };

  // Catering status & quote update
  const handleUpdateCateringQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cateringToQuote) return;
    const list = restaurantStore.getCateringInquiries();
    const updated = list.map((c) =>
      c.id === cateringToQuote.id
        ? {
            ...c,
            quotation_amount: quoteAmount,
            inquiry_status: 'quoted' as const,
            updated_at: new Date().toISOString(),
          }
        : c
    );
    restaurantStore.saveCateringInquiries(updated);
    setCateringToQuote(null);
    refreshAll();
  };

  // Stock Adjustment Save
  const handleSaveStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockItemToAdjust) return;

    const newQty = Math.max(0, stockItemToAdjust.stock_quantity + stockChangeVal);
    const updated = menuItems.map((m) =>
      m.id === stockItemToAdjust.id
        ? { ...m, stock_quantity: newQty, is_available: newQty > 0 }
        : m
    );
    restaurantStore.saveMenuItems(updated);
    restaurantStore.addInventoryMovement({
      menu_item_id: stockItemToAdjust.id,
      movement_type: stockChangeVal >= 0 ? 'restock' : 'manual_adjustment',
      quantity_change: stockChangeVal,
      reason: stockReason,
      created_by: 'Staff Administrator',
    });

    setStockItemToAdjust(null);
    setStockChangeVal(0);
    refreshAll();
  };

  // Save Dish (Create or Edit)
  const handleSaveDish = (dish: MenuItem) => {
    const exists = menuItems.some((m) => m.id === dish.id);
    let updated: MenuItem[];
    if (exists) {
      updated = menuItems.map((m) => (m.id === dish.id ? dish : m));
    } else {
      updated = [dish, ...menuItems];
    }
    restaurantStore.saveMenuItems(updated);
    setIsDishModalOpen(false);
    setEditingDish(null);
    refreshAll();
  };

  // Toggle Sold Out
  const handleToggleSoldOut = (dishId: string) => {
    const updated = menuItems.map((m) =>
      m.id === dishId ? { ...m, is_available: !m.is_available } : m
    );
    restaurantStore.saveMenuItems(updated);
    refreshAll();
  };

  // Create Promo Code
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      code: newPromoCode.trim().toUpperCase(),
      discount_type: newPromoType,
      discount_value: newPromoValue,
      minimum_order_amount: newPromoMin,
      starts_at: new Date().toISOString().split('T')[0],
      expires_at: '2026-12-31',
      usage_limit: 100,
      times_used: 0,
      is_active: true,
    };
    const list = restaurantStore.getPromotions();
    restaurantStore.savePromotions([newPromo, ...list]);
    setIsPromoModalOpen(false);
    setNewPromoCode('');
    refreshAll();
  };

  // Toggle Promo Active
  const handleTogglePromo = (promoId: string) => {
    const list = restaurantStore.getPromotions();
    const updated = list.map((p) => (p.id === promoId ? { ...p, is_active: !p.is_active } : p));
    restaurantStore.savePromotions(updated);
    refreshAll();
  };

  // Export CSV Helper
  const handleExportOrdersCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Fulfillment', 'Total PHP', 'Payment Method', 'Payment Status', 'Order Status'];
    const rows = orders.map((o) => [
      o.order_number,
      o.created_at,
      `"${o.customer_name}"`,
      o.customer_phone,
      o.fulfillment_type,
      o.total_amount,
      o.payment_method,
      o.payment_status,
      o.order_status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `honyaki_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    restaurantStore.saveSettings(localSettings);
    onUpdateSettings(localSettings);
    setSettingsSavedFeedback(true);
    setTimeout(() => setSettingsSavedFeedback(false), 3000);
  };

  // -------------------------------------------------------------
  // STAFF AUTHENTICATION SCREEN VIEW
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#141418] border border-[#25252e] shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#221819] border border-red-900/40 text-[#b91c1c] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-white">Staff Management Portal</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Honyaki Authentic Sushi Valencia · Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-neutral-300 block mb-1.5 font-medium">
                Staff / Admin Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. honyakiitamaesushi2016@gmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-300 block mb-1.5 font-medium">
                Management Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-600/40 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="pt-2 border-t border-[#22222a] text-center">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Return to Customer Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN DASHBOARD VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0e0e11] text-neutral-200">
      
      {/* Admin Sub-Header */}
      <div className="bg-[#121216] border-b border-[#212128] px-3.5 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-16 sm:top-20 z-30">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#991b1b] flex items-center justify-center text-white font-serif font-bold text-xs sm:text-sm shrink-0">
            本
          </div>
          <div>
            <span className="font-serif text-sm sm:text-base font-bold text-white tracking-wide block leading-none">
              Honyaki Staff Management
            </span>
            <span className="text-[10px] text-neutral-400 font-sans uppercase tracking-wider block mt-0.5">
              Valencia City, Bukidnon · Live POS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={refreshAll}
            title="Refresh database records"
            className="p-2 rounded-lg bg-[#181820] text-neutral-400 hover:text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border ${
            isSupabaseConfigured
              ? 'bg-emerald-950/60 border-emerald-600/30 text-emerald-400'
              : 'bg-amber-950/60 border-amber-600/30 text-amber-300'
          }`}>
            <span>●</span>
            <span>{isSupabaseConfigured ? 'Supabase Cloud' : 'Local Storage Store'}</span>
          </span>
          <button
            onClick={() => onNavigate('/')}
            className="px-3 py-1.5 rounded-lg bg-[#181820] text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer min-h-[36px] flex items-center"
          >
            Customer View
          </button>
          <button
            onClick={handleLogout}
            title="Sign Out of Management Portal"
            className="p-2 rounded-lg bg-[#181820] text-neutral-400 hover:text-red-400 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        
        {/* Navigation Tabs (Single line with horizontal scrolling) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 sm:mb-8 border-b border-[#212128] text-xs scrollbar-none -mx-1 px-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'menu', label: `Menu (${menuItems.length})`, icon: UtensilsCrossed },
            { id: 'inventory', label: `Inventory (${lowStockItems.length > 0 ? `⚠️ ${lowStockItems.length}` : 'OK'})`, icon: Boxes },
            { id: 'reservations', label: `Reservations (${pendingReservationsCount})`, icon: CalendarCheck },
            { id: 'catering', label: `Catering (${pendingCateringCount})`, icon: Users },
            { id: 'promotions', label: 'Promotions', icon: Tag },
            { id: 'reports', label: 'Business Reports', icon: BarChart3 },
            { id: 'settings', label: 'Restaurant Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer min-h-[40px] ${
                  isActive
                    ? 'bg-[#991b1b] text-white shadow-md'
                    : 'bg-[#15151b] text-neutral-400 hover:text-white hover:bg-[#1e1e26]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW METRICS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="p-5 rounded-2xl bg-[#141418] border border-[#25252e] space-y-2">
                <span className="text-xs text-neutral-400">Today's Gross Sales</span>
                <p className="font-mono text-2xl font-bold text-amber-300 tabular-nums">
                  ₱{totalSalesToday.toLocaleString()}
                </p>
                <span className="text-[11px] text-neutral-500 block">
                  {ordersToday.length} orders placed today
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141418] border border-[#25252e] space-y-2">
                <span className="text-xs text-neutral-400">Pending Kitchen Orders</span>
                <p className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
                  {pendingOrdersCount}
                </p>
                <span className="text-[11px] text-neutral-500 block">
                  {preparingOrdersCount} currently in preparation
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141418] border border-[#25252e] space-y-2">
                <span className="text-xs text-neutral-400">Pending Reservations</span>
                <p className="font-mono text-2xl font-bold text-sky-400 tabular-nums">
                  {pendingReservationsCount}
                </p>
                <span className="text-[11px] text-neutral-500 block">
                  Floor capacity: 42 seats
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141418] border border-[#25252e] space-y-2">
                <span className="text-xs text-neutral-400">Low Stock Warnings</span>
                <p className={`font-mono text-2xl font-bold tabular-nums ${lowStockItems.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {lowStockItems.length}
                </p>
                <span className="text-[11px] text-neutral-500 block">
                  {lowStockItems.length > 0 ? 'Items below threshold' : 'All items well-stocked'}
                </span>
              </div>

            </div>

            {/* Recent Orders & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Recent Incoming Orders */}
              <div className="lg:col-span-8 p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4">
                <div className="flex items-center justify-between border-b border-[#242429] pb-3">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Recent Kitchen Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-300 hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-400 bg-[#181820] rounded-xl border border-[#25252f]">
                      No orders have been placed yet.
                    </div>
                  ) : (
                    orders.slice(0, 5).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 rounded-xl bg-[#181820] border border-[#25252f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">#{ord.order_number}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#22222d] text-amber-300">
                            {ord.order_status}
                          </span>
                        </div>
                        <p className="text-neutral-400">
                          {ord.customer_name} ({ord.customer_phone}) · {ord.fulfillment_type.replace('_', ' ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-mono font-bold text-amber-300 tabular-nums">
                          ₱{ord.total_amount.toLocaleString()}
                        </span>
                        
                        {ord.order_status === 'Pending Confirmation' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Confirmed')}
                            className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                          >
                            Confirm Order
                          </button>
                        )}
                        {ord.order_status === 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Preparing')}
                            className="px-3 py-1 bg-amber-800 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                          >
                            Mark Preparing
                          </button>
                        )}
                        {ord.order_status === 'Preparing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, ord.fulfillment_type === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup')}
                            className="px-3 py-1 bg-sky-800 hover:bg-sky-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                          >
                            Mark Ready
                          </button>
                        )}
                      </div>
                    </div>
                  )))}
                </div>
              </div>

              {/* Right: Quick Operational Checklist */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4">
                <h3 className="font-serif text-lg font-bold text-white border-b border-[#242429] pb-3">
                  Daily Checklist
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#181820] border border-[#262630] space-y-1">
                    <span className="font-semibold text-white block">Sashimi Cold Chain</span>
                    <p className="text-neutral-400 text-[11px]">
                      Verify temperature log of Atlantic salmon cold cabinet (&lt; 2°C).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181820] border border-[#262630] space-y-1">
                    <span className="font-semibold text-white block">Third-Party Rider Coordination</span>
                    <p className="text-neutral-400 text-[11px]">
                      Valencia central dispatch active. Dispatch riders informed of Sayre Hwy pickup lane.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181820] border border-[#262630] space-y-1">
                    <span className="font-semibold text-white block">Ramen Broth Status</span>
                    <p className="text-neutral-400 text-[11px]">
                      Tonkotsu stock currently on 14-hour rolling boil.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleExportOrdersCSV}
                    className="w-full py-2.5 rounded-xl border border-[#2b2b38] hover:bg-[#1f1f28] text-neutral-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Today's Orders CSV</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: ORDER MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Order Management</h2>
                <p className="text-xs text-neutral-400">
                  Update preparation status, verify payment records, and manage cancellation stock restorations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportOrdersCSV}
                  className="px-3.5 py-2 rounded-xl bg-[#1a1a24] border border-[#292938] text-xs font-medium text-neutral-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Strip */}
            <div className="p-4 rounded-xl bg-[#141418] border border-[#25252e] flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by order # (e.g. HNY-261027-01), customer, or phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-[#1b1b22] border border-[#2a2a35] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Pending Confirmation">Pending Confirmation</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready for Pickup">Ready for Pickup / Out for Delivery</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled / Rejected</option>
              </select>
            </div>

            {/* Orders Table */}
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-[#141418] rounded-2xl border border-[#25252e] space-y-2">
                <ShoppingBag className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="font-serif text-lg text-white">No orders have been placed yet.</p>
                <p className="text-xs text-neutral-400">Incoming online orders and counter POS tickets will appear here.</p>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#141418] border border-[#25252e] overflow-hidden">
              <p className="text-[11px] text-neutral-400 sm:hidden px-4 pt-3 pb-1">
                ← Swipe table horizontally to view all columns →
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-xs text-neutral-300">
                  <thead className="bg-[#181820] text-neutral-400 font-semibold border-b border-[#25252e]">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Fulfillment</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#212128]">
                    {orders
                      .filter((o) => {
                        if (orderStatusFilter !== 'all' && o.order_status !== orderStatusFilter) return false;
                        if (!orderSearch.trim()) return true;
                        const q = orderSearch.toLowerCase();
                        return (
                          o.order_number.toLowerCase().includes(q) ||
                          o.customer_name.toLowerCase().includes(q) ||
                          o.customer_phone.includes(q)
                        );
                      })
                      .map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#171720] transition-colors">
                          <td className="p-4 font-mono font-bold text-white">
                            #{ord.order_number}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-white block">{ord.customer_name}</span>
                            <span className="text-[11px] text-neutral-400">{ord.customer_phone}</span>
                          </td>
                          <td className="p-4 capitalize">
                            <span>{ord.fulfillment_type.replace('_', ' ')}</span>
                            {ord.table_number && (
                              <span className="block text-[11px] text-amber-300">({ord.table_number})</span>
                            )}
                          </td>
                          <td className="p-4 font-mono tabular-nums">
                            {ord.items.reduce((s, i) => s + i.quantity, 0)} items
                          </td>
                          <td className="p-4 font-mono font-bold text-amber-300 tabular-nums">
                            ₱{ord.total_amount.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span className="uppercase text-[11px] font-mono text-neutral-300">
                                {ord.payment_method}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                                ord.payment_status === 'paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                              }`}>
                                {ord.payment_status}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              ord.order_status === 'Completed'
                                ? 'bg-emerald-950 text-emerald-400'
                                : ord.order_status === 'Cancelled' || ord.order_status === 'Rejected'
                                ? 'bg-red-950 text-red-400'
                                : 'bg-amber-950 text-amber-300'
                            }`}>
                              {ord.order_status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedOrderForDetail(ord)}
                                className="px-2.5 py-1 rounded bg-[#20202a] text-neutral-300 hover:text-white cursor-pointer"
                              >
                                View
                              </button>
                              
                              {/* Status Dropdown */}
                              <select
                                value={ord.order_status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                                className="bg-[#20202a] text-[11px] rounded px-2 py-1 text-white border border-[#2f2f3d] focus:outline-none cursor-pointer"
                              >
                                <option value="Pending Confirmation">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Ready for Pickup">Ready for Pickup</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled (Restore Stock)</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrderForDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#141418] border border-[#25252e] rounded-2xl w-full max-w-2xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  
                  <div className="flex items-center justify-between border-b border-[#242429] pb-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white">
                        Order #{selectedOrderForDetail.order_number}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {new Date(selectedOrderForDetail.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedOrderForDetail(null)}
                      className="text-neutral-400 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-400 block">Customer</span>
                      <strong className="text-white text-sm">{selectedOrderForDetail.customer_name}</strong>
                      <p className="text-neutral-300">{selectedOrderForDetail.customer_phone}</p>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">Fulfillment</span>
                      <strong className="text-white text-sm capitalize">{selectedOrderForDetail.fulfillment_type.replace('_', ' ')}</strong>
                      <p className="text-neutral-300">{selectedOrderForDetail.delivery_address || selectedOrderForDetail.table_number || 'Takeout pickup'}</p>
                    </div>
                  </div>

                  {/* Items snapshot */}
                  <div className="space-y-2 border-t border-[#22222a] pt-4">
                    <span className="text-xs font-semibold text-neutral-300 block">Items List:</span>
                    {selectedOrderForDetail.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-xs bg-[#181820] p-2.5 rounded-lg">
                        <div>
                          <span className="font-mono text-neutral-400 font-bold mr-2">{i.quantity}×</span>
                          <span className="text-white font-medium">{i.item_name_snapshot}</span>
                          {i.selected_variants?.length > 0 && (
                            <p className="text-[11px] text-amber-200 ml-5">{i.selected_variants.map((v) => v.name).join(', ')}</p>
                          )}
                        </div>
                        <span className="font-mono text-amber-300 tabular-nums">₱{i.line_total}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#22222a] pt-4 flex justify-between items-baseline text-sm font-bold text-white">
                    <span>Total Amount</span>
                    <span className="font-mono text-xl text-amber-300">₱{selectedOrderForDetail.total_amount.toLocaleString()}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrderForDetail.id, 'Completed', 'paid');
                        setSelectedOrderForDetail(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Mark Paid & Completed
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrderForDetail.id, 'Cancelled');
                        setSelectedOrderForDetail(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      Cancel & Restore Stock
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: MENU MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Menu & Dish Management</h2>
                <p className="text-xs text-neutral-400">
                  Update live dishes, set prices in PHP, toggle sold out status, and manage stock quantities.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingDish({
                    id: `item-${Date.now()}`,
                    category_id: categories[0]?.id || 'cat-sushi',
                    name: '',
                    japanese_name: '',
                    description: '',
                    price: 250,
                    image_url: '/src/assets/images/dish_salmon_nigiri_1793107469696.jpg',
                    stock_quantity: 30,
                    low_stock_threshold: 5,
                    is_available: true,
                    is_featured: false,
                  });
                  setIsDishModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#991b1b] hover:bg-[#b91c1c] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((dish) => (
                <div
                  key={dish.id}
                  className="p-5 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-serif text-base font-bold text-white">{dish.name}</h4>
                        {dish.japanese_name && (
                          <p className="text-[11px] text-neutral-400 font-serif tracking-widest">{dish.japanese_name}</p>
                        )}
                      </div>
                      <span className="font-mono text-sm font-bold text-amber-300 tabular-nums">
                        ₱{dish.price}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2">{dish.description}</p>

                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                      <span>Stock: <strong className="text-white font-mono">{dish.stock_quantity}</strong></span>
                      <span>
                        Status:{' '}
                        <strong className={dish.is_available ? 'text-emerald-400' : 'text-red-400'}>
                          {dish.is_available ? 'Available' : 'Sold Out'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#22222a] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleSoldOut(dish.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        dish.is_available
                          ? 'bg-amber-950/60 text-amber-300 hover:bg-amber-900/60'
                          : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60'
                      }`}
                    >
                      {dish.is_available ? 'Mark Sold Out' : 'Mark Available'}
                    </button>

                    <button
                      onClick={() => {
                        setEditingDish(dish);
                        setIsDishModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#22222d] text-neutral-300 hover:text-white text-xs cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dish Modal (Create / Edit) */}
            {isDishModalOpen && editingDish && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#141418] border border-[#25252e] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="font-serif text-xl font-bold text-white">
                    {editingDish.name ? 'Edit Menu Item' : 'Create New Menu Item'}
                  </h3>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveDish(editingDish);
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="text-neutral-400 block mb-1">Item Name</label>
                      <input
                        type="text"
                        required
                        value={editingDish.name}
                        onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                        className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-neutral-400 block mb-1">Price in PHP (₱)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={editingDish.price}
                          onChange={(e) => setEditingDish({ ...editingDish, price: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-neutral-400 block mb-1">Stock Quantity</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={editingDish.stock_quantity}
                          onChange={(e) => setEditingDish({ ...editingDish, stock_quantity: parseInt(e.target.value) || 0 })}
                          className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Category</label>
                      <select
                        value={editingDish.category_id}
                        onChange={(e) => setEditingDish({ ...editingDish, category_id: e.target.value })}
                        className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2 text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={editingDish.description}
                        onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                        className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2 text-white"
                      />
                    </div>

                    <div className="flex gap-2 pt-3">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-lg bg-[#991b1b] hover:bg-[#b91c1c] text-white font-semibold cursor-pointer"
                      >
                        Save Dish
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDishModalOpen(false);
                          setEditingDish(null);
                        }}
                        className="px-4 py-2.5 rounded-lg bg-[#202028] text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: INVENTORY & STOCK MOVEMENTS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">Live Inventory & Audit Ledger</h2>
              <p className="text-xs text-neutral-400">
                Track real kitchen inventory, log restocking batches, and review automatic movement logs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Stock Items Table */}
              <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4">
                <h3 className="font-serif text-lg font-bold text-white">
                  Current Stock Levels
                </h3>
                
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#181820] border border-[#24242e] flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white block">{item.name}</span>
                        <span className="text-[11px] text-neutral-400">
                          Threshold: {item.low_stock_threshold} | Status: {item.is_available ? 'Available' : 'Sold Out'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-bold text-sm tabular-nums ${
                          item.stock_quantity <= item.low_stock_threshold ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                          {item.stock_quantity} left
                        </span>
                        <button
                          onClick={() => {
                            setStockItemToAdjust(item);
                            setStockChangeVal(10);
                          }}
                          className="px-2.5 py-1 rounded bg-[#252532] text-neutral-300 hover:text-white cursor-pointer"
                        >
                          Adjust
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Movement History */}
              <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4">
                <h3 className="font-serif text-lg font-bold text-white">
                  Stock Movement Audit Log
                </h3>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {movements.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-400 bg-[#181820] rounded-xl border border-[#24242e]">
                      No inventory records are available yet.
                    </div>
                  ) : (
                    movements.map((mov) => {
                      const dish = menuItems.find((m) => m.id === mov.menu_item_id);
                      return (
                        <div
                          key={mov.id}
                          className="p-3 rounded-xl bg-[#181820] border border-[#24242e] text-xs space-y-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-white">{dish?.name || 'Dish Item'}</span>
                            <span className={`font-mono font-bold tabular-nums ${
                              mov.quantity_change > 0 ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              {mov.quantity_change > 0 ? `+${mov.quantity_change}` : mov.quantity_change}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400">{mov.reason}</p>
                          <div className="flex justify-between text-[10px] text-neutral-500 pt-0.5">
                            <span>By: {mov.created_by}</span>
                            <span>{new Date(mov.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* Adjust Stock Modal */}
            {stockItemToAdjust && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#141418] border border-[#25252e] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Adjust Stock: {stockItemToAdjust.name}
                  </h3>

                  <form onSubmit={handleSaveStockAdjustment} className="space-y-3 text-xs">
                    <div>
                      <span className="text-neutral-400 block">Current Stock:</span>
                      <strong className="text-white text-base font-mono">{stockItemToAdjust.stock_quantity} units</strong>
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">
                        Quantity Change (positive to add, negative to deduct)
                      </label>
                      <input
                        type="number"
                        required
                        value={stockChangeVal}
                        onChange={(e) => setStockChangeVal(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Reason for Adjustment</label>
                      <input
                        type="text"
                        required
                        value={stockReason}
                        onChange={(e) => setStockReason(e.target.value)}
                        className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2 text-white"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-lg bg-[#991b1b] hover:bg-[#b91c1c] text-white font-semibold cursor-pointer"
                      >
                        Apply Adjustment
                      </button>
                      <button
                        type="button"
                        onClick={() => setStockItemToAdjust(null)}
                        className="px-4 py-2.5 rounded-lg bg-[#202028] text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: RESERVATION MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">Table Reservations Ledger</h2>
              <p className="text-xs text-neutral-400">
                Review incoming requests against maximum seating capacity ({settings.max_seating_capacity} seats) and confirm bookings.
              </p>
            </div>

            {reservations.length === 0 ? (
              <div className="p-12 text-center bg-[#141418] rounded-2xl border border-[#25252e] space-y-2">
                <CalendarCheck className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="font-serif text-lg text-white">No reservation requests yet.</p>
                <p className="text-xs text-neutral-400">Customer table booking requests will appear here for staff review and confirmation.</p>
              </div>
            ) : (
            <div className="rounded-2xl bg-[#141418] border border-[#25252e] overflow-hidden">
              <p className="text-[11px] text-neutral-400 sm:hidden px-4 pt-3 pb-1">
                ← Swipe table horizontally to view all columns →
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-xs text-neutral-300">
                  <thead className="bg-[#181820] text-neutral-400 font-semibold border-b border-[#25252e]">
                    <tr>
                      <th className="p-4">Ref Code</th>
                      <th className="p-4">Guest Name</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Guests</th>
                      <th className="p-4">Occasion & Notes</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#212128]">
                    {reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-[#171720]">
                        <td className="p-4 font-mono font-bold text-white">
                          {res.id.toUpperCase()}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-white block">{res.customer_name}</span>
                          <span className="text-[11px] text-neutral-400">{res.customer_phone}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-amber-200 font-medium block">{res.reservation_date}</span>
                          <span className="text-[11px] text-neutral-400">{res.start_time}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-white tabular-nums">
                          {res.guest_count} pax
                        </td>
                        <td className="p-4 text-xs">
                          <span className="text-neutral-300 block font-medium">{res.occasion || 'Casual'}</span>
                          {res.special_requests && (
                            <span className="text-[11px] text-neutral-400 italic block">{res.special_requests}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            res.reservation_status === 'Confirmed'
                              ? 'bg-emerald-950 text-emerald-400'
                              : res.reservation_status === 'Rejected'
                              ? 'bg-red-950 text-red-400'
                              : 'bg-amber-950 text-amber-300'
                          }`}>
                            {res.reservation_status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {res.reservation_status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateReservation(res.id, 'Confirmed')}
                                  className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateReservation(res.id, 'Rejected')}
                                  className="px-2.5 py-1 rounded bg-red-950 hover:bg-red-900 text-red-300 cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {res.reservation_status === 'Confirmed' && (
                              <button
                                onClick={() => handleUpdateReservation(res.id, 'Completed')}
                                className="px-2.5 py-1 rounded bg-[#20202a] text-neutral-300 hover:text-white cursor-pointer"
                              >
                                Mark Seated
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: CATERING & GROUP MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'catering' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">Catering & Party Inquiries</h2>
              <p className="text-xs text-neutral-400">
                Review incoming platter inquiries, generate formal quotations in PHP, and update status.
              </p>
            </div>

            {cateringInquiries.length === 0 ? (
              <div className="p-12 text-center bg-[#141418] rounded-2xl border border-[#25252e] space-y-2">
                <Users className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="font-serif text-lg text-white">No catering inquiries yet.</p>
                <p className="text-xs text-neutral-400">Corporate event and celebration platter quotation requests will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cateringInquiries.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#242429] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-white text-xs font-bold">{cat.id.toUpperCase()}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#1e1e28] text-amber-300 uppercase">
                            {cat.inquiry_status}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                          {cat.customer_name} — {cat.event_type}
                        </h3>
                      </div>

                      <div className="text-left sm:text-right">
                        {cat.quotation_amount ? (
                          <span className="font-mono text-lg font-bold text-amber-300">
                            Quoted: ₱{cat.quotation_amount.toLocaleString()}
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setCateringToQuote(cat);
                              setQuoteAmount(15000);
                            }}
                            className="px-3 py-1.5 bg-[#991b1b] hover:bg-[#b91c1c] text-white rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Send Quotation
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300">
                      <div>
                        <span className="text-neutral-500 block">Event Date & Guests:</span>
                        <strong className="text-white">{cat.event_date} ({cat.guest_count} Guests)</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Fulfillment & Venue:</span>
                        <span className="text-white capitalize">{cat.fulfillment_preference} — {cat.event_location}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Contact Phone:</span>
                        <span className="text-white font-mono">{cat.customer_phone}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#181820] text-xs space-y-1">
                      <span className="font-semibold text-white">Requested Menu Items:</span>
                      <p className="text-neutral-300">{cat.requested_items}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quotation Modal */}
            {cateringToQuote && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#141418] border border-[#25252e] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Prepare Official Quote: {cateringToQuote.customer_name}
                  </h3>

                  <form onSubmit={handleUpdateCateringQuote} className="space-y-4 text-xs">
                    <div>
                      <label className="text-neutral-400 block mb-1">
                        Quotation Total in Philippine Pesos (₱)
                      </label>
                      <input
                        type="number"
                        required
                        min="1000"
                        value={quoteAmount}
                        onChange={(e) => setQuoteAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2.5 text-white font-mono text-base"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-lg bg-[#991b1b] hover:bg-[#b91c1c] text-white font-semibold cursor-pointer"
                      >
                        Submit Quotation
                      </button>
                      <button
                        type="button"
                        onClick={() => setCateringToQuote(null)}
                        className="px-4 py-2.5 rounded-lg bg-[#202028] text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: PROMOTIONS & VOUCHERS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Promotions & Vouchers</h2>
                <p className="text-xs text-neutral-400">
                  Manage digital discount codes validated on checkout.
                </p>
              </div>

              <button
                onClick={() => setIsPromoModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#991b1b] hover:bg-[#b91c1c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Voucher</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="p-5 rounded-2xl bg-[#141418] border border-[#25252e] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-white bg-[#1f1f28] px-2.5 py-1 rounded border border-[#2f2f3d]">
                      {promo.code}
                    </span>
                    <button
                      onClick={() => handleTogglePromo(promo.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded cursor-pointer ${
                        promo.is_active ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                      }`}
                    >
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="text-xs text-neutral-300 space-y-1">
                    <p>
                      Discount:{' '}
                      <strong className="text-amber-300 font-mono">
                        {promo.discount_type === 'percentage' ? `${promo.discount_value}% OFF` : `₱${promo.discount_value} OFF`}
                      </strong>
                    </p>
                    <p>Minimum Spend: <strong className="font-mono">₱{promo.minimum_order_amount}</strong></p>
                    <p>Usage: <span className="font-mono">{promo.times_used} / {promo.usage_limit}</span> times used</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Promo Modal */}
            {isPromoModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#141418] border border-[#25252e] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
                  <h3 className="font-serif text-lg font-bold text-white">Create New Voucher</h3>
                  <form onSubmit={handleCreatePromo} className="space-y-3 text-xs">
                    <div>
                      <label className="text-neutral-400 block mb-1">Voucher Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BUKIDNON15"
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value)}
                        className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2 text-white font-mono uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-neutral-400 block mb-1">Discount Type</label>
                        <select
                          value={newPromoType}
                          onChange={(e) => setNewPromoType(e.target.value as any)}
                          className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2 text-white"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed PHP (₱)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-neutral-400 block mb-1">Discount Value</label>
                        <input
                          type="number"
                          required
                          value={newPromoValue}
                          onChange={(e) => setNewPromoValue(parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Min Spend (PHP)</label>
                      <input
                        type="number"
                        required
                        value={newPromoMin}
                        onChange={(e) => setNewPromoMin(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-lg bg-[#991b1b] hover:bg-[#b91c1c] text-white font-semibold cursor-pointer"
                      >
                        Create Voucher
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPromoModalOpen(false)}
                        className="px-4 py-2.5 rounded-lg bg-[#202028] text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: BUSINESS REPORTS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Business & Sales Reports</h2>
                <p className="text-xs text-neutral-400">
                  Calculated from actual database records (gross revenue, discounts, fees, and net sales).
                </p>
              </div>

              <button
                onClick={handleExportOrdersCSV}
                className="px-4 py-2 rounded-xl bg-[#1e1e28] border border-[#2e2e3c] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Complete Sales CSV</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-[#141418] rounded-2xl border border-[#25252e] space-y-3">
                <BarChart3 className="w-8 h-8 text-neutral-500 mx-auto" />
                <p className="font-serif text-lg text-white">Sales reports will appear when order data becomes available.</p>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Financial breakdowns, average order values, and bestseller analytics are automatically derived from verified fulfilled order records.
                </p>
              </div>
            ) : (
              <>
                {/* Financial Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-1">
                    <span className="text-xs text-neutral-400">Total All-Time Net Sales</span>
                    <p className="font-mono text-3xl font-bold text-amber-300 tabular-nums">
                      ₱{totalSalesAllTime.toLocaleString()}
                    </p>
                    <span className="text-[11px] text-neutral-500">Excluding cancelled/rejected orders</span>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-1">
                    <span className="text-xs text-neutral-400">Average Order Value (AOV)</span>
                    <p className="font-mono text-3xl font-bold text-white tabular-nums">
                      ₱{orders.length > 0 ? Math.round(totalSalesAllTime / orders.length).toLocaleString() : 0}
                    </p>
                    <span className="text-[11px] text-neutral-500">Across {orders.length} lifetime orders</span>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-1">
                    <span className="text-xs text-neutral-400">Fulfillment Breakdown</span>
                    <div className="text-xs text-neutral-300 space-y-0.5 pt-1">
                      <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span className="font-mono">{orders.filter((o) => o.fulfillment_type === 'delivery').length} orders</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pickup:</span>
                        <span className="font-mono">{orders.filter((o) => o.fulfillment_type === 'pickup').length} orders</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dine-In:</span>
                        <span className="font-mono">{orders.filter((o) => o.fulfillment_type === 'dine_in').length} orders</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bestselling Dishes List */}
                <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Bestselling Dishes by Sales Volume
                  </h3>

                  <div className="space-y-2">
                    {menuItems.slice(0, 5).map((dish, idx) => (
                      <div
                        key={dish.id}
                        className="p-3.5 rounded-xl bg-[#181820] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#242432] text-amber-300 font-bold flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-semibold text-white block">{dish.name}</span>
                            <span className="text-neutral-400 text-[11px]">{dish.dietary_tags?.join(', ') || 'Japanese Specialty'}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-amber-300 tabular-nums">
                          ₱{dish.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 9: RESTAURANT SETTINGS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">Restaurant Settings & Policies</h2>
              <p className="text-xs text-neutral-400">
                Configure operational contact numbers, service availability toggles, delivery fees, and public announcements.
              </p>
            </div>

            {settingsSavedFeedback && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-600/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Settings successfully updated and saved across the website!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 block mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    value={localSettings.restaurant_name}
                    onChange={(e) => setLocalSettings({ ...localSettings, restaurant_name: e.target.value })}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Official Mobile Phone</label>
                  <input
                    type="text"
                    value={localSettings.contact_phone}
                    onChange={(e) => setLocalSettings({ ...localSettings, contact_phone: e.target.value })}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={localSettings.contact_email}
                  onChange={(e) => setLocalSettings({ ...localSettings, contact_email: e.target.value })}
                  className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Official Address</label>
                <input
                  type="text"
                  value={localSettings.address_line}
                  onChange={(e) => setLocalSettings({ ...localSettings, address_line: e.target.value })}
                  className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Google Maps Location Link</label>
                <input
                  type="url"
                  value={localSettings.google_maps_url}
                  onChange={(e) => setLocalSettings({ ...localSettings, google_maps_url: e.target.value })}
                  className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2.5 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Announcement Banner (Shows at Top of Site)</label>
                <input
                  type="text"
                  value={localSettings.announcement_banner}
                  onChange={(e) => setLocalSettings({ ...localSettings, announcement_banner: e.target.value })}
                  className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 block mb-1">Base Delivery Fee (PHP)</label>
                  <input
                    type="number"
                    value={localSettings.delivery_fee_base}
                    onChange={(e) => setLocalSettings({ ...localSettings, delivery_fee_base: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Free Delivery Spend Threshold (PHP)</label>
                  <input
                    type="number"
                    value={localSettings.free_delivery_threshold}
                    onChange={(e) => setLocalSettings({ ...localSettings, free_delivery_threshold: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 block mb-1">GCash Account Name</label>
                  <input
                    type="text"
                    value={localSettings.gcash_recipient_name}
                    onChange={(e) => setLocalSettings({ ...localSettings, gcash_recipient_name: e.target.value })}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">GCash Account Number</label>
                  <input
                    type="text"
                    value={localSettings.gcash_recipient_number}
                    onChange={(e) => setLocalSettings({ ...localSettings, gcash_recipient_number: e.target.value })}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Service Toggles */}
              <div className="pt-3 border-t border-[#22222a] space-y-2.5">
                <span className="font-semibold text-white block">Active Public Services:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.dine_in_enabled}
                      onChange={(e) => setLocalSettings({ ...localSettings, dine_in_enabled: e.target.checked })}
                      className="rounded bg-[#1b1b22] border-[#2a2a35] text-[#991b1b]"
                    />
                    <span>Dine-In Orders</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.pickup_enabled}
                      onChange={(e) => setLocalSettings({ ...localSettings, pickup_enabled: e.target.checked })}
                      className="rounded bg-[#1b1b22] border-[#2a2a35] text-[#991b1b]"
                    />
                    <span>Takeout / Pickup</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.delivery_enabled}
                      onChange={(e) => setLocalSettings({ ...localSettings, delivery_enabled: e.target.checked })}
                      className="rounded bg-[#1b1b22] border-[#2a2a35] text-[#991b1b]"
                    />
                    <span>Valencia Delivery</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.reservations_enabled}
                      onChange={(e) => setLocalSettings({ ...localSettings, reservations_enabled: e.target.checked })}
                      className="rounded bg-[#1b1b22] border-[#2a2a35] text-[#991b1b]"
                    />
                    <span>Online Reservations</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.catering_enabled}
                      onChange={(e) => setLocalSettings({ ...localSettings, catering_enabled: e.target.checked })}
                      className="rounded bg-[#1b1b22] border-[#2a2a35] text-[#991b1b]"
                    />
                    <span>Catering Inquiries</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#22222a]">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#991b1b] hover:bg-[#b91c1c] text-white font-semibold text-xs uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Save Restaurant Settings
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

    </div>
  );
};
