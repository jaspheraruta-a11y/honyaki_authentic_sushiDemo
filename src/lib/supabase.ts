import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  MenuCategory,
  MenuItem,
  Order,
  Reservation,
  CateringInquiry,
  InventoryMovement,
  Promotion,
  RestaurantSettings,
} from '../types';
import { IS_DEMO_MODE } from './demoConfig';

// Safely access environment variables without printing their values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verify if Supabase is genuinely configured with a live project URL
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Backend Data Service with graceful fallback
 */
export const supabaseService = {
  isConfigured(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  async fetchMenuCategories(): Promise<{ data: MenuCategory[] | null; error: Error | null }> {
    if (!supabase) return { data: null, error: null };
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as MenuCategory[], error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  async fetchMenuItems(): Promise<{ data: MenuItem[] | null; error: Error | null }> {
    if (!supabase) return { data: null, error: null };
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          variants:menu_item_variants(*),
          addons:menu_item_addons(*)
        `)
        .order('name', { ascending: true });
      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as MenuItem[], error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  async fetchOrders(): Promise<{ data: Order[] | null; error: Error | null }> {
    if (!supabase) return { data: null, error: null };
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });
      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as Order[], error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  async fetchOrderByNumber(orderNumber: string): Promise<{ data: Order | null; error: Error | null }> {
    if (!supabase) return { data: null, error: null };
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('order_number', orderNumber)
        .maybeSingle();
      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as Order | null, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  async createOrder(order: Order): Promise<{ success: boolean; error?: string }> {
    if (IS_DEMO_MODE) {
      return { success: false, error: 'Demo mode active: Supabase backend order creation is restricted.' };
    }
    if (!supabase) return { success: true }; // Handled by local persistent store
    try {
      const { items, ...orderHeader } = order;
      const { error: headerErr } = await supabase.from('orders').insert(orderHeader);
      if (headerErr) return { success: false, error: headerErr.message };

      if (items && items.length > 0) {
        const orderItemsToInsert = items.map((i) => ({
          ...i,
          order_id: order.id,
        }));
        const { error: itemsErr } = await supabase.from('order_items').insert(orderItemsToInsert);
        if (itemsErr) return { success: false, error: itemsErr.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async fetchReservations(): Promise<{ data: Reservation[] | null; error: Error | null }> {
    if (!supabase) return { data: null, error: null };
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as Reservation[], error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  async createReservation(reservation: Reservation): Promise<{ success: boolean; error?: string }> {
    if (IS_DEMO_MODE) {
      return { success: false, error: 'Demo mode active: Supabase backend reservation creation is restricted.' };
    }
    if (!supabase) return { success: true };
    try {
      const { error } = await supabase.from('reservations').insert(reservation);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async fetchCateringInquiries(): Promise<{ data: CateringInquiry[] | null; error: Error | null }> {
    if (!supabase) return { data: null, error: null };
    try {
      const { data, error } = await supabase
        .from('catering_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as CateringInquiry[], error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  async createCateringInquiry(inquiry: CateringInquiry): Promise<{ success: boolean; error?: string }> {
    if (IS_DEMO_MODE) {
      return { success: false, error: 'Demo mode active: Supabase backend catering inquiry creation is restricted.' };
    }
    if (!supabase) return { success: true };
    try {
      const { error } = await supabase.from('catering_inquiries').insert(inquiry);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async fetchInventoryMovements(): Promise<{ data: InventoryMovement[] | null; error: Error | null }> {
    if (!supabase) return { data: null, error: null };
    try {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as InventoryMovement[], error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  async fetchPromotions(): Promise<{ data: Promotion[] | null; error: Error | null }> {
    if (!supabase) return { data: null, error: null };
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true);
      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as Promotion[], error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },
};
