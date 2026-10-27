import React, { useState } from 'react';
import { Users, CheckCircle2, AlertCircle, ArrowRight, Sparkles, UtensilsCrossed, Gift } from 'lucide-react';
import { CateringInquiry, RestaurantSettings } from '../types';
import { restaurantStore } from '../lib/store';
import { useDemoMode } from '../context/DemoModeContext';

interface CateringPageProps {
  settings: RestaurantSettings;
  onNavigate: (route: string) => void;
}

export const CateringPage: React.FC<CateringPageProps> = ({
  settings,
  onNavigate,
}) => {
  const { isDemoMode, openDemoModal } = useDemoMode();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [eventType, setEventType] = useState('Family / Group Gathering');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState(20);
  const [budgetRange, setBudgetRange] = useState('');
  const [requestedItems, setRequestedItems] = useState('');
  const [fulfillmentPreference, setFulfillmentPreference] = useState<'pickup' | 'delivery'>('delivery');
  const [eventLocation, setEventLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [submittedInquiry, setSubmittedInquiry] = useState<CateringInquiry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      const submitBtn = (e.target as HTMLElement).querySelector('button[type="submit"]') as HTMLElement | null;
      openDemoModal(submitBtn || (document.activeElement as HTMLElement | null));
      return;
    }
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please provide your name or organization.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setErrorMessage('Please provide a valid Philippine contact number.');
      return;
    }
    if (!eventDate) {
      setErrorMessage('Please specify your intended event date.');
      return;
    }
    if (!requestedItems.trim()) {
      setErrorMessage('Please tell us which platters or menu items you are interested in.');
      return;
    }

    setIsSubmitting(true);

    const newInquiry: CateringInquiry = {
      id: `cat-${Date.now()}`,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim() || 'catering.inquiry@honyakisushi.ph',
      customer_phone: customerPhone.trim(),
      event_type: eventType,
      event_date: eventDate,
      guest_count: guestCount,
      budget_range: budgetRange.trim() || undefined,
      requested_items: requestedItems.trim(),
      fulfillment_preference: fulfillmentPreference,
      event_location: fulfillmentPreference === 'delivery' ? eventLocation.trim() : 'Pickup at Sayre Highway Restaurant',
      inquiry_status: 'pending',
      notes: notes.trim() || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    restaurantStore.createCateringInquiry(newInquiry);

    try {
      const existing = JSON.parse(localStorage.getItem('honyaki_my_recent_catering') || '[]');
      if (!existing.includes(newInquiry.id)) {
        localStorage.setItem('honyaki_my_recent_catering', JSON.stringify([newInquiry.id, ...existing]));
      }
      localStorage.setItem('honyaki_customer_phone', customerPhone.trim());
    } catch (e) {}

    setIsSubmitting(false);
    setSubmittedInquiry(newInquiry);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#b91c1c] font-semibold">
          <Users className="w-4 h-4" />
          <span>Group Orders & Large Events</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
          Party Platters & Catering Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
          Elevate your family gatherings, corporate conferences, hospital staff celebrations, and birthdays in Valencia City with freshly crafted Japanese feasts.
        </p>

        {/* Clear Policy Notice */}
        <div className="p-4 rounded-xl bg-[#1c1817] border border-[#382b26] text-xs text-amber-200/90 text-left space-y-1">
          <div className="flex items-center gap-2 font-semibold text-amber-100">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Platter & Group Policy Notice</span>
          </div>
          <p className="text-neutral-300 text-[11px] leading-relaxed">
            Large platter orders and event catering are subject to raw ingredient availability and require at least 24–48 hours advance confirmation. Full-service off-premise banquet catering is subject to specific kitchen scheduling.
          </p>
        </div>
      </div>

      {/* Recommended Platter Packages Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4 hover:border-neutral-500 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#251819] text-[#b91c1c] flex items-center justify-center font-bold">
            40
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300">Popular Choice</span>
            <h3 className="font-serif text-lg font-bold text-white mt-1">Classic Platter (40 pcs)</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Dragon rolls, Salmon Aburi nigiri, California Crunch, and Spicy Tuna maki. Serves 4–6 persons.
            </p>
          </div>
          <div className="pt-2 border-t border-[#22222a] flex items-center justify-between text-xs">
            <span className="text-neutral-400">Starting Price:</span>
            <span className="font-mono font-bold text-amber-300">₱1,580</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#141418] border border-[#2e2620] space-y-4 hover:border-amber-600/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#281e14] text-amber-400 flex items-center justify-center font-bold">
            60
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300">VIP Celebration</span>
            <h3 className="font-serif text-lg font-bold text-white mt-1">Grand VIP Feast (60 pcs)</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Premium Atlantic salmon sashimi, unagi dragon rolls, tuna tartare, torched nigiri, and ebi rolls. Serves 8–10 persons.
            </p>
          </div>
          <div className="pt-2 border-t border-[#22222a] flex items-center justify-between text-xs">
            <span className="text-neutral-400">Starting Price:</span>
            <span className="font-mono font-bold text-amber-300">₱2,330</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#141418] border border-[#1b2520] space-y-4 hover:border-emerald-600/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#16241a] text-emerald-400 flex items-center justify-center font-bold">
            BOX
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300">Corporate & Meetings</span>
            <h3 className="font-serif text-lg font-bold text-white mt-1">Individual Bento Boxes</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Custom boxes with chicken teriyaki or beef gyudon, 4-piece sushi roll, gyoza, Japanese steamed rice, and salad.
            </p>
          </div>
          <div className="pt-2 border-t border-[#22222a] flex items-center justify-between text-xs">
            <span className="text-neutral-400">Per Pax Range:</span>
            <span className="font-mono font-bold text-emerald-300">₱280 – ₱380</span>
          </div>
        </div>

      </div>

      {submittedInquiry ? (
        <div className="p-8 rounded-2xl bg-[#141418] border border-emerald-900/50 shadow-2xl space-y-6 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-white">
              Catering Inquiry Submitted!
            </h2>
            <p className="text-xs text-neutral-300">
              Inquiry Ref:{' '}
              <span className="font-mono text-amber-300 font-bold">
                {submittedInquiry.id.toUpperCase()}
              </span>
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed pt-2">
              Thank you, <strong className="text-white">{submittedInquiry.customer_name}</strong>. Our culinary manager in Valencia City has received your inquiry for <strong className="text-white">{submittedInquiry.guest_count} guests</strong> on <strong className="text-white">{submittedInquiry.event_date}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#18181e] text-xs text-neutral-300 text-left space-y-1.5 border border-[#272730]">
            <p className="font-semibold text-white">Quotation Process:</p>
            <p className="text-[11px] text-neutral-400">
              We will evaluate the menu selection and prepare an official quotation with payment details. We will contact your mobile ({submittedInquiry.customer_phone}) within 24 hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('/menu')}
              className="flex-1 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-colors cursor-pointer"
            >
              Explore Standard Menu
            </button>
            <button
              onClick={() => setSubmittedInquiry(null)}
              className="py-3 px-5 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-300 bg-[#1c1c24] hover:bg-[#252530] transition-colors cursor-pointer"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#141418] border border-[#25252e] shadow-xl space-y-6">
          
          <div className="border-b border-[#242429] pb-4">
            <h2 className="font-serif text-xl font-bold text-white">
              Submit a Group Order or Catering Inquiry
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Provide event details below and our team will get in touch with an itemized quote.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-600/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Contact Person / Organization <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bukidnon State University Alumni / Maria Santos"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Philippine Mobile Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0917-888-9999"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Event / Occasion Type <span className="text-red-400">*</span>
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-400"
              >
                <option value="Birthday Celebration">Birthday Celebration</option>
                <option value="Corporate / Office Lunch">Corporate / Office Lunch</option>
                <option value="Hospital Staff Function">Hospital Staff Function</option>
                <option value="Family Reunion">Family Reunion</option>
                <option value="Wedding / Milestone Reception">Wedding / Milestone Reception</option>
                <option value="Other Group Gathering">Other Group Gathering</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Event Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Estimated Headcount <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 10)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Target Budget Range (Optional)
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-400"
              >
                <option value="₱3,000 – ₱5,000">₱3,000 – ₱5,000 (Small Platter Set)</option>
                <option value="₱5,000 – ₱10,000">₱5,000 – ₱10,000</option>
                <option value="₱10,000 – ₱20,000">₱10,000 – ₱20,000</option>
                <option value="₱20,000+">₱20,000+ (Large Event)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Fulfillment Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFulfillmentPreference('delivery')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                    fulfillmentPreference === 'delivery'
                      ? 'bg-[#221718] border-[#991b1b] text-white'
                      : 'bg-[#1b1b22] border-[#2a2a35] text-neutral-400'
                  }`}
                >
                  Venue Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentPreference('pickup')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                    fulfillmentPreference === 'pickup'
                      ? 'bg-[#221718] border-[#991b1b] text-white'
                      : 'bg-[#1b1b22] border-[#2a2a35] text-neutral-400'
                  }`}
                >
                  Pickup at Store
                </button>
              </div>
            </div>
          </div>

          {fulfillmentPreference === 'delivery' && (
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Event Venue / Address in Valencia City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Function Hall, Hotel Valencia or Barangay Lumbo Private Residence"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1.5">
              Requested Dishes, Platters or Dietary Preferences <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. 2x Grand Celebration Platters (40 pcs), 10 orders of Tonkotsu Ramen, 15 individual Chicken Teriyaki Bento boxes. Any cooked-only sushi for pregnant guests."
              value={requestedItems}
              onChange={(e) => setRequestedItems(e.target.value)}
              className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1.5">
              Additional Requirements or Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Need official receipt for company accounting, or specific delivery window."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            onClick={(e) => {
              if (isDemoMode) {
                e.preventDefault();
                openDemoModal(e.currentTarget);
              }
            }}
            className="w-full py-4 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-all shadow-lg shadow-red-950/40 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting Inquiry...' : 'Submit Catering Inquiry for Quotation'}
          </button>

        </form>
      )}

    </div>
  );
};
