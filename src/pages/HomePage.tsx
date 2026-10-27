import React from 'react';
import { ArrowRight, Clock, MapPin, Sparkles, UtensilsCrossed, Truck, Users, CalendarCheck, ShieldCheck } from 'lucide-react';
import { MenuItem, RestaurantSettings } from '../types';

interface HomePageProps {
  onNavigate: (route: string) => void;
  featuredDishes: MenuItem[];
  onOpenDishModal: (dish: MenuItem) => void;
  settings: RestaurantSettings;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  featuredDishes,
  onOpenDishModal,
  settings,
}) => {
  return (
    <div className="space-y-24">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-[#212128]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Region & Verification Header */}
              <div className="flex items-center gap-3 text-xs tracking-wider uppercase text-neutral-400">
                <span className="text-[#b91c1c] font-semibold">Valencia City · Bukidnon</span>
                <span>·</span>
                <span>Japanese-Inspired Craft</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance">
                Experience Authentic Japanese-Inspired Flavors
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl font-light">
                Hand-pressed nigiri, torch-glazed aburi rolls, rich 14-hour tonkotsu ramen broths, and generous sushi platters crafted daily for Valencia City diners.
              </p>

              {/* Service Verification Pill Warning / Note */}
              <div className="p-3.5 rounded-xl bg-[#17171d] border border-[#2b2b35] text-xs text-neutral-300 max-w-xl">
                <span className="font-semibold text-amber-300 block mb-1">
                  Local Dining & Order Note
                </span>
                {settings.service_verification_note}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('/menu')}
                  className="px-7 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-all flex items-center gap-2 shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('/menu')}
                  className="px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-neutral-200 bg-[#1a1a22] hover:bg-[#252530] border border-[#2e2e3a] transition-all cursor-pointer"
                >
                  Explore Our Menu
                </button>

                <button
                  onClick={() => onNavigate('/reservations')}
                  className="px-5 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-amber-200/90 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-4 h-4 text-amber-400" />
                  Table Inquiry
                </button>
              </div>

              {/* Quick Hours Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-neutral-400 border-t border-[#1e1e24]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Tue – Sun: 11:00 AM – 2:00 PM / 5:00 PM – 9:30 PM</span>
                </div>
                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-neutral-300 hover:text-amber-300 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#b91c1c]" />
                  <span>3rd Flr, ASV Townhouse, Sayre Hwy, Brgy. Bagontaas</span>
                </a>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#2b2b35] shadow-2xl bg-[#141418]">
                <img
                  src="/src/assets/images/hero_sushi_spread_1793107470076.jpg"
                  alt="Honyaki Authentic Sushi Valencia artisanal sushi feast"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 block mb-1">
                    Signature Grand Platter
                  </span>
                  <p className="text-sm font-serif font-bold">
                    Fresh Salmon Aburi, Tuna Tartare & Dragon Rolls
                  </p>
                  <p className="text-xs text-neutral-300 mt-1">
                    Available for dine-in, advance takeout, or Valencia City delivery.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Available Dining, Pickup & Delivery Fulfillment Options */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c]">
            Dining Options
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
            How You Can Enjoy Honyaki
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Transparent fulfillment services configured for Valencia City diners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Dine-in */}
          <div className="p-6 rounded-2xl bg-[#15151a] border border-[#26262e] space-y-4 hover:border-neutral-500 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#231b1c] border border-red-900/40 flex items-center justify-center text-[#b91c1c]">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Dine-In Atmosphere
              </h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Warm timber slats, minimalist Japanese stone counter, and prompt tableside service in Poblacion, Valencia City.
              </p>
            </div>
            <div className="pt-2 text-xs text-emerald-400 flex items-center gap-1.5">
              <span>●</span>
              <span>Walk-ins welcome & advance requests</span>
            </div>
          </div>

          {/* Card 2: Takeout */}
          <div className="p-6 rounded-2xl bg-[#15151a] border border-[#26262e] space-y-4 hover:border-neutral-500 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#1a1f1b] border border-emerald-900/40 flex items-center justify-center text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Fast Pickup / Takeout
              </h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Order ahead online. Freshly packed in food-grade thermal containers ready in ~25 minutes for convenient curbside or counter pickup.
              </p>
            </div>
            <div className="pt-2 text-xs text-emerald-400 flex items-center gap-1.5">
              <span>●</span>
              <span>Ready in ~25 mins from confirmation</span>
            </div>
          </div>

          {/* Card 3: Delivery */}
          <div className="p-6 rounded-2xl bg-[#15151a] border border-[#26262e] space-y-4 hover:border-neutral-500 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#191e24] border border-sky-900/40 flex items-center justify-center text-sky-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Valencia City Delivery
              </h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                City proper coverage via reliable local riders. Base fee ₱60, with FREE delivery on qualified orders above ₱1,500.
              </p>
            </div>
            <div className="pt-2 text-xs text-amber-300 flex items-center gap-1.5">
              <span>●</span>
              <span>Central Valencia proper coverage</span>
            </div>
          </div>

          {/* Card 4: Catering & Platters */}
          <div className="p-6 rounded-2xl bg-[#15151a] border border-[#26262e] space-y-4 hover:border-neutral-500 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#241e17] border border-amber-900/40 flex items-center justify-center text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Party Sets & Catering
              </h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                40–60 piece sushi feast platters, bento boxes, and group meals for birthdays, hospital staff events, and family milestones.
              </p>
            </div>
            <div className="pt-2 text-xs text-amber-300 flex items-center gap-1.5">
              <span>●</span>
              <span>Advance inquiry requested (24–48h)</span>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Bestsellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c]">
              Chef's Signatures
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide mt-1">
              Popular Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Carefully curated items prepared with premium sushi-grade seafood and authentic seasoning.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/menu')}
            className="text-xs font-semibold uppercase tracking-wider text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>View All Menu Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredDishes.length === 0 ? (
          <div className="py-12 px-6 rounded-2xl bg-[#141418] border border-[#24242e] text-center space-y-3">
            <p className="font-serif text-lg text-white">Daily specials are being prepared</p>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Our chef's signature selections are updated daily according to fresh seafood deliveries. Explore our complete digital menu to view available dishes.
            </p>
            <button
              onClick={() => onNavigate('/menu')}
              className="mt-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-colors cursor-pointer"
            >
              Explore Full Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDishes.map((dish) => (
              <div
                key={dish.id}
                className="group bg-[#151519] border border-[#26262e] rounded-2xl overflow-hidden flex flex-col hover:border-neutral-500 transition-all shadow-md"
              >
                {/* Dish Image */}
                <div className="relative aspect-[4/3] bg-[#1a1a20] overflow-hidden">
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151519] via-transparent to-transparent pointer-events-none" />
                  
                  <span className="absolute top-3 right-3 text-[11px] font-mono font-semibold bg-black/70 backdrop-blur-sm text-amber-300 px-2 py-0.5 rounded border border-neutral-700 tabular-nums">
                    ₱{dish.price}
                  </span>
                </div>

                {/* Dish Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-base font-bold text-white group-hover:text-amber-100 transition-colors">
                      {dish.name}
                    </h3>
                    {dish.japanese_name && (
                      <p className="text-[11px] text-neutral-400 font-serif tracking-widest mt-0.5">
                        {dish.japanese_name}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#22222a] flex items-center justify-between gap-2">
                    <div className="text-[11px] text-neutral-400">
                      {dish.stock_quantity > 0 ? (
                        <span className="text-emerald-400">In Stock</span>
                      ) : (
                        <span className="text-red-400">Sold Out</span>
                      )}
                    </div>
                    <button
                      onClick={() => onOpenDishModal(dish)}
                      disabled={dish.stock_quantity <= 0}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#22222b] hover:bg-[#991b1b] hover:text-white text-neutral-200 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Select & Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* The Craft & Atmosphere of Honyaki */}
      <section className="bg-[#121215] border-y border-[#212128] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#2b2b35] shadow-2xl">
              <img
                src="/src/assets/images/interior_dining_room_1793107472270.jpg"
                alt="Interior dining room of Honyaki Authentic Sushi Valencia"
                referrerPolicy="no-referrer"
                className="w-full h-auto aspect-[16/9] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-mono text-amber-300 uppercase tracking-wider">
                  The Honyaki Dining Room
                </span>
                <p className="text-sm font-serif font-bold">
                  Warm cedar wood slats, quiet counter dining, and welcoming Bukidnon hospitality.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c]">
                Craftsmanship & Quality
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
                Dedicated to Freshness and Sincere Technique
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                At Honyaki Authentic Sushi Valencia, our mission is to present Japanese dining traditions with honest ingredients. From hand-seasoned short-grain sushi rice (*shari*) to precisely torched salmon nigiri, each plate is made to order with care.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#17171d] border border-[#26262e] space-y-1">
                  <h4 className="font-serif text-base font-bold text-white">
                    Fresh Seafood Deliveries
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Sashimi-grade salmon and tuna deliveries dispatched fresh to our kitchen each week.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#17171d] border border-[#26262e] space-y-1">
                  <h4 className="font-serif text-base font-bold text-white">
                    Simmered Broths
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Ramen stocks simmered for up to 14 hours for deep, natural umami richness.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/about')}
                  className="text-xs font-semibold uppercase tracking-wider text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Read More About Our Concept</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Reservation & Catering Callouts (2-Column Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Box 1: Table Reservations */}
          <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1a1716] to-[#121214] border border-[#2f2725] space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <CalendarCheck className="w-4 h-4" />
              <span>Dining Reservations</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Reserve Your Table in Advance
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Planning a family birthday, anniversary dinner, or lunch meeting? Submit your booking request online. Please note that table reservations require kitchen capacity approval before becoming final bookings.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('/reservations')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-colors cursor-pointer min-h-[44px] flex items-center justify-center text-center"
              >
                Submit Reservation Request
              </button>
            </div>
          </div>

          {/* Box 2: Catering & Group Orders */}
          <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-[#151918] to-[#121413] border border-[#222f28] space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Group Meals & Platters</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Catering & Party Inquiries
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Need custom 40–60 piece sushi platters or bulk bento sets for corporate events, hospital conferences, or home parties in Valencia City? Our team prepares tailored quotations.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('/catering')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-700 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center text-center"
              >
                Request Catering Quotation
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Location, Map & Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="p-5 sm:p-8 lg:p-10 rounded-2xl bg-[#141418] border border-[#25252e] grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c]">
              Visit Us in Barangay Bagontaas
            </span>
            <h3 className="font-serif text-xl sm:text-3xl font-bold text-white">
              Located on the 3rd Floor, ASV Townhouse
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              We are conveniently located along Sayre Highway in Barangay Bagontaas, Valencia City, Bukidnon. Dine-in, pickup, and delivery are available.
            </p>
            
            <div className="space-y-2 pt-1 text-xs text-neutral-300">
              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-amber-300 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#b91c1c] shrink-0 mt-0.5" />
                <span className="break-words">{settings.address_line}, {settings.city}, {settings.province}, Philippines</span>
              </a>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.operating_hours}</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <a
              href={settings.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 rounded-xl text-center text-xs font-semibold uppercase tracking-wider text-white bg-[#1f1f28] hover:bg-[#2b2b38] border border-[#333342] transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <MapPin className="w-4 h-4 text-[#b91c1c]" />
              <span>Open in Google Maps</span>
            </a>
            <button
              onClick={() => onNavigate('/contact')}
              className="py-3 px-5 rounded-xl text-center text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Contact the Restaurant
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
