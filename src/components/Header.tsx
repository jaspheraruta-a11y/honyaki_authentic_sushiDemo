import React, { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, ShieldCheck, MapPin } from 'lucide-react';
import logo from '../assets/images/honyaki-logo.jpg';
import { RestaurantSettings } from '../types';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string, param?: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  settings: RestaurantSettings;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  cartCount,
  onOpenCart,
  settings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Menu', route: '/menu' },
    { label: 'Services', route: '/services' },
    { label: 'Reservations', route: '/reservations' },
    { label: 'Catering & Platters', route: '/catering' },
    { label: 'About & Location', route: '/about' },
  ];

  return (
    <>
      {/* Slim Announcement Banner */}
      {showBanner && settings.announcement_banner && (
        <div className="bg-[#1f1d1b] border-b border-[#2e2a27] text-xs text-[#dcd6cc] px-3 sm:px-4 py-2 flex items-center justify-between z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 w-full min-w-0 pr-2">
            <span className="hidden sm:inline text-[#b91c1c] font-semibold shrink-0">NOTICE</span>
            <span className="truncate text-[11px] sm:text-xs">{settings.announcement_banner}</span>
            <span className="hidden md:inline text-neutral-400">·</span>
            <a
              href={settings.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-amber-300/90 hover:text-white transition-colors underline decoration-amber-300/50 shrink-0"
            >
              <MapPin className="w-3 h-3" />
              <span>Sayre Hwy, Brgy. Bagontaas</span>
            </a>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-neutral-400 hover:text-white min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer shrink-0 rounded"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar Contract: 3 zones responsive for 320px up to 1440px */}
      <header className="sticky top-0 z-40 bg-[#0e0e10]/95 backdrop-blur-md border-b border-[#242429]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          
          {/* Zone 1: Restaurant logo and wordmark */}
          <button
            onClick={() => {
              onNavigate('/');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-3 text-left cursor-pointer group focus:outline-none min-w-0 shrink"
          >
            <img
              src={logo}
              alt="Honyaki Authentic Sushi logo"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-contain shrink-0"
            />
            <div className="min-w-0">
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-neutral-100 group-hover:text-amber-100 transition-colors block truncate">
                HONYAKI
              </span>
              <span className="hidden min-[380px]:block text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-neutral-400 font-sans truncate">
                Authentic Sushi · Valencia
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 single-line clean nav links (desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => onNavigate(link.route)}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                    isActive
                      ? 'text-white font-semibold border-b-2 border-[#b91c1c]'
                      : 'hover:text-white text-neutral-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action (Cart & Order Now) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Quick Track link */}
            <button
              onClick={() => onNavigate('/my-account')}
              className="hidden sm:inline-flex items-center text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer px-2 py-1.5"
            >
              Track Order
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label="View shopping bag"
              className="relative p-2 sm:p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] text-neutral-200 hover:text-white hover:border-[#3f3f46] transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 min-h-[40px] min-w-[40px] justify-center"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
              <span className="hidden md:inline text-xs font-semibold tabular-nums text-neutral-200">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#991b1b] text-white text-[11px] font-bold flex items-center justify-center tabular-nums shrink-0">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Order Now CTA */}
            <button
              onClick={() => onNavigate('/menu')}
              className="hidden sm:inline-flex px-3.5 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] rounded-lg hover:bg-[#b91c1c] transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              Order Now
            </button>

            {/* Admin Portal shortcut */}
            <button
              onClick={() => onNavigate('/admin')}
              title="Staff / Admin Management Portal"
              className="p-2 text-neutral-400 hover:text-amber-200 hover:bg-[#18181b] rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-[#18181b] cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer with Backdrop */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-16 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-40 lg:hidden bg-[#121214] border-b border-[#242429] px-4 pt-3 pb-6 space-y-1.5 shadow-2xl max-h-[calc(100dvh-4rem)] overflow-y-auto">
              {navLinks.map((link) => (
                <button
                  key={link.route}
                  onClick={() => {
                    onNavigate(link.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                    currentRoute === link.route
                      ? 'bg-[#1e1e24] text-white font-semibold'
                      : 'text-neutral-300 hover:bg-[#18181b] hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-3 border-t border-[#242429] flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    onNavigate('/menu');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-center text-xs font-semibold uppercase tracking-wider text-white bg-[#991b1b] rounded-xl hover:bg-[#b91c1c] min-h-[44px]"
                >
                  Explore Full Menu
                </button>
                <button
                  onClick={() => {
                    onNavigate('/my-account');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs text-neutral-300 hover:text-white border border-[#27272a] rounded-xl min-h-[40px]"
                >
                  Track Existing Order
                </button>
                <button
                  onClick={() => {
                    onNavigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-[11px] text-neutral-400 hover:text-amber-300"
                >
                  Staff Admin Dashboard
                </button>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};
