import React, { useState } from 'react';
import { Search, ShoppingBag, CalendarCheck, Users, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { Order, Reservation, CateringInquiry } from '../types';
import { restaurantStore } from '../lib/store';

interface CustomerAccountPageProps {
  onNavigate: (route: string) => void;
}

export const CustomerAccountPage: React.FC<CustomerAccountPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'catering'>('orders');
  const [lookupQuery, setLookupQuery] = useState('');

  const allOrders = restaurantStore.getOrders();
  const allReservations = restaurantStore.getReservations();
  const allCatering = restaurantStore.getCateringInquiries();

  const filteredOrders = allOrders.filter((o) => {
    if (!lookupQuery.trim()) return true;
    const q = lookupQuery.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.customer_phone.includes(q) ||
      o.customer_name.toLowerCase().includes(q)
    );
  });

  const filteredReservations = allReservations.filter((r) => {
    if (!lookupQuery.trim()) return true;
    const q = lookupQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.customer_phone.includes(q) ||
      r.customer_name.toLowerCase().includes(q)
    );
  });

  const filteredCatering = allCatering.filter((c) => {
    if (!lookupQuery.trim()) return true;
    const q = lookupQuery.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.customer_phone.includes(q) ||
      c.customer_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="space-y-1.5 sm:space-y-2">
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-wide">
          Guest Order & Request Lookup
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Search your recent orders, table booking requests, and catering inquiries using your phone number or reference code.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by Order Number, Phone Number, or Name..."
          value={lookupQuery}
          onChange={(e) => setLookupQuery(e.target.value)}
          className="w-full bg-[#141418] border border-[#25252e] rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400 min-h-[42px]"
        />
      </div>

      {/* Tabs with horizontal scroll guard */}
      <div className="flex items-center gap-2 border-b border-[#242429] pb-2 text-xs overflow-x-auto scrollbar-none -mx-1 px-1">
        <button
          onClick={() => setActiveTab('orders')}
          className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 min-h-[40px] whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#991b1b] text-white'
              : 'text-neutral-400 hover:text-white hover:bg-[#181820]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Orders ({filteredOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 min-h-[40px] whitespace-nowrap ${
            activeTab === 'reservations'
              ? 'bg-[#991b1b] text-white'
              : 'text-neutral-400 hover:text-white hover:bg-[#181820]'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Reservations ({filteredReservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catering')}
          className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2 min-h-[40px] whitespace-nowrap ${
            activeTab === 'catering'
              ? 'bg-[#991b1b] text-white'
              : 'text-neutral-400 hover:text-white hover:bg-[#181820]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Catering Inquiries ({filteredCatering.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'orders' && (
          filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-[#141418] rounded-2xl border border-[#24242c] space-y-2">
              <p className="font-serif text-lg text-white">No orders found</p>
              <p className="text-xs text-neutral-400">Place an order from our digital menu to track it here.</p>
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => onNavigate(`/order/${ord.order_number}`)}
                className="p-5 rounded-2xl bg-[#141418] border border-[#25252e] hover:border-neutral-500 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">
                      #{ord.order_number}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#1e1e26] text-amber-300">
                      {ord.order_status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {ord.customer_name} · {ord.fulfillment_type.replace('_', ' ')} · {ord.items.length} items
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {new Date(ord.created_at).toLocaleDateString()} at{' '}
                    {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-[#22222a] pt-3 sm:pt-0">
                  <span className="font-mono font-bold text-amber-300 text-sm tabular-nums">
                    ₱{ord.total_amount.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-neutral-300 group-hover:text-white">
                    <span>Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )
        )}

        {activeTab === 'reservations' && (
          filteredReservations.length === 0 ? (
            <div className="p-12 text-center bg-[#141418] rounded-2xl border border-[#24242c] space-y-2">
              <p className="font-serif text-lg text-white">No reservations found</p>
              <p className="text-xs text-neutral-400">Submit a table request from our reservations page.</p>
            </div>
          ) : (
            filteredReservations.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-[#141418] border border-[#25252e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white text-xs font-bold">{res.id.toUpperCase()}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      res.reservation_status === 'Confirmed'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/30'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-600/30'
                    }`}>
                      {res.reservation_status}
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium">
                    {res.customer_name} ({res.guest_count} guests)
                  </p>
                  <p className="text-xs text-neutral-400">
                    Date: <span className="text-amber-200">{res.reservation_date}</span> at {res.start_time} · {res.seating_preference}
                  </p>
                </div>

                <div className="text-xs text-neutral-400">
                  <span>Contact: {res.customer_phone}</span>
                </div>
              </div>
            ))
          )
        )}

        {activeTab === 'catering' && (
          filteredCatering.length === 0 ? (
            <div className="p-12 text-center bg-[#141418] rounded-2xl border border-[#24242c] space-y-2">
              <p className="font-serif text-lg text-white">No catering inquiries found</p>
              <p className="text-xs text-neutral-400">Request a party platter quotation from our catering page.</p>
            </div>
          ) : (
            filteredCatering.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-[#141418] border border-[#25252e] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white text-xs font-bold">{cat.id.toUpperCase()}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-600/30 capitalize">
                      {cat.inquiry_status}
                    </span>
                  </div>
                  {cat.quotation_amount && (
                    <span className="font-mono text-amber-300 font-bold text-xs">
                      Quoted: ₱{cat.quotation_amount.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-xs text-white font-semibold">{cat.customer_name} — {cat.event_type}</p>
                <p className="text-xs text-neutral-400">
                  Target Date: {cat.event_date} · {cat.guest_count} Guests · {cat.requested_items}
                </p>
              </div>
            ))
          )
        )}
      </div>

    </div>
  );
};
