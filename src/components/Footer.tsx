import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import logo from '../assets/images/honyaki-logo.jpg';
import { RestaurantSettings } from '../types';

interface FooterProps {
  onNavigate: (route: string) => void;
  settings: RestaurantSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  return (
    <footer className="bg-[#09090b] border-t border-[#1f1f23] text-neutral-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Restaurant Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Honyaki Authentic Sushi logo"
                className="w-12 h-12 rounded-full object-contain shrink-0"
              />
              <span className="font-serif text-lg font-bold text-white tracking-wide">
                HONYAKI VALENCIA
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Artisanal Japanese-inspired sushi, freshly rolled maki, slow-simmered ramen, and generous sharing platters crafted for Valencia City and Bukidnon diners.
            </p>
            <div className="pt-2 text-xs text-amber-200/80 bg-[#161619] p-3 rounded-lg border border-[#26262a]">
              <span className="font-semibold block text-amber-100 mb-0.5">Kitchen Policy Notice</span>
              Sashimi is prepared strictly upon order to maintain pristine freshness and temperature integrity.
            </div>
          </div>

          {/* Column 2: Hours & Dining */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide">
              Operating Hours
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white block font-medium">Tuesday to Sunday</span>
                  <p className="text-neutral-400">Lunch: 11:00 AM – 2:00 PM</p>
                  <p className="text-neutral-400">Dinner: 5:00 PM – 9:30 PM</p>
                </div>
              </div>
              <p className="text-neutral-400 pt-1 text-[11px]">
                Closed on Mondays for deep kitchen sanitization & weekly restocking.
              </p>
            </div>
          </div>

          {/* Column 3: Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide">
              Location & Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#b91c1c] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-neutral-300 block font-medium">
                    {settings.address_line}, {settings.city}, {settings.province}
                  </span>
                  <a
                    href={settings.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-white transition-colors underline decoration-amber-300/40"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`} className="font-mono text-emerald-400 hover:text-white transition-colors">
                  {settings.contact_phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="text-neutral-300 hover:text-white transition-colors break-all">
                  {settings.contact_email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Quick Links & Portal */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide">
              Explore & Services
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onNavigate('/menu')} className="hover:text-white transition-colors cursor-pointer">
                  Digital Menu & Bestsellers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/reservations')} className="hover:text-white transition-colors cursor-pointer">
                  Table Reservation Inquiry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/catering')} className="hover:text-white transition-colors cursor-pointer">
                  Party Platters & Catering
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors cursor-pointer">
                  Fulfillment & Delivery Coverage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/my-account')} className="hover:text-white transition-colors cursor-pointer">
                  Look Up Existing Order
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('/admin')}
                  className="inline-flex items-center gap-1.5 text-amber-300/80 hover:text-amber-200 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Staff Management Portal
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Unverified Disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#1a1a1e] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>
            © {new Date().getFullYear()} Honyaki Authentic Sushi Valencia. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-neutral-400 text-center sm:text-right">
            <span>Valencia City, Bukidnon, Northern Mindanao</span>
            <span>·</span>
            <span>Serving Japanese-Inspired Cuisine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
