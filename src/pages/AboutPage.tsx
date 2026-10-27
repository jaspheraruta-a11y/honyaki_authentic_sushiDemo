import React from 'react';
import { Sparkles, Heart, Utensils, MapPin, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { RestaurantSettings } from '../types';

interface AboutPageProps {
  settings: RestaurantSettings;
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#b91c1c] font-semibold">
          <span>Our Culinary Story</span>
          <span>·</span>
          <span>Valencia City, Bukidnon</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
          The Story of Honyaki
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
          Bringing authentic Japanese-inspired culinary techniques, pristine sushi craft, and hearty ramen bowls to the heart of Valencia City.
        </p>
      </div>

      {/* Hero Atmosphere Image */}
      <div className="relative rounded-2xl overflow-hidden border border-[#2b2b35] shadow-2xl bg-[#141418]">
        <img
          src="/src/assets/images/interior_dining_room_1793107472270.jpg"
          alt="Honyaki Authentic Sushi Valencia dining room"
          referrerPolicy="no-referrer"
          className="w-full h-auto aspect-[16/9] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-6 left-6 right-6 text-white max-w-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-300">
            Barangay Bagontaas · Valencia City
          </span>
          <p className="font-serif text-lg sm:text-xl font-bold mt-1">
            An Intimate Dining Room at 3rd Floor, ASV Townhouse
          </p>
          <p className="text-xs text-neutral-300 mt-1">
            Designed with natural cedar wood slats, minimalist stone surfaces, and comfortable tables along Sayre Highway.
          </p>
        </div>
      </div>

      {/* Culinary Philosophy (3 Columns) */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#b91c1c]">
            Our Guiding Pillars
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Simplicity, Temperature & Freshness
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#221819] text-[#b91c1c] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Sashimi-Grade Sourcing
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              We source fresh Atlantic salmon, yellowfin tuna, and black tiger prawns through trusted cold-chain logistics in Mindanao to ensure food safety and pure flavor.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#221819] text-[#b91c1c] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Shari Sushi Rice Craft
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Sushi begins with the rice (*shari*). We prepare premium short-grain rice seasoned with balanced rice vinegar, sugar, and sea salt, held at body temperature.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141418] border border-[#221819] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#221819] text-[#b91c1c] flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Omotenashi Hospitality
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              We blend mindful Japanese service etiquette (*omotenashi*) with the warm, genuine friendliness of Bukidnon hospitality for every guest who walks through our doors.
            </p>
          </div>
        </div>
      </div>

      {/* Sincere Quality Disclaimer */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#15151a] border border-[#25252e] space-y-4">
        <h3 className="font-serif text-xl font-bold text-white">
          Our Commitment to Valencia City Diners
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
          Honyaki Authentic Sushi was created to give Valencia City and surrounding towns in Bukidnon a welcoming haven for genuine Japanese comfort food. We never pre-roll sushi or microwave broths; every dish is freshly assembled when your ticket prints in the kitchen.
        </p>
        <div className="pt-2 flex flex-wrap gap-4">
          <button
            onClick={() => onNavigate('/menu')}
            className="px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-colors cursor-pointer"
          >
            Explore the Menu
          </button>
          <a
            href={settings.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-amber-300 hover:text-white bg-[#1c1c24] hover:bg-[#252530] border border-[#2e2e3a] transition-colors flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-[#b91c1c]" />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </div>

    </div>
  );
};
