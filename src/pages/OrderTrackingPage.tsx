import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, RestaurantSettings } from '../types';
import { restaurantStore } from '../lib/store';
import { CheckCircle2, Clock, Truck, UtensilsCrossed, AlertTriangle, ArrowLeft, Printer, RefreshCw, Phone, ShieldCheck } from 'lucide-react';

interface OrderTrackingPageProps {
  orderNumber: string;
  onNavigate: (route: string) => void;
  settings: RestaurantSettings;
}

const STAGES: OrderStatus[] = [
  'Pending Confirmation',
  'Confirmed',
  'Preparing',
  'Ready for Pickup',
  'Completed',
];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orderNumber,
  onNavigate,
  settings,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [refSaved, setRefSaved] = useState(false);

  const fetchOrder = () => {
    setIsRefreshing(true);
    const orders = restaurantStore.getOrders();
    const found = orders.find((o) => o.order_number.toLowerCase() === orderNumber.toLowerCase());
    setOrder(found || null);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-white">Order Not Found</h2>
        <p className="text-xs text-neutral-400">
          No order matches reference number <span className="text-amber-300 font-mono">{orderNumber}</span>.
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

  const isCancelled = order.order_status === 'Cancelled' || order.order_status === 'Rejected';

  const getStageIndex = (status: OrderStatus) => {
    if (status === 'Out for Delivery') return 3;
    const idx = STAGES.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const currentStageIdx = getStageIndex(order.order_status);

  const handleSavePaymentRef = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentReference.trim()) return;
    setRefSaved(true);
    setTimeout(() => setRefSaved(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Top action strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('/menu')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer py-1 min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrder}
            disabled={isRefreshing}
            className="flex-1 sm:flex-none justify-center px-3 py-2 rounded-lg bg-[#18181f] border border-[#2a2a35] text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh Status</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none justify-center px-3 py-2 rounded-lg bg-[#18181f] border border-[#2a2a35] text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 cursor-pointer print:hidden min-h-[40px]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Main Order Status Card */}
      <div className="p-4 sm:p-8 rounded-2xl bg-[#141418] border border-[#25252e] shadow-xl space-y-6">
        
        {/* Header with Order Number and Timestamp */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242429] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#b91c1c] font-semibold">
                Live Kitchen Tracker
              </span>
              <span>·</span>
              <span className="text-xs text-neutral-400">Valencia City</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide mt-1">
              Order #{order.order_number}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
              {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-neutral-400 block">Total Amount</span>
            <span className="font-mono text-2xl font-bold text-amber-300 tabular-nums">
              ₱{order.total_amount.toLocaleString()}
            </span>
            <span className="text-[11px] block text-neutral-400 capitalize mt-0.5">
              Payment: {order.payment_method.toUpperCase()} ({order.payment_status})
            </span>
          </div>
        </div>

        {/* Progress Bar (if not cancelled) */}
        {isCancelled ? (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-600/40 text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
            <div>
              <p className="font-semibold text-sm">Order Status: {order.order_status}</p>
              <p className="text-neutral-400 mt-0.5">
                This order has been {order.order_status.toLowerCase()} by the kitchen staff or customer. Any pre-authorized inventory has been restored.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-amber-300">
                Current Status: {order.order_status}
              </span>
              <span className="text-neutral-400">
                Estimated Prep: ~{settings.prep_time_minutes} mins
              </span>
            </div>

            {/* Mobile Vertical Stepper (< sm) */}
            <div className="sm:hidden space-y-2 pt-1">
              {[
                { label: 'Received', key: 'Pending Confirmation', desc: 'Order received by restaurant system' },
                { label: 'Confirmed', key: 'Confirmed', desc: 'Verified and queued in kitchen' },
                { label: 'Kitchen Preparing', key: 'Preparing', desc: 'Chef handcrafting sushi and dishes' },
                {
                  label:
                    order.fulfillment_type === 'delivery'
                      ? 'Out for Delivery'
                      : order.fulfillment_type === 'pickup'
                      ? 'Ready for Pickup'
                      : 'Serving Table',
                  key: 'Ready for Pickup',
                  desc:
                    order.fulfillment_type === 'delivery'
                      ? 'Rider dispatched to Valencia City address'
                      : order.fulfillment_type === 'pickup'
                      ? 'Available at ASV Townhouse counter'
                      : 'Brought fresh to your dining table',
                },
                { label: 'Completed', key: 'Completed', desc: 'Order fulfilled and settled' },
              ].map((step, idx) => {
                const isPassed = currentStageIdx >= idx;
                const isCurrent = currentStageIdx === idx;
                return (
                  <div
                    key={step.label}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      isCurrent
                        ? 'bg-[#221819] border-[#991b1b] text-white shadow-sm'
                        : isPassed
                        ? 'bg-[#181f1b] border-emerald-900/40 text-emerald-300'
                        : 'bg-[#16161b] border-[#25252e] text-neutral-500'
                    }`}
                  >
                    <div className="shrink-0">
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-neutral-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold block leading-tight">
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#991b1b] text-white">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop & Tablet 5-Column Grid (sm+) */}
            <div className="hidden sm:grid sm:grid-cols-5 gap-2 pt-2">
              {[
                { label: 'Received', key: 'Pending Confirmation' },
                { label: 'Confirmed', key: 'Confirmed' },
                { label: 'Kitchen Preparing', key: 'Preparing' },
                {
                  label:
                    order.fulfillment_type === 'delivery'
                      ? 'Out for Delivery'
                      : order.fulfillment_type === 'pickup'
                      ? 'Ready for Pickup'
                      : 'Serving Table',
                  key: 'Ready for Pickup',
                },
                { label: 'Completed', key: 'Completed' },
              ].map((step, idx) => {
                const isPassed = currentStageIdx >= idx;
                const isCurrent = currentStageIdx === idx;
                return (
                  <div
                    key={step.label}
                    className={`p-3 rounded-xl border text-center transition-colors ${
                      isCurrent
                        ? 'bg-[#221819] border-[#991b1b] text-white shadow-sm'
                        : isPassed
                        ? 'bg-[#181f1b] border-emerald-900/40 text-emerald-300'
                        : 'bg-[#16161b] border-[#25252e] text-neutral-500'
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-neutral-500" />
                      )}
                    </div>
                    <span className="text-[11px] font-medium block leading-tight">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fulfillment & Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#22222a]">
          
          <div className="space-y-3 text-xs">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Fulfillment Info
            </h3>
            <div className="space-y-1.5 text-neutral-300">
              <p>
                <span className="text-neutral-400">Method:</span>{' '}
                <span className="font-semibold text-white capitalize">{order.fulfillment_type.replace('_', ' ')}</span>
              </p>
              {order.fulfillment_type === 'delivery' && (
                <>
                  <p>
                    <span className="text-neutral-400">Delivery Address:</span>{' '}
                    <span>{order.delivery_address}</span>
                  </p>
                  {order.delivery_instructions && (
                    <p>
                      <span className="text-neutral-400">Instructions:</span>{' '}
                      <span>{order.delivery_instructions}</span>
                    </p>
                  )}
                </>
              )}
              {order.fulfillment_type === 'pickup' && (
                <p>
                  <span className="text-neutral-400">Pickup Slot:</span>{' '}
                  <span className="text-white">{order.pickup_time || 'Ready in ~25 mins'}</span>
                </p>
              )}
              {order.fulfillment_type === 'dine_in' && (
                <p>
                  <span className="text-neutral-400">Table / Seating:</span>{' '}
                  <span className="text-white font-semibold">{order.table_number || 'Dining Hall'}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Customer Info
            </h3>
            <div className="space-y-1.5 text-neutral-300">
              <p>
                <span className="text-neutral-400">Customer Name:</span>{' '}
                <span className="text-white">{order.customer_name}</span>
              </p>
              <p>
                <span className="text-neutral-400">Contact Phone:</span>{' '}
                <span className="text-white font-mono">{order.customer_phone}</span>
              </p>
              {order.notes && (
                <p>
                  <span className="text-neutral-400">Kitchen Note:</span>{' '}
                  <span className="italic">{order.notes}</span>
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Itemized Receipt Breakdown (Historical snapshot preserving prices) */}
        <div className="pt-4 border-t border-[#22222a] space-y-4">
          <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
            Order Items Snapshot
          </h3>

          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 p-3 rounded-xl bg-[#17171d] border border-[#24242c] text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-400 tabular-nums">
                      {item.quantity}×
                    </span>
                    <span className="font-semibold text-white">
                      {item.item_name_snapshot}
                    </span>
                  </div>

                  {item.selected_variants && item.selected_variants.length > 0 && (
                    <p className="text-[11px] text-amber-200/80 ml-5 mt-0.5">
                      {item.selected_variants.map((v) => v.name).join(', ')}
                    </p>
                  )}

                  {item.selected_addons && item.selected_addons.length > 0 && (
                    <p className="text-[10px] text-neutral-400 ml-5">
                      + {item.selected_addons.map((a) => a.name).join(', ')}
                    </p>
                  )}
                </div>

                <span className="font-mono font-semibold text-amber-300 tabular-nums">
                  ₱{item.line_total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="p-4 rounded-xl bg-[#101013] border border-[#222228] space-y-2 text-xs text-neutral-300 max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white tabular-nums">₱{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Voucher Discount</span>
                <span className="font-mono tabular-nums">-₱{order.discount_amount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Fulfillment Fee</span>
              <span className="font-mono text-white tabular-nums">₱{order.delivery_fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-[#22222a] text-sm font-bold text-white">
              <span>Total Paid / Due</span>
              <span className="font-mono text-amber-300 text-base tabular-nums">
                ₱{order.total_amount.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* GCash / Maya Reference Input Form */}
        {(order.payment_method === 'gcash' || order.payment_method === 'maya') && (
          <div className="p-4 rounded-xl bg-[#17171d] border border-[#282832] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">
                {order.payment_method.toUpperCase()} Payment Reference
              </span>
              <span className="text-[10px] text-neutral-400">
                {settings.gcash_recipient_name} · {settings.gcash_recipient_number}
              </span>
            </div>
            
            <form onSubmit={handleSavePaymentRef} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 13-digit GCash/Maya reference number"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="flex-1 bg-[#121215] border border-[#2e2e38] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#991b1b] hover:bg-[#b91c1c] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Save Reference
              </button>
            </form>

            {refSaved && (
              <p className="text-[11px] text-emerald-400">
                Reference saved! Kitchen cashier will verify against account balance.
              </p>
            )}
          </div>
        )}

        {/* Help / Contact Support Strip */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Need to modify order or question? Call <strong className="text-white font-mono">{settings.contact_phone}</strong></span>
          </div>
          <a
            href={settings.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-amber-300 hover:text-white transition-colors"
          >
            3rd Floor, ASV Townhouse, Sayre Hwy, Brgy. Bagontaas (Map) →
          </a>
        </div>

      </div>

    </div>
  );
};
