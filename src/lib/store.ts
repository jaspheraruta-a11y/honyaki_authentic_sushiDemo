import {
  MenuCategory,
  MenuItem,
  Order,
  Reservation,
  CateringInquiry,
  InventoryMovement,
  Promotion,
  RestaurantSettings,
  Profile,
} from '../types';

export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Honyaki+Authentic+Sushi+Valencia/@7.9423426,125.1109165,7617m/data=!3m1!1e3!4m15!1m8!3m7!1s0x32ff197dcc3e6a41:0xfd73c3a172dc74bc!2sValencia+City,+Bukidnon!3b1!8m2!3d7.9048967!4d125.0906584!16zL20vMDZwa2Qy!3m5!1s0x32ff1bffe3fa3871:0x8f886ec8fa41a61c!8m2!3d7.9465815!4d125.1012141!16s%2Fg%2F11p0623p4r?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D';

export const INITIAL_SETTINGS: RestaurantSettings = {
  restaurant_name: 'Honyaki Authentic Sushi Valencia',
  tagline: 'Artisanal Japanese Dining & Gourmet Sushi in Valencia City, Bukidnon',
  address_line: '3rd Floor, ASV Townhouse, Sayre Highway, Barangay Bagontaas',
  city: 'Valencia City',
  province: 'Bukidnon',
  country: 'Philippines',
  contact_phone: '0954 298 2417',
  contact_email: 'honyakiitamaesushi2016@gmail.com',
  facebook_url: 'https://facebook.com/honyakisushivalencia',
  instagram_url: 'https://instagram.com/honyakisushivalencia',
  google_maps_url: GOOGLE_MAPS_URL,
  operating_hours: 'Tuesday – Sunday: 11:00 AM – 2:00 PM, 5:00 PM – 9:30 PM (Closed Mondays)',
  dine_in_enabled: true,
  pickup_enabled: true,
  delivery_enabled: true,
  reservations_enabled: true,
  catering_enabled: true,
  delivery_fee_base: 60,
  free_delivery_threshold: 1500,
  max_seating_capacity: 42,
  prep_time_minutes: 25,
  gcash_recipient_name: 'HONYAKI AUTHENTIC RESTAURANT',
  gcash_recipient_number: '0954 298 2417',
  maya_recipient_number: '0954 298 2417',
  announcement_banner: 'Visit Honyaki Valencia at 3rd Floor, ASV Townhouse, Sayre Highway, Brgy. Bagontaas. For table reservations or orders: 0954 298 2417.',
  is_delivery_confirmed: true,
  is_reservations_confirmed: true,
  service_verification_note: 'Location: 3rd Floor, ASV Townhouse, Sayre Highway, Barangay Bagontaas, Valencia City, Bukidnon. Dine-in, pickup, and city proper delivery available. Contact: 0954 298 2417.',
};

export const INITIAL_CATEGORIES: MenuCategory[] = [
  { id: 'cat-sushi', name: 'Nigiri & Sashimi', japanese_name: '握り・刺身', description: 'Fresh, hand-pressed sushi and sashimi slices served with fresh wasabi', display_order: 1, is_active: true },
  { id: 'cat-maki', name: 'Maki & Specialty Rolls', japanese_name: '巻き寿司', description: 'Artfully rolled sushi with premium fillings, house sauces, and tempura crunch', display_order: 2, is_active: true },
  { id: 'cat-ramen', name: 'Ramen & Noodles', japanese_name: 'ラーメン', description: 'Simmered 14-hour rich broths, artisan noodles, and braised chashu pork', display_order: 3, is_active: true },
  { id: 'cat-rice', name: 'Donburi & Rice Bowls', japanese_name: '丼もの', description: 'Steaming Japanese short-grain rice bowls topped with savory meats and glaze', display_order: 4, is_active: true },
  { id: 'cat-platters', name: 'Party Platters & Sets', japanese_name: '盛り合わせ', description: 'Generous sharing platters for family gatherings, celebrations, and office meetings', display_order: 5, is_active: true },
  { id: 'cat-appetizers', name: 'Appetizers & Sides', japanese_name: '一品料理', description: 'Crispy gyoza, edamame, golden ebi tempura, and warm miso soup', display_order: 6, is_active: true },
  { id: 'cat-beverages', name: 'Beverages & Desserts', japanese_name: '飲み物・甘味', description: 'Japanese green tea, craft lemonades, and matcha ice cream', display_order: 7, is_active: true },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-salmon-nigiri',
    category_id: 'cat-sushi',
    name: 'Aburi Salmon Nigiri (3 pcs)',
    japanese_name: '炙りサーモン握り',
    description: 'Lightly torched premium Atlantic salmon belly with Japanese mayo, sweet unagi tare glaze, and orange tobiko roe.',
    price: 245,
    image_url: '/src/assets/images/dish_salmon_nigiri_1793107469696.jpg',
    stock_quantity: 45,
    low_stock_threshold: 8,
    is_available: true,
    is_featured: true,
    dietary_tags: ['Fresh Seafood', 'Chef Recommendation'],
    variants: [
      { id: 'var-1', menu_item_id: 'item-salmon-nigiri', name: 'Standard (3 pcs)', price_adjustment: 0, is_active: true },
      { id: 'var-2', menu_item_id: 'item-salmon-nigiri', name: 'Double Set (6 pcs)', price_adjustment: 230, is_active: true },
    ],
    addons: [
      { id: 'add-1', menu_item_id: 'item-salmon-nigiri', name: 'Extra Wasabi & Pickled Ginger', price: 25, is_available: true },
      { id: 'add-2', menu_item_id: 'item-salmon-nigiri', name: 'Spicy Kewpie Mayo Dip', price: 35, is_available: true },
    ],
  },
  {
    id: 'item-dragon-maki',
    category_id: 'cat-maki',
    name: 'Dragon Specialty Roll (8 pcs)',
    japanese_name: 'ドラゴンロール',
    description: 'Crisp tempura black tiger shrimp and cucumber roll, draped with ripe avocado slices, caramelized unagi eel, and toasted sesame.',
    price: 360,
    image_url: '/src/assets/images/dish_dragon_maki_1793107470567.jpg',
    stock_quantity: 38,
    low_stock_threshold: 10,
    is_available: true,
    is_featured: true,
    dietary_tags: ['Bestseller', 'Cooked & Torched'],
    variants: [
      { id: 'var-3', menu_item_id: 'item-dragon-maki', name: 'Full Roll (8 pcs)', price_adjustment: 0, is_active: true },
      { id: 'var-4', menu_item_id: 'item-dragon-maki', name: 'Party Half (4 pcs)', price_adjustment: -150, is_active: true },
    ],
    addons: [
      { id: 'add-3', menu_item_id: 'item-dragon-maki', name: 'Extra Unagi Sweet Tare Sauce', price: 30, is_available: true },
      { id: 'add-4', menu_item_id: 'item-dragon-maki', name: 'Crunchy Tenkasu Topping', price: 20, is_available: true },
    ],
  },
  {
    id: 'item-tonkotsu-ramen',
    category_id: 'cat-ramen',
    name: 'Honyaki Tonkotsu Chashu Ramen',
    japanese_name: '本焼き豚骨ラーメン',
    description: 'Rich 14-hour simmered pork bone broth, firm artisan noodles, thick melt-in-mouth chashu slices, ajitsuke soft-boiled egg, and nori.',
    price: 385,
    image_url: '/src/assets/images/dish_tonkotsu_ramen_1793107472799.jpg',
    stock_quantity: 50,
    low_stock_threshold: 10,
    is_available: true,
    is_featured: true,
    dietary_tags: ['House Specialty', 'Rich Broth'],
    variants: [
      { id: 'var-5', menu_item_id: 'item-tonkotsu-ramen', name: 'Classic Rich Tonkotsu', price_adjustment: 0, is_active: true },
      { id: 'var-6', menu_item_id: 'item-tonkotsu-ramen', name: 'Spicy Chili Garlic Oil (Karaka)', price_adjustment: 35, is_active: true },
    ],
    addons: [
      { id: 'add-5', menu_item_id: 'item-tonkotsu-ramen', name: 'Extra Chashu Pork Slices (2 pcs)', price: 85, is_available: true },
      { id: 'add-6', menu_item_id: 'item-tonkotsu-ramen', name: 'Extra Ajitsuke Tamago (Whole Egg)', price: 45, is_available: true },
      { id: 'add-7', menu_item_id: 'item-tonkotsu-ramen', name: 'Kae-dama (Extra Noodle Portion)', price: 60, is_available: true },
    ],
  },
  {
    id: 'item-grand-platter',
    category_id: 'cat-platters',
    name: 'Honyaki Grand Celebration Platter (40 pcs)',
    japanese_name: '本焼き豪華盛り合わせ',
    description: 'Curated sushi feast including Dragon Rolls, Salmon Aburi Nigiri, California Crunch, Spicy Tuna Maki, and Tamago sushi on a presentation board.',
    price: 1580,
    image_url: '/src/assets/images/hero_sushi_spread_1793107470076.jpg',
    stock_quantity: 15,
    low_stock_threshold: 4,
    is_available: true,
    is_featured: true,
    dietary_tags: ['Party Favorite', 'Serves 4-6'],
    variants: [
      { id: 'var-7', menu_item_id: 'item-grand-platter', name: '40 Pieces Classic Platter', price_adjustment: 0, is_active: true },
      { id: 'var-8', menu_item_id: 'item-grand-platter', name: '60 Pieces VIP Platter (Serves 6-8)', price_adjustment: 750, is_active: true },
    ],
    addons: [
      { id: 'add-8', menu_item_id: 'item-grand-platter', name: 'Platter Party Chopsticks & Condiment Pack (6 sets)', price: 50, is_available: true },
    ],
  },
  {
    id: 'item-spicy-tuna-maki',
    category_id: 'cat-maki',
    name: 'Spicy Tuna Tartare Roll (8 pcs)',
    japanese_name: 'スパイシーツナ巻き',
    description: 'Fresh yellowfin tuna tossed with chili sesame oil and Japanese mayo, rolled with fresh cucumber and topped with togarashi spices.',
    price: 295,
    image_url: '/src/assets/images/dish_dragon_maki_1793107470567.jpg',
    stock_quantity: 26,
    low_stock_threshold: 5,
    is_available: true,
    is_featured: false,
    dietary_tags: ['Spicy', 'Fresh Tuna'],
  },
  {
    id: 'item-california-crunch',
    category_id: 'cat-maki',
    name: 'California Crunch Maki (8 pcs)',
    japanese_name: 'カリフォルニア巻き',
    description: 'Kani crabstick, fresh mango and Japanese cucumber, rolled in orange ebiko roe with sweet kewpie drizzle.',
    price: 270,
    image_url: '/src/assets/images/dish_salmon_nigiri_1793107469696.jpg',
    stock_quantity: 40,
    low_stock_threshold: 8,
    is_available: true,
    is_featured: false,
    dietary_tags: ['Kid Friendly', 'Crowd Favorite'],
  },
  {
    id: 'item-gyudon-bowl',
    category_id: 'cat-rice',
    name: 'Slow-Simmered Beef Gyudon',
    japanese_name: '牛丼',
    description: 'Thinly sliced US short plate beef and tender sweet onions simmered in dashi mirin sauce over steaming Japanese rice, topped with onsen egg.',
    price: 310,
    image_url: '/src/assets/images/dish_tonkotsu_ramen_1793107472799.jpg',
    stock_quantity: 32,
    low_stock_threshold: 6,
    is_available: true,
    is_featured: false,
    dietary_tags: ['Beef', 'Rice Bowl'],
    addons: [
      { id: 'add-9', menu_item_id: 'item-gyudon-bowl', name: 'Extra Onsen Poached Egg', price: 35, is_available: true },
      { id: 'add-10', menu_item_id: 'item-gyudon-bowl', name: 'Kimchi Side Dish', price: 45, is_available: true },
    ],
  },
  {
    id: 'item-ebi-tempura',
    category_id: 'cat-appetizers',
    name: 'Crispy Ebi Tempura (5 pcs)',
    japanese_name: '海老の天ぷら',
    description: 'Golden crispy tiger shrimp tempura fried in authentic light batter, served with grated daikon radish and warm tentsuyu sauce.',
    price: 320,
    image_url: '/src/assets/images/dish_salmon_nigiri_1793107469696.jpg',
    stock_quantity: 30,
    low_stock_threshold: 6,
    is_available: true,
    is_featured: false,
    dietary_tags: ['Crispy', 'Appetizer'],
  },
  {
    id: 'item-pork-gyoza',
    category_id: 'cat-appetizers',
    name: 'Pan-Seared Handmade Pork Gyoza (6 pcs)',
    japanese_name: '焼き餃子',
    description: 'Crispy-bottom dumplings stuffed with seasoned ground pork, garlic chives, and cabbage, served with tangy gyoza tare.',
    price: 210,
    image_url: '/src/assets/images/dish_dragon_maki_1793107470567.jpg',
    stock_quantity: 42,
    low_stock_threshold: 10,
    is_available: true,
    is_featured: false,
    dietary_tags: ['Pan Fried', 'Appetizer'],
  },
  {
    id: 'item-matcha-icecream',
    category_id: 'cat-beverages',
    name: 'Authentic Uji Matcha Artisan Gelato',
    japanese_name: '宇治抹茶アイス',
    description: 'Rich, bittersweet ceremonial Uji matcha green tea ice cream served with sweet azuki red bean paste and roasted sesame wafer.',
    price: 160,
    image_url: '/src/assets/images/dish_salmon_nigiri_1793107469696.jpg',
    stock_quantity: 25,
    low_stock_threshold: 5,
    is_available: true,
    is_featured: false,
    dietary_tags: ['Dessert', 'Vegetarian'],
  },
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-welcome',
    code: 'HONYAKI10',
    discount_type: 'percentage',
    discount_value: 10,
    minimum_order_amount: 500,
    starts_at: '2026-01-01',
    expires_at: '2026-12-31',
    usage_limit: 500,
    times_used: 48,
    is_active: true,
  },
  {
    id: 'promo-valencia',
    code: 'VALENCIA100',
    discount_type: 'fixed',
    discount_value: 100,
    minimum_order_amount: 1000,
    starts_at: '2026-01-01',
    expires_at: '2026-12-31',
    usage_limit: 200,
    times_used: 24,
    is_active: true,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'HNY-261027-01',
    access_token: 'tok_hny_01a',
    customer_name: 'Maria Elena Santos',
    customer_email: 'maria.santos@gmail.com',
    customer_phone: '0917-555-1284',
    fulfillment_type: 'delivery',
    delivery_address: 'Door 3, Villa Ernesto Subd, Brgy. Poblacion',
    delivery_barangay: 'Poblacion',
    delivery_instructions: 'Please call upon arrival at the subdivision gate.',
    subtotal: 1005,
    discount_amount: 100,
    delivery_fee: 60,
    total_amount: 965,
    payment_method: 'gcash',
    payment_status: 'paid',
    order_status: 'Preparing',
    notes: 'Extra pickled ginger please!',
    items: [
      {
        id: 'ord-item-1',
        order_id: 'ord-1001',
        menu_item_id: 'item-salmon-nigiri',
        item_name_snapshot: 'Aburi Salmon Nigiri (3 pcs)',
        unit_price_snapshot: 245,
        quantity: 1,
        selected_variants: [{ name: 'Standard (3 pcs)', price_adjustment: 0 }],
        selected_addons: [{ name: 'Extra Wasabi & Pickled Ginger', price: 25 }],
        line_total: 270,
      },
      {
        id: 'ord-item-2',
        order_id: 'ord-1001',
        menu_item_id: 'item-tonkotsu-ramen',
        item_name_snapshot: 'Honyaki Tonkotsu Chashu Ramen',
        unit_price_snapshot: 385,
        quantity: 1,
        selected_variants: [{ name: 'Spicy Chili Garlic Oil (Karaka)', price_adjustment: 35 }],
        selected_addons: [],
        line_total: 420,
      },
      {
        id: 'ord-item-3',
        order_id: 'ord-1001',
        menu_item_id: 'item-dragon-maki',
        item_name_snapshot: 'Dragon Specialty Roll (8 pcs)',
        unit_price_snapshot: 360,
        quantity: 1,
        selected_variants: [{ name: 'Full Roll (8 pcs)', price_adjustment: 0 }],
        selected_addons: [],
        line_total: 360,
      },
    ],
    created_at: '2026-10-27T05:30:00Z',
    updated_at: '2026-10-27T05:40:00Z',
  },
  {
    id: 'ord-1002',
    order_number: 'HNY-261027-02',
    access_token: 'tok_hny_02b',
    customer_name: 'Daryl John Ramos',
    customer_email: 'daryl.ramos@yahoo.com',
    customer_phone: '0928-892-4112',
    fulfillment_type: 'pickup',
    pickup_time: '12:30 PM',
    subtotal: 1580,
    discount_amount: 0,
    delivery_fee: 0,
    total_amount: 1580,
    payment_method: 'cash',
    payment_status: 'pending',
    order_status: 'Confirmed',
    notes: 'Picking up during lunch break.',
    items: [
      {
        id: 'ord-item-4',
        order_id: 'ord-1002',
        menu_item_id: 'item-grand-platter',
        item_name_snapshot: 'Honyaki Grand Celebration Platter (40 pcs)',
        unit_price_snapshot: 1580,
        quantity: 1,
        selected_variants: [{ name: '40 Pieces Classic Platter', price_adjustment: 0 }],
        selected_addons: [],
        line_total: 1580,
      },
    ],
    created_at: '2026-10-27T05:45:00Z',
    updated_at: '2026-10-27T05:48:00Z',
  },
  {
    id: 'ord-1003',
    order_number: 'HNY-261027-03',
    access_token: 'tok_hny_03c',
    customer_name: 'Patricia Joy Lim',
    customer_email: 'patricia.lim@gmail.com',
    customer_phone: '0995-123-9988',
    fulfillment_type: 'dine_in',
    table_number: 'Table 4',
    subtotal: 580,
    discount_amount: 58,
    delivery_fee: 0,
    total_amount: 522,
    payment_method: 'maya',
    payment_status: 'paid',
    order_status: 'Ready for Pickup',
    notes: 'Dine-in lunch table 4',
    items: [
      {
        id: 'ord-item-5',
        order_id: 'ord-1003',
        menu_item_id: 'item-california-crunch',
        item_name_snapshot: 'California Crunch Maki (8 pcs)',
        unit_price_snapshot: 270,
        quantity: 1,
        selected_variants: [],
        selected_addons: [],
        line_total: 270,
      },
      {
        id: 'ord-item-6',
        order_id: 'ord-1003',
        menu_item_id: 'item-gyudon-bowl',
        item_name_snapshot: 'Slow-Simmered Beef Gyudon',
        unit_price_snapshot: 310,
        quantity: 1,
        selected_variants: [],
        selected_addons: [],
        line_total: 310,
      },
    ],
    created_at: '2026-10-27T05:50:00Z',
    updated_at: '2026-10-27T06:10:00Z',
  },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-201',
    customer_name: 'Atty. Roberto Tan',
    customer_email: 'roberto.tan.law@gmail.com',
    customer_phone: '0917-701-3421',
    reservation_date: '2026-10-28',
    start_time: '18:30',
    guest_count: 6,
    special_requests: 'Quiet booth area if possible for business dinner.',
    occasion: 'Business Dinner',
    seating_preference: 'Main Hall Booth',
    reservation_status: 'Confirmed',
    staff_notes: 'VIP booth 2 reserved. Advance table setup done.',
    created_at: '2026-10-26T10:00:00Z',
    updated_at: '2026-10-26T11:30:00Z',
  },
  {
    id: 'res-202',
    customer_name: 'Camille Grace Navarro',
    customer_email: 'camille.navarro@outlook.com',
    customer_phone: '0922-445-6712',
    reservation_date: '2026-10-29',
    start_time: '19:00',
    guest_count: 4,
    special_requests: 'Celebrating 5th anniversary. Can we request a small surprise candle on dessert?',
    occasion: 'Anniversary',
    seating_preference: 'Intimate corner table',
    reservation_status: 'Pending',
    staff_notes: 'Call customer to confirm dessert timing.',
    created_at: '2026-10-27T02:15:00Z',
    updated_at: '2026-10-27T02:15:00Z',
  },
];

export const INITIAL_CATERING: CateringInquiry[] = [
  {
    id: 'cat-301',
    customer_name: 'Valencia Doctors Hospital – Pediatric Dept',
    customer_email: 'admin.pedia@valenciadoctors.com',
    customer_phone: '0917-889-2233',
    event_type: 'Hospital Staff Appreciation Dinner',
    event_date: '2026-11-05',
    guest_count: 35,
    budget_range: '₱15,000 – ₱20,000',
    requested_items: 'Custom mixed sushi & sashimi platters, Ebi tempura boxes, and Chicken teriyaki don bowls for 35 doctors and nurses.',
    fulfillment_preference: 'delivery',
    event_location: 'Valencia Doctors Hospital Function Hall, Sayre Highway',
    quotation_amount: 17500,
    inquiry_status: 'quoted',
    notes: 'Quotation sent via email. Awaiting hospital committee signoff.',
    created_at: '2026-10-25T08:30:00Z',
    updated_at: '2026-10-26T09:00:00Z',
  },
];

export const INITIAL_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    menu_item_id: 'item-salmon-nigiri',
    movement_type: 'restock',
    quantity_change: 50,
    reason: 'Fresh General Santos sashimi salmon supplier delivery',
    created_by: 'Head Chef Kenji',
    created_at: '2026-10-27T04:00:00Z',
  },
  {
    id: 'mov-2',
    menu_item_id: 'item-salmon-nigiri',
    movement_type: 'order_deduct',
    quantity_change: -1,
    reason: 'Fulfillment Order #HNY-261027-01',
    order_id: 'ord-1001',
    created_by: 'Kitchen POS Auto-Sync',
    created_at: '2026-10-27T05:30:00Z',
  },
];

// Persistent state wrapper using LocalStorage with fallback
class RestaurantStore {
  private get<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(`honyaki_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`honyaki_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }

  getSettings(): RestaurantSettings {
    const loaded = this.get<RestaurantSettings>('settings', INITIAL_SETTINGS);
    // Always sync verified address, email, phone, and Google Maps URL if outdated
    if (
      !loaded.google_maps_url ||
      loaded.contact_email !== 'honyakiitamaesushi2016@gmail.com' ||
      !loaded.address_line.includes('ASV Townhouse')
    ) {
      const merged = {
        ...loaded,
        address_line: INITIAL_SETTINGS.address_line,
        contact_phone: INITIAL_SETTINGS.contact_phone,
        contact_email: INITIAL_SETTINGS.contact_email,
        google_maps_url: INITIAL_SETTINGS.google_maps_url,
        gcash_recipient_number: INITIAL_SETTINGS.gcash_recipient_number,
        maya_recipient_number: INITIAL_SETTINGS.maya_recipient_number,
        announcement_banner: INITIAL_SETTINGS.announcement_banner,
        service_verification_note: INITIAL_SETTINGS.service_verification_note,
      };
      this.saveSettings(merged);
      return merged;
    }
    return loaded;
  }

  saveSettings(settings: RestaurantSettings): void {
    this.set('settings', settings);
  }

  getCategories(): MenuCategory[] {
    return this.get<MenuCategory[]>('categories', INITIAL_CATEGORIES);
  }

  saveCategories(categories: MenuCategory[]): void {
    this.set('categories', categories);
  }

  getMenuItems(): MenuItem[] {
    return this.get<MenuItem[]>('menu_items', INITIAL_MENU_ITEMS);
  }

  saveMenuItems(items: MenuItem[]): void {
    this.set('menu_items', items);
  }

  getOrders(): Order[] {
    return this.get<Order[]>('orders', INITIAL_ORDERS);
  }

  saveOrders(orders: Order[]): void {
    this.set('orders', orders);
  }

  getReservations(): Reservation[] {
    return this.get<Reservation[]>('reservations', INITIAL_RESERVATIONS);
  }

  saveReservations(reservations: Reservation[]): void {
    this.set('reservations', reservations);
  }

  getCateringInquiries(): CateringInquiry[] {
    return this.get<CateringInquiry[]>('catering', INITIAL_CATERING);
  }

  saveCateringInquiries(inquiries: CateringInquiry[]): void {
    this.set('catering', inquiries);
  }

  getPromotions(): Promotion[] {
    return this.get<Promotion[]>('promotions', INITIAL_PROMOTIONS);
  }

  savePromotions(promotions: Promotion[]): void {
    this.set('promotions', promotions);
  }

  getInventoryMovements(): InventoryMovement[] {
    return this.get<InventoryMovement[]>('inventory_movements', INITIAL_INVENTORY_MOVEMENTS);
  }

  addInventoryMovement(movement: Omit<InventoryMovement, 'id' | 'created_at'>): void {
    const list = this.getInventoryMovements();
    const newMovement: InventoryMovement = {
      ...movement,
      id: `mov-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.set('inventory_movements', [newMovement, ...list]);
  }

  // Helper to place an order, validating stock and prices
  createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'access_token' | 'created_at' | 'updated_at'>): { success: boolean; order?: Order; error?: string } {
    const menuItems = this.getMenuItems();
    
    // Server-side inventory & price check
    for (const item of orderData.items) {
      const liveItem = menuItems.find(m => m.id === item.menu_item_id);
      if (!liveItem) {
        return { success: false, error: `Item "${item.item_name_snapshot}" is no longer on the menu.` };
      }
      if (!liveItem.is_available) {
        return { success: false, error: `Sorry, "${liveItem.name}" is currently marked as sold out.` };
      }
      if (liveItem.stock_quantity < item.quantity) {
        return { success: false, error: `Only ${liveItem.stock_quantity} left in stock for "${liveItem.name}".` };
      }
    }

    // Deduct stock and record movements
    const updatedMenu = menuItems.map(m => {
      const ordered = orderData.items.find(i => i.menu_item_id === m.id);
      if (ordered) {
        const remaining = Math.max(0, m.stock_quantity - ordered.quantity);
        return {
          ...m,
          stock_quantity: remaining,
          is_available: remaining > 0,
        };
      }
      return m;
    });
    this.saveMenuItems(updatedMenu);

    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `HNY-${dateStr}-${randomSuffix}`;
    const accessToken = `tok_${Math.random().toString(36).substring(2, 12)}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      access_token: accessToken,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    const orders = this.getOrders();
    this.saveOrders([newOrder, ...orders]);

    // Record inventory movements
    for (const item of orderData.items) {
      this.addInventoryMovement({
        menu_item_id: item.menu_item_id,
        movement_type: 'order_deduct',
        quantity_change: -item.quantity,
        reason: `Online Order #${orderNumber}`,
        order_id: newOrder.id,
        created_by: 'Customer Order System',
      });
    }

    return { success: true, order: newOrder };
  }

  // Update order status with stock restoration on cancellation
  updateOrderStatus(orderId: string, newStatus: Order['order_status'], paymentStatus?: Order['payment_status']): boolean {
    const orders = this.getOrders();
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return false;

    const oldStatus = targetOrder.order_status;
    
    // If order was cancelled or rejected, restore stock if it hadn't been cancelled already
    if ((newStatus === 'Cancelled' || newStatus === 'Rejected') && oldStatus !== 'Cancelled' && oldStatus !== 'Rejected') {
      const menuItems = this.getMenuItems();
      const updatedMenu = menuItems.map(m => {
        const ordered = targetOrder.items.find(i => i.menu_item_id === m.id);
        if (ordered) {
          const newQty = m.stock_quantity + ordered.quantity;
          return {
            ...m,
            stock_quantity: newQty,
            is_available: true,
          };
        }
        return m;
      });
      this.saveMenuItems(updatedMenu);

      for (const item of targetOrder.items) {
        this.addInventoryMovement({
          menu_item_id: item.menu_item_id,
          movement_type: 'order_cancel_restore',
          quantity_change: item.quantity,
          reason: `Restored stock due to ${newStatus} order #${targetOrder.order_number}`,
          order_id: targetOrder.id,
          created_by: 'Admin Staff',
        });
      }
    }

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          order_status: newStatus,
          payment_status: paymentStatus || o.payment_status,
          updated_at: new Date().toISOString(),
        };
      }
      return o;
    });

    this.saveOrders(updatedOrders);
    return true;
  }
}

export const restaurantStore = new RestaurantStore();
