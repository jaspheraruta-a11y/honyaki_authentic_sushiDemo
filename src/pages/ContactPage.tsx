import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';
import { RestaurantSettings } from '../types';

interface ContactPageProps {
  settings: RestaurantSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#b91c1c] font-semibold">
          <span>Find Us & Get in Touch</span>
          <span>·</span>
          <span>Valencia City, Bukidnon</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
          Contact & Location
        </h1>
        <p className="text-sm text-neutral-300 max-w-2xl font-light">
          Have a question about today's sashimi catch, special diet requirements, or party bookings? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Contact Cards & Information */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Location Card */}
          <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-3">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-lg bg-[#241819] text-[#b91c1c] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold">Restaurant Address</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed pl-12">
              {settings.address_line}, {settings.city}, {settings.province}, 8709 Philippines
            </p>
            <p className="text-[11px] text-neutral-400 pl-12">
              Located on the 3rd Floor of ASV Townhouse along the Sayre Highway in Barangay Bagontaas.
            </p>
            <div className="pt-2 pl-12">
              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d1d26] hover:bg-[#282835] border border-[#2d2d38] text-xs font-semibold text-amber-300 hover:text-white transition-all shadow-sm"
              >
                <MapPin className="w-4 h-4 text-[#b91c1c]" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>
            </div>
          </div>

          {/* Operating Hours Card */}
          <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-3">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-lg bg-[#241e17] text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold">Operating Hours</h3>
            </div>
            <div className="text-xs text-neutral-300 space-y-1.5 pl-12">
              <div className="flex justify-between">
                <span className="font-medium text-white">Tuesday to Sunday:</span>
                <span className="font-mono text-neutral-300">11:00 AM – 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-white">Dinner Service:</span>
                <span className="font-mono text-neutral-300">5:00 PM – 9:30 PM</span>
              </div>
              <div className="flex justify-between text-neutral-400 pt-1 border-t border-[#22222a]">
                <span>Monday:</span>
                <span className="text-red-400">Closed (Weekly Maintenance)</span>
              </div>
            </div>
          </div>

          {/* Direct Phone & Email */}
          <div className="p-6 rounded-2xl bg-[#141418] border border-[#25252e] space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-lg bg-[#18231c] text-emerald-400 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold">Direct Channels</h3>
            </div>
            <div className="space-y-3 pl-12 text-xs">
              <div>
                <span className="text-neutral-400 block text-[11px]">Official Mobile / Calls / Inquiries:</span>
                <a
                  href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`}
                  className="font-mono text-emerald-400 hover:text-emerald-300 font-bold text-base transition-colors"
                >
                  {settings.contact_phone}
                </a>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Official Gmail:</span>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-neutral-300 hover:text-white transition-colors font-mono break-all"
                >
                  {settings.contact_email}
                </a>
              </div>
              <div className="pt-2 border-t border-[#22222a] flex items-center gap-4">
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-blue-400 text-xs transition-colors"
                >
                  Facebook Page →
                </a>
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-pink-400 text-xs transition-colors"
                >
                  Instagram →
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Message / Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#141418] border border-[#25252e] shadow-xl space-y-6">
            
            <div className="border-b border-[#242429] pb-4">
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span>Send a Message to the Kitchen Team</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                For questions about our menu, special dietary accommodations, or general inquiries.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{name}</strong>. Our staff in Valencia City will get back to you via your mobile or email as soon as service allows.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-300 bg-[#1e1e26] hover:bg-[#282835] transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                      Your Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kenneth Diaz"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                      Mobile Number (Philippines) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0917-123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. kenneth@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                    Message or Inquiry <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you with our menu, hours, or dining experience?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#1b1b22] border border-[#2a2a35] rounded-xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[#991b1b] hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Restaurant</span>
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
