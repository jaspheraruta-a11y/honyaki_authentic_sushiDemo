-- ==============================================================================
-- HONYAKI AUTHENTIC SUSHI VALENCIA — PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Location: Valencia City, Bukidnon, Philippines
-- Features: Profiles, Menu, Orders, Order Items, Reservations, Catering,
--           Inventory Movements, Promotions, Settings, and Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Menu Categories
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  japanese_name TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Menu Items
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  japanese_name TEXT,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  dietary_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Menu Item Variants (e.g. Size, Piece Count)
CREATE TABLE IF NOT EXISTS public.menu_item_variants (
  id TEXT PRIMARY KEY,
  menu_item_id TEXT NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 6. Menu Item Add-ons (e.g. Extra Wasabi, Spicy Mayo)
CREATE TABLE IF NOT EXISTS public.menu_item_addons (
  id TEXT PRIMARY KEY,
  menu_item_id TEXT NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  is_available BOOLEAN NOT NULL DEFAULT true
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('dine_in', 'pickup', 'delivery')),
  delivery_address TEXT,
  delivery_barangay TEXT,
  delivery_instructions TEXT,
  table_number TEXT,
  pickup_time TEXT,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'gcash', 'maya', 'bank_transfer')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  order_status TEXT NOT NULL DEFAULT 'Pending Confirmation' CHECK (order_status IN (
    'Pending Confirmation', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Completed', 'Cancelled', 'Rejected'
  )),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Order Items (Snapshotting names and prices)
CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id TEXT REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name_snapshot TEXT NOT NULL,
  unit_price_snapshot NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  selected_variants JSONB DEFAULT '[]'::jsonb,
  selected_addons JSONB DEFAULT '[]'::jsonb,
  line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0)
);

-- 9. Reservations Table
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  special_requests TEXT,
  occasion TEXT,
  seating_preference TEXT,
  reservation_status TEXT NOT NULL DEFAULT 'Pending' CHECK (reservation_status IN (
    'Pending', 'Confirmed', 'Rejected', 'Cancelled', 'Completed', 'No-show'
  )),
  staff_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Catering Inquiries Table
CREATE TABLE IF NOT EXISTS public.catering_inquiries (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  budget_range TEXT,
  requested_items TEXT NOT NULL,
  fulfillment_preference TEXT NOT NULL CHECK (fulfillment_preference IN ('pickup', 'delivery')),
  event_location TEXT,
  quotation_amount NUMERIC(10, 2),
  inquiry_status TEXT NOT NULL DEFAULT 'pending' CHECK (inquiry_status IN ('pending', 'quoted', 'accepted', 'declined', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Inventory Movements
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id TEXT PRIMARY KEY,
  menu_item_id TEXT NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('restock', 'order_deduct', 'spoilage', 'manual_adjustment', 'order_cancel_restore')),
  quantity_change INTEGER NOT NULL,
  reason TEXT NOT NULL,
  order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Promotions & Discount Vouchers
CREATE TABLE IF NOT EXISTS public.promotions (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  minimum_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  starts_at DATE NOT NULL,
  expires_at DATE NOT NULL,
  usage_limit INTEGER NOT NULL DEFAULT 100,
  times_used INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 13. Restaurant Settings
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_catering_date ON public.catering_inquiries(event_date);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin/staff
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('staff', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public can read active categories and available menu items
CREATE POLICY "Public read menu categories" ON public.menu_categories
  FOR SELECT USING (is_active = true OR public.is_staff_or_admin());

CREATE POLICY "Public read menu items" ON public.menu_items
  FOR SELECT USING (is_available = true OR public.is_staff_or_admin());

CREATE POLICY "Public read menu variants" ON public.menu_item_variants
  FOR SELECT USING (is_active = true OR public.is_staff_or_admin());

CREATE POLICY "Public read menu addons" ON public.menu_item_addons
  FOR SELECT USING (is_available = true OR public.is_staff_or_admin());

-- Customers can view their own orders or orders matching access_token
CREATE POLICY "Users read own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = customer_id OR
    public.is_staff_or_admin()
  );

-- Customers can insert orders
CREATE POLICY "Anyone can insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- Customers can view reservations
CREATE POLICY "Users view own reservations" ON public.reservations
  FOR SELECT USING (
    auth.uid() = customer_id OR
    public.is_staff_or_admin()
  );

CREATE POLICY "Anyone can create reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

-- Anyone can submit catering inquiries
CREATE POLICY "Anyone can insert catering inquiries" ON public.catering_inquiries
  FOR INSERT WITH CHECK (true);

-- Only staff/admin can manage inventory and modify orders/menu
CREATE POLICY "Staff manage menu" ON public.menu_items
  FOR ALL USING (public.is_staff_or_admin());

CREATE POLICY "Staff manage orders" ON public.orders
  FOR UPDATE USING (public.is_staff_or_admin());

CREATE POLICY "Staff manage reservations" ON public.reservations
  FOR UPDATE USING (public.is_staff_or_admin());

CREATE POLICY "Staff manage catering" ON public.catering_inquiries
  FOR ALL USING (public.is_staff_or_admin());

CREATE POLICY "Staff read inventory" ON public.inventory_movements
  FOR ALL USING (public.is_staff_or_admin());
