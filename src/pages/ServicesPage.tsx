import React from 'react';
import { UtensilsCrossed, Clock, Truck, CalendarCheck, Users, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { RestaurantSettings } from '../types';

interface ServicesPageProps {
  settings: RestaurantSettings;
  onNavigate: (route: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  settings,
  onNavigate,
}) => {
  const servicesList = [
    {
      id: 'dine-in',
      title: 'Authentic Dine-In Experience',
      japanese: '店内飲食',
      icon: UtensilsCrossed,
      enabled: settings.dine_in_enabled,
      statusBadge: 'Active & Welcoming',
      statusType: 'active',
      description:
        'Dine in our Japanese-inspired restaurant at the 3rd Floor, ASV Townhouse, Sayre Highway in Barangay Bagontaas, Valencia City. Enjoy freshly pressed nigiri right from the sushi bar, piping hot ramen bowls, and serene dining room ambiance.',
      conditions: [
        'Walk-in seating subject to floor capacity (42 max seating)',
        'Operating hours: 11:00 AM – 2:00 PM & 5:00 PM – 9:30 PM (Tue–Sun)',
        'Cash, GCash (0954 298 2417), and Maya mobile payments accepted',
      ],
      ctaText: 'View Restaurant Menu',
      ctaAction: () => onNavigate('/menu'),
    },
    {
      id: 'takeout',
      title: 'Express Takeout & Counter Pickup',
      japanese: 'お持ち帰り',
      icon: Clock,
      enabled: settings.pickup_enabled,
      statusBadge: 'Available Daily',
      statusType: 'active',
      description:
        'Order your favorite sushi rolls, bento boxes, and appetizers in advance. We package every order in food-grade thermal containers to preserve optimal freshness.',
      conditions: [
        'Average preparation time: ~25 minutes from order confirmation',
        'Pickup counter at 3rd Floor, ASV Townhouse, Sayre Hwy, Brgy. Bagontaas',
        'Special packaging for hot ramen broths and cold sushi',
      ],
      ctaText: 'Order for Pickup',
      ctaAction: () => onNavigate('/menu'),
    },
    {
      id: 'delivery',
      title: 'Valencia City Food Delivery',
      japanese: '出前配達',
      icon: Truck,
      enabled: settings.delivery_enabled,
      statusBadge: settings.is_delivery_confirmed ? 'Active Delivery Service' : 'Contact for Availability',
      statusType: settings.is_delivery_confirmed ? 'active' : 'notice',
      description:
        'Direct delivery within central Valencia City proper. Delivered by trusted local riders directly to your home, office, clinic, or school.',
      conditions: [
        `Base delivery fee: ₱${settings.delivery_fee_base} for central Valencia City proper`,
        `FREE delivery for qualified orders above ₱${settings.free_delivery_threshold.toLocaleString()}`,
        'Outlying barangays (e.g. Mailag, Batangan) require direct coordination with our team',
      ],
      ctaText: 'Start Delivery Order',
      ctaAction: () => onNavigate('/menu'),
    },
    {
      id: 'reservations',
      title: 'Table Reservations & Special Seating',
      japanese: '席予約',
      icon: CalendarCheck,
      enabled: settings.reservations_enabled,
      statusBadge: 'Request Based (Requires Confirmation)',
      statusType: 'notice',
      description:
        'Request table seating in advance for family birthdays, anniversaries, or business dinners. Our floor manager confirms requests based on real-time kitchen capacity.',
      conditions: [
        'Requests must be submitted at least 2 hours in advance',
        'A request is NOT confirmed until our staff contacts your mobile',
        'Tables held for up to 15 minutes past reserved time',
      ],
      ctaText: 'Submit Reservation Request',
      ctaAction: () => onNavigate('/reservations'),
    },
    {
      id: 'platters',
      title: 'Party Platters & Sharing Sets',
      japanese: '盛り合わせ',
      icon: Users,
      enabled: settings.catering_enabled,
      statusBadge: 'Available on Order',
      statusType: 'active',
      description:
        'Artfully arranged 40–60 piece sushi feast platters featuring dragon rolls, aburi salmon, tuna tartare, and crispy tempura maki. Ideal for home parties and reunions.',
      conditions: [
        'Standard 40-piece celebration platter available in ~45–60 mins',
        '60-piece VIP platters recommended to order 3 hours in advance',
        'Includes pickled ginger, wasabi, and premium shoyu packets',
      ],
      ctaText: 'View Platter Options',
      ctaAction: () => onNavigate('/catering'),
    },
    {
      id: 'catering',
      title: 'Corporate & Event Catering Inquiries',
      japanese: '仕出し・ケータリング',
      icon: Sparkles,
      enabled: settings.catering_enabled,
      statusBadge: 'Advance Quotation Required',
      statusType: 'notice',
      description:
        'Customized bulk Japanese meals, bento box sets, and sushi platters for hospital gatherings, government conferences, and corporate functions in Bukidnon.',
      conditions: [
        'Minimum headcount: 15 guests',
        'Requires at least 24–48 hours advance notice for menu preparation',
        'Formal quotations and official receipts provided upon request',
      ],
      ctaText: 'Request Catering Quote',
      ctaAction: () => onNavigate('/catering'),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#b91c1c] font-semibold">
          <span>Services & Operations</span>
          <span>·</span>
          <span>Valencia City, Bukidnon</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
          Our Dining & Order Services
        </h1>
        <p className="text-sm text-neutral-300 max-w-2xl font-light">
          Everything you need to know about our dining room, pickup counter, local city delivery, and group platter arrangements.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {servicesList.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="p-7 rounded-2xl bg-[#141418] border border-[#25252e] space-y-6 flex flex-col justify-between hover:border-neutral-500 transition-all shadow-md"
            >
              <div className="space-y-4">
                
                {/* Header with Icon and Japanese Title */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#221819] border border-red-900/40 text-[#b91c1c] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded border inline-block ${
                        service.statusType === 'active'
                          ? 'bg-emerald-950/50 border-emerald-600/30 text-emerald-400'
                          : 'bg-amber-950/50 border-amber-600/30 text-amber-300'
                      }`}
                    >
                      {service.statusBadge}
                    </span>
                    <span className="block text-[11px] text-neutral-400 font-serif tracking-widest mt-1">
                      {service.japanese}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                {/* Conditions / Guidelines */}
                <div className="space-y-1.5 pt-2 border-t border-[#22222a]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                    Operating Guidelines:
                  </span>
                  {service.conditions.map((cond, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-400">
                      <span className="text-[#b91c1c] mt-0.5 font-bold">·</span>
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Call to action */}
              <div className="pt-4 border-t border-[#22222a]">
                <button
                  onClick={service.ctaAction}
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1e1e26] hover:bg-[#991b1b] border border-[#2d2d38] hover:border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{service.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Verification Transparency Note */}
      <div className="p-6 rounded-2xl bg-[#17171d] border border-[#2b2b35] text-xs text-neutral-300 space-y-2">
        <h4 className="font-semibold text-amber-300 text-sm">
          A Note on Operational Accuracy
        </h4>
        <p className="leading-relaxed">
          In line with our commitment to honest customer service, all prices in our system reflect live kitchen pricing in Philippine Pesos (PHP). For questions regarding delivery fees to remote Bukidnon sitios or custom dietary arrangements, reach out directly at <strong className="text-white">{settings.contact_phone}</strong>.
        </p>
      </div>

    </div>
  );
};
