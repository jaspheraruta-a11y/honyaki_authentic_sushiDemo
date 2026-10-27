export type UserRole = 'customer' | 'staff' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  japanese_name?: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

export interface MenuItemVariant {
  id: string;
  menu_item_id: string;
  name: string;
  price_adjustment: number;
  is_active: boolean;
}

export interface MenuItemAddon {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  is_available: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  japanese_name?: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  low_stock_threshold: number;
  is_available: boolean;
  is_featured?: boolean;
  dietary_tags?: string[];
  variants?: MenuItemVariant[];
  addons?: MenuItemAddon[];
  created_at?: string;
  updated_at?: string;
}

export type FulfillmentType = 'dine_in' | 'pickup' | 'delivery';

export type PaymentMethod = 'cash' | 'gcash' | 'maya' | 'bank_transfer';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type OrderStatus =
  | 'Pending Confirmation'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected';

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  selected_variants: { name: string; price_adjustment: number }[];
  selected_addons: { name: string; price: number }[];
  line_total: number;
}

export interface Order {
  id: string;
  order_number: string;
  access_token: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  fulfillment_type: FulfillmentType;
  delivery_address?: string;
  delivery_barangay?: string;
  delivery_instructions?: string;
  table_number?: string;
  pickup_time?: string;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export type ReservationStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Rejected'
  | 'Cancelled'
  | 'Completed'
  | 'No-show';

export interface Reservation {
  id: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  start_time: string;
  guest_count: number;
  special_requests?: string;
  occasion?: string;
  seating_preference?: string;
  reservation_status: ReservationStatus;
  staff_notes?: string;
  created_at: string;
  updated_at: string;
}

export type CateringStatus =
  | 'pending'
  | 'quoted'
  | 'accepted'
  | 'declined'
  | 'completed';

export interface CateringInquiry {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  budget_range?: string;
  requested_items: string;
  fulfillment_preference: 'pickup' | 'delivery';
  event_location?: string;
  quotation_amount?: number;
  inquiry_status: CateringStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  menu_item_id: string;
  movement_type: 'restock' | 'order_deduct' | 'spoilage' | 'manual_adjustment' | 'order_cancel_restore';
  quantity_change: number;
  reason: string;
  order_id?: string;
  created_by: string;
  created_at: string;
}

export interface Promotion {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  starts_at: string;
  expires_at: string;
  usage_limit: number;
  times_used: number;
  is_active: boolean;
}

export interface RestaurantSettings {
  restaurant_name: string;
  tagline: string;
  address_line: string;
  city: string;
  province: string;
  country: string;
  contact_phone: string;
  contact_email: string;
  facebook_url: string;
  instagram_url: string;
  google_maps_url: string;
  operating_hours: string;
  dine_in_enabled: boolean;
  pickup_enabled: boolean;
  delivery_enabled: boolean;
  reservations_enabled: boolean;
  catering_enabled: boolean;
  delivery_fee_base: number;
  free_delivery_threshold: number;
  max_seating_capacity: number;
  prep_time_minutes: number;
  gcash_recipient_name: string;
  gcash_recipient_number: string;
  maya_recipient_number: string;
  announcement_banner: string;
  is_delivery_confirmed: boolean;
  is_reservations_confirmed: boolean;
  service_verification_note: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedVariants: { name: string; price_adjustment: number }[];
  selectedAddons: { name: string; price: number }[];
}
