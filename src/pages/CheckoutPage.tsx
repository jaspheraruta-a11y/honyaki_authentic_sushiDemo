import React, { useState } from 'react';
import { CartItem, FulfillmentType, PaymentMethod, Promotion, RestaurantSettings, Order } from '../types';
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, MapPin, UtensilsCrossed, Truck, ShieldCheck, Tag } from 'lucide-react';
import { restaurantStore } from '../lib/store';
import { useDemoMode } from '../context/DemoModeContext';

interface CheckoutPageProps {
  cartItems: CartItem[];
  appliedPromo: Promotion | null;
  settings: RestaurantSettings;
  onClearCart: () => void;
  onOrderCompleted: (order: Order) => void;
  onNavigate: (route: string) => void;
}

const VALENCIA_BARANGAYS = [
  'Poblacion',
  'Bagontaas',
  'Batangan',
  'Catumbalon',
  'Colonia',
  'Concepcion',
  'Dagat-Kidavao',
  'Guinuyoran',
  'Kahaponan',
  'Laligan',
  'Lilingayon',
  'Lourdes',
  'Lumbo',
  'Mabuhay',
  'Mailag',
  'Mt. Nebo',
  'Nabag-o',
  'Pinatilan',
  'San Carlos',
  'San Isidro',
  'Sinabuagan',
  'Sinayawan',
  'Sugod',
  'Tongantongan',
  'Tugaya',
  'Vintar',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  appliedPromo,
  settings,
  onClearCart,
  onOrderCompleted,
  onNavigate,
}) => {
  const { isDemoMode, openDemoModal } = useDemoMode();
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('delivery');
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  // Fulfillment specific fields
  const [tableNumber, setTableNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('As soon as ready (~25 mins)');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryBarangay, setDeliveryBarangay] = useState('Bagontaas');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [orderNotes, setOrderNotes] = useState('');
  
  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Subtotal Calculation
  const subtotal = cartItems.reduce((sum, item) => {
    const basePrice = item.menuItem.price + item.selectedVariants.reduce((vSum, v) => vSum + v.price_adjustment, 0);
    const addonsPrice = item.selectedAddons.reduce((aSum, a) => aSum + a.price, 0);
    return sum + (basePrice + addonsPrice) * item.quantity;
  }, 0);

  // Promo discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discount_type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedPromo.discount_value) / 100);
    } else {
      discountAmount = Math.min(subtotal, appliedPromo.discount_value);
    }
  }

  // Delivery fee (only if fulfillment is delivery)
  let deliveryFee = 0;
  if (fulfillment === 'delivery') {
    deliveryFee = subtotal >= settings.free_delivery_threshold ? 0 : settings.delivery_fee_base;
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-white">Your Order is Empty</h2>
        <p className="text-xs text-neutral-400">
          Please add delicious sushi, ramen, or platters to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('/menu')}
          className="px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-colors cursor-pointer"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      const submitBtn = (e.target as HTMLElement).querySelector('button[type="submit"]') as HTMLElement | null;
      openDemoModal(submitBtn || (document.activeElement as HTMLElement | null));
      return;
    }
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setErrorMessage('Please enter a valid Philippine mobile phone number (e.g., 0917-xxx-xxxx).');
      return;
    }

    if (fulfillment === 'dine_in' && !tableNumber.trim()) {
      setErrorMessage('Please specify your table number or dining section.');
      return;
    }

    if (fulfillment === 'delivery' && !deliveryStreet.trim()) {
      setErrorMessage('Please enter your specific street address, house/building number.');
      return;
    }

    setIsSubmitting(true);

    // Prepare order snapshot items
    const snapshotItems = cartItems.map((item, idx) => {
      const basePrice = item.menuItem.price + item.selectedVariants.reduce((vSum, v) => vSum + v.price_adjustment, 0);
      const addonsPrice = item.selectedAddons.reduce((aSum, a) => aSum + a.price, 0);
      const lineTotal = (basePrice + addonsPrice) * item.quantity;

      return {
        id: `item-${Date.now()}-${idx}`,
        order_id: '',
        menu_item_id: item.menuItem.id,
        item_name_snapshot: item.menuItem.name,
        unit_price_snapshot: basePrice + addonsPrice,
        quantity: item.quantity,
        selected_variants: item.selectedVariants,
        selected_addons: item.selectedAddons,
        line_total: lineTotal,
      };
    });

    const newOrderData = {
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim() || 'guest@honyakisushi.ph',
      customer_phone: customerPhone.trim(),
      fulfillment_type: fulfillment,
      delivery_address: fulfillment === 'delivery' ? `${deliveryStreet.trim()}, Brgy. ${deliveryBarangay}, Valencia City, Bukidnon` : undefined,
      delivery_barangay: fulfillment === 'delivery' ? deliveryBarangay : undefined,
      delivery_instructions: fulfillment === 'delivery' ? deliveryNotes.trim() : undefined,
      table_number: fulfillment === 'dine_in' ? tableNumber.trim() : undefined,
      pickup_time: fulfillment === 'pickup' ? pickupTime : undefined,
      subtotal: subtotal,
      discount_amount: discountAmount,
      delivery_fee: deliveryFee,
      total_amount: finalTotal,
      payment_method: paymentMethod,
      payment_status: (paymentMethod === 'gcash' || paymentMethod === 'maya' ? 'pending' : 'pending') as any,
      order_status: 'Pending Confirmation' as any,
      notes: orderNotes.trim() || undefined,
      items: snapshotItems,
    };

    // Store & server-side validation call
    const result = restaurantStore.createOrder(newOrderData);

    setIsSubmitting(false);

    if (result.success && result.order) {
      try {
        const existing = JSON.parse(localStorage.getItem('honyaki_my_recent_orders') || '[]');
        if (!existing.includes(result.order.order_number)) {
          localStorage.setItem('honyaki_my_recent_orders', JSON.stringify([result.order.order_number, ...existing]));
        }
        localStorage.setItem('honyaki_customer_phone', customerPhone.trim());
      } catch (e) {}
      onClearCart();
      onOrderCompleted(result.order);
      onNavigate(`/order/${result.order.order_number}`);
    } else {
      setErrorMessage(result.error || 'Failed to submit order. Please check item stock.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back to Menu */}
      <button
        onClick={() => onNavigate('/menu')}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Menu</span>
      </button>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
          Complete Your Order
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Review your dining items, select fulfillment, and choose your preferred payment option.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-600/40 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Fulfillment, Contact & Payment */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Step 1: Fulfillment Type */}
          <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4">
            <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#991b1b] text-white text-xs flex items-center justify-center font-sans font-bold">1</span>
              <span>Fulfillment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFulfillment('delivery')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  fulfillment === 'delivery'
                    ? 'bg-[#221718] border-[#991b1b] text-white shadow-md'
                    : 'bg-[#18181f] border-[#292934] text-neutral-300 hover:border-neutral-500'
                }`}
              >
                <Truck className="w-5 h-5 text-sky-400" />
                <div>
                  <span className="font-semibold text-xs block">Valencia Delivery</span>
                  <span className="text-[11px] text-neutral-400 block mt-0.5">
                    {subtotal >= settings.free_delivery_threshold ? 'Free Delivery' : `₱${settings.delivery_fee_base} fee`}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillment('pickup')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  fulfillment === 'pickup'
                    ? 'bg-[#221718] border-[#991b1b] text-white shadow-md'
                    : 'bg-[#18181f] border-[#292934] text-neutral-300 hover:border-neutral-500'
                }`}
              >
                <Clock className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="font-semibold text-xs block">Takeout / Pickup</span>
                  <span className="text-[11px] text-neutral-400 block mt-0.5">Ready in ~25 mins</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillment('dine_in')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  fulfillment === 'dine_in'
                    ? 'bg-[#221718] border-[#991b1b] text-white shadow-md'
                    : 'bg-[#18181f] border-[#292934] text-neutral-300 hover:border-neutral-500'
                }`}
              >
                <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="font-semibold text-xs block">Dine-In Table</span>
                  <span className="text-[11px] text-neutral-400 block mt-0.5">Served at table</span>
                </div>
              </button>
            </div>

            {/* Delivery Details */}
            {fulfillment === 'delivery' && (
              <div className="pt-4 border-t border-[#22222b] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Barangay (Valencia City)</label>
                    <select
                      value={deliveryBarangay}
                      onChange={(e) => setDeliveryBarangay(e.target.value)}
                      className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-400"
                    >
                      {VALENCIA_BARANGAYS.map((b) => (
                        <option key={b} value={b}>
                          Brgy. {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">City & Province</label>
                    <input
                      type="text"
                      disabled
                      value="Valencia City, Bukidnon"
                      className="w-full bg-[#141418] border border-[#2a2a35] rounded-xl px-3 py-2.5 text-xs text-neutral-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">
                    Street Address / House / Building No. <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Door 2, San Agustin St, near City Hall"
                    value={deliveryStreet}
                    onChange={(e) => setDeliveryStreet(e.target.value)}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">
                    Rider Delivery Notes / Landmarks (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Green gate, please ring bell or call upon arrival"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>
            )}

            {/* Pickup Details */}
            {fulfillment === 'pickup' && (
              <div className="pt-4 border-t border-[#22222b] space-y-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Estimated Pickup Time</label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-400"
                  >
                    <option value="As soon as ready (~25 mins)">As soon as ready (~25 mins)</option>
                    <option value="In 45 minutes">In 45 minutes</option>
                    <option value="In 1 hour">In 1 hour</option>
                    <option value="In 1.5 hours">In 1.5 hours</option>
                    <option value="Dinner Time (6:00 PM)">Dinner Time (6:00 PM)</option>
                    <option value="Dinner Time (7:00 PM)">Dinner Time (7:00 PM)</option>
                  </select>
                </div>
                <div className="flex items-start justify-between gap-2 text-xs text-neutral-400">
                  <p>
                    Pickup counter: <span className="text-white">3rd Floor, ASV Townhouse, Sayre Highway, Barangay Bagontaas, Valencia City</span>.
                  </p>
                  <a
                    href={settings.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:underline shrink-0"
                  >
                    View Map →
                  </a>
                </div>
              </div>
            )}

            {/* Dine-in Details */}
            {fulfillment === 'dine_in' && (
              <div className="pt-4 border-t border-[#22222b] space-y-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">
                    Table Number or Dining Booth <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Table 4 or Sushi Counter Seat 2"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
                  />
                </div>
                <p className="text-xs text-neutral-400">
                  Staff will prepare and deliver dishes directly to your table once confirmed.
                </p>
              </div>
            )}

          </div>

          {/* Step 2: Contact Information */}
          <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4">
            <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#991b1b] text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
              <span>Customer Contact Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan dela Cruz"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">
                  Mobile Number (Philippines) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0917-123-4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Email Address (For digital receipt & order link)
              </label>
              <input
                type="email"
                placeholder="e.g. juan@gmail.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Special Kitchen Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. No wasabi on nigiri, extra pickled ginger on the side"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4">
            <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#991b1b] text-white text-xs flex items-center justify-center font-sans font-bold">3</span>
              <span>Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <button
                type="button"
                onClick={() => setPaymentMethod('gcash')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'gcash'
                    ? 'bg-[#15202b] border-blue-500 text-white shadow-md'
                    : 'bg-[#18181f] border-[#292934] text-neutral-300 hover:border-neutral-500'
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-blue-400 block">GCash Express</span>
                  <span className="text-[11px] text-neutral-400 block mt-1">Mobile e-wallet transfer</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium mt-3">● Instant confirmation</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('maya')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'maya'
                    ? 'bg-[#15261f] border-emerald-500 text-white shadow-md'
                    : 'bg-[#18181f] border-[#292934] text-neutral-300 hover:border-neutral-500'
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-emerald-400 block">Maya Wallet</span>
                  <span className="text-[11px] text-neutral-400 block mt-1">Maya QR & transfer</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium mt-3">● Supported</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'cash'
                    ? 'bg-[#241f17] border-amber-500 text-white shadow-md'
                    : 'bg-[#18181f] border-[#292934] text-neutral-300 hover:border-neutral-500'
                }`}
              >
                <div>
                  <span className="font-bold text-xs text-amber-400 block">
                    {fulfillment === 'delivery' ? 'Cash on Delivery (COD)' : 'Cash at Counter'}
                  </span>
                  <span className="text-[11px] text-neutral-400 block mt-1">Pay upon receiving</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium mt-3">Exact change appreciated</span>
              </button>

            </div>

            {/* GCash / Maya instructions preview */}
            {(paymentMethod === 'gcash' || paymentMethod === 'maya') && (
              <div className="p-3.5 rounded-xl bg-[#1b1b22] border border-[#2a2a35] text-xs text-neutral-300 space-y-1.5">
                <p className="font-semibold text-white">
                  {paymentMethod === 'gcash' ? 'Official GCash Payment Details:' : 'Official Maya Details:'}
                </p>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Recipient Name:</span>
                  <span className="font-mono text-white font-semibold">{settings.gcash_recipient_name}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Mobile Account:</span>
                  <span className="font-mono text-amber-300 font-bold">{settings.gcash_recipient_number}</span>
                </div>
                <p className="text-[11px] text-neutral-400 pt-1">
                  Once your order is submitted, you can upload or note your GCash reference number on the tracking screen.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Order Summary & Confirmation Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-5 sticky top-28 shadow-xl">
            
            <h2 className="font-serif text-lg font-bold text-white border-b border-[#242429] pb-3">
              Order Summary
            </h2>

            {/* Items review */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item, idx) => {
                const basePrice = item.menuItem.price + item.selectedVariants.reduce((vSum, v) => vSum + v.price_adjustment, 0);
                const addonsPrice = item.selectedAddons.reduce((aSum, a) => aSum + a.price, 0);
                const lineTotal = (basePrice + addonsPrice) * item.quantity;

                return (
                  <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-bold text-neutral-400 tabular-nums">
                          {item.quantity}×
                        </span>
                        <span className="font-semibold text-white">
                          {item.menuItem.name}
                        </span>
                      </div>
                      {item.selectedVariants.length > 0 && (
                        <p className="text-[11px] text-amber-200/80 ml-5">
                          {item.selectedVariants.map((v) => v.name).join(', ')}
                        </p>
                      )}
                      {item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-neutral-400 ml-5">
                          + {item.selectedAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-medium text-amber-300 tabular-nums">
                      ₱{lineTotal.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculation Lines */}
            <div className="space-y-2 pt-4 border-t border-[#22222a] text-xs text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white tabular-nums">₱{subtotal.toLocaleString()}</span>
              </div>
              
              {appliedPromo && (
                <div className="flex justify-between text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Voucher ({appliedPromo.code})
                  </span>
                  <span className="font-mono tabular-nums">-₱{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Fulfillment ({fulfillment === 'delivery' ? 'Delivery Fee' : fulfillment === 'pickup' ? 'Pickup' : 'Dine-In'})</span>
                <span className="font-mono tabular-nums">
                  {fulfillment === 'delivery'
                    ? deliveryFee === 0
                      ? 'FREE (Over ₱1,500)'
                      : `₱${deliveryFee}`
                    : '₱0'}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-[#22222a] text-base font-bold text-white">
                <span>Final Total</span>
                <span className="font-mono text-xl text-amber-300 tabular-nums">
                  ₱{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={(e) => {
                if (isDemoMode) {
                  e.preventDefault();
                  openDemoModal(e.currentTarget);
                }
              }}
              className="w-full py-4 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit & Place Order</span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">₱{finalTotal.toLocaleString()}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
              By submitting, your order is logged directly into our kitchen queue. You will receive an instant order reference code to track live preparation and dispatch.
            </p>

          </div>
        </div>

      </form>

    </div>
  );
};
