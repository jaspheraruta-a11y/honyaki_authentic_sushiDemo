import React, { useState } from 'react';
import { CalendarCheck, Users, Clock, AlertCircle, CheckCircle2, Phone, Sparkles } from 'lucide-react';
import { RestaurantSettings, Reservation } from '../types';
import { restaurantStore } from '../lib/store';
import { useDemoMode } from '../context/DemoModeContext';

interface ReservationsPageProps {
  settings: RestaurantSettings;
  onNavigate: (route: string) => void;
}

export const ReservationsPage: React.FC<ReservationsPageProps> = ({
  settings,
  onNavigate,
}) => {
  const { isDemoMode, openDemoModal } = useDemoMode();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [startTime, setStartTime] = useState('18:00');
  const [guestCount, setGuestCount] = useState(2);
  const [occasion, setOccasion] = useState('Casual Dining');
  const [seatingPreference, setSeatingPreference] = useState('Main Hall Table');
  const [specialRequests, setSpecialRequests] = useState('');

  const [submittedReservation, setSubmittedReservation] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If reservations are disabled by staff
  if (!settings.reservations_enabled) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#1e1a18] border border-amber-900/40 flex items-center justify-center text-amber-400 mx-auto">
          <CalendarCheck className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-white">
          Direct Table Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
          Online table reservations are temporarily paused due to private events or kitchen capacity. Please contact us directly at <span className="text-amber-300 font-semibold">{settings.contact_phone}</span> or walk in at our 3rd Floor, ASV Townhouse, Sayre Highway, Brgy. Bagontaas location.
        </p>
        <button
          onClick={() => onNavigate('/contact')}
          className="mt-4 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-colors cursor-pointer"
        >
          Contact Restaurant Directly
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      const submitBtn = (e.target as HTMLElement).querySelector('button[type="submit"]') as HTMLElement | null;
      openDemoModal(submitBtn || (document.activeElement as HTMLElement | null));
      return;
    }
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setErrorMessage('Please provide a valid Philippine mobile number (e.g. 0917-xxx-xxxx).');
      return;
    }
    if (!reservationDate) {
      setErrorMessage('Please pick your requested dining date.');
      return;
    }

    // Check day of week: Mondays are closed
    const dateObj = new Date(reservationDate);
    if (dateObj.getDay() === 1) {
      setErrorMessage('Honyaki is closed on Mondays for kitchen maintenance. Please choose Tuesday through Sunday.');
      return;
    }

    if (guestCount > 20) {
      setErrorMessage('For large parties of more than 20 guests, please submit a Catering & Group Inquiry so our chef can accommodate your group properly.');
      return;
    }

    setIsSubmitting(true);

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim() || 'guest@honyakisushi.ph',
      customer_phone: customerPhone.trim(),
      reservation_date: reservationDate,
      start_time: startTime,
      guest_count: guestCount,
      special_requests: specialRequests.trim() || undefined,
      occasion: occasion,
      seating_preference: seatingPreference,
      reservation_status: 'Pending',
      staff_notes: 'Online request received. Awaiting host confirmation.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    restaurantStore.createReservation(newRes);

    try {
      const existing = JSON.parse(localStorage.getItem('honyaki_my_recent_reservations') || '[]');
      if (!existing.includes(newRes.id)) {
        localStorage.setItem('honyaki_my_recent_reservations', JSON.stringify([newRes.id, ...existing]));
      }
      localStorage.setItem('honyaki_customer_phone', customerPhone.trim());
    } catch (e) {}

    setIsSubmitting(false);
    setSubmittedReservation(newRes);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#b91c1c] font-semibold">
          <CalendarCheck className="w-4 h-4" />
          <span>Dining Table Inquiry</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
          Table Reservation Requests
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
          Reserve seating at our dining hall or sushi counter in Valencia City, Bukidnon. 
        </p>

        {/* Clear Policy Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-[#1c1817] border border-[#382b26] text-xs text-amber-200/90 text-left space-y-1">
          <div className="flex items-center gap-2 font-semibold text-amber-100">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Important Reservation Notice</span>
          </div>
          <p className="text-neutral-300 text-[11px] leading-relaxed">
            A reservation request is <strong>not a confirmed booking</strong> until our staff verifies seating capacity and calls or confirms with you. Walk-ins are always warmly welcomed subject to table availability.
          </p>
        </div>
      </div>

      {submittedReservation ? (
        <div className="p-8 rounded-2xl bg-[#141418] border border-emerald-900/50 shadow-2xl space-y-6 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-white">
              Reservation Request Received!
            </h2>
            <p className="text-xs text-neutral-300">
              Reference Code:{' '}
              <span className="font-mono text-amber-300 font-bold">
                {submittedReservation.id.toUpperCase()}
              </span>
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed pt-2">
              Thank you, <strong className="text-white">{submittedReservation.customer_name}</strong>. We have logged your request for a table of <strong className="text-white">{submittedReservation.guest_count} guests</strong> on <strong className="text-white">{submittedReservation.reservation_date}</strong> at <strong className="text-white">{submittedReservation.start_time}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#18181e] text-xs text-neutral-300 text-left space-y-1.5 border border-[#272730]">
            <p className="font-semibold text-white">Next Steps:</p>
            <p className="text-[11px] text-neutral-400">
              Our floor manager will review the seating ledger and contact your mobile ({submittedReservation.customer_phone}) to confirm your table.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('/menu')}
              className="flex-1 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-colors cursor-pointer"
            >
              Browse Menu Ahead of Time
            </button>
            <button
              onClick={() => setSubmittedReservation(null)}
              className="py-3 px-5 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-300 bg-[#1c1c24] hover:bg-[#252530] transition-colors cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#141418] border border-[#25252e] shadow-xl space-y-6">
          
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-600/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dra. Katrina Valeros"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Philippine Mobile Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0917-888-1234"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Requested Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Requested Time Slot <span className="text-red-400">*</span>
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-400"
              >
                <optgroup label="Lunch Service">
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="13:00">1:00 PM</option>
                </optgroup>
                <optgroup label="Dinner Service">
                  <option value="17:30">5:30 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="18:30">6:30 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="19:30">7:30 PM</option>
                  <option value="20:00">8:00 PM</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Number of Guests <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Occasion / Celebration
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-400"
              >
                <option value="Casual Dining">Casual Dining</option>
                <option value="Birthday Celebration">Birthday Celebration</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Business Dinner / Meeting">Business Dinner / Meeting</option>
                <option value="Family Gathering">Family Gathering</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Seating Preference
              </label>
              <select
                value={seatingPreference}
                onChange={(e) => setSeatingPreference(e.target.value)}
                className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-400"
              >
                <option value="Main Hall Table">Main Hall Table</option>
                <option value="Sushi Bar Counter">Sushi Bar Counter</option>
                <option value="Cozy Booth">Cozy Booth Area</option>
                <option value="No Preference">No Preference (First Available)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1.5">
              Special Requests (Allergies, high chair, cake arrival timing, etc.)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Shellfish allergy for 1 guest, requesting baby high chair."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
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
            {isSubmitting ? 'Transmitting Request...' : 'Submit Table Reservation Request'}
          </button>

          <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
            By submitting, our host team in Valencia City will review existing reservations and contact you promptly.
          </p>

        </form>
      )}

    </div>
  );
};
