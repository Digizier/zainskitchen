"use client";

import React, { useState } from 'react';
import { MessageCircle, Instagram, MapPin, Clock, Phone, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Assalam-o-Alaikum Zain's Kitchen!

*Customer Message from Website:*
• Name: ${name}
• Phone: ${phone}
• Topic: ${subject}
• Message: ${message}

Please get in touch with me. Thank you!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/923038835378?text=${encoded}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
          We&apos;d Love to Hear From You
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
          Contact Zain&apos;s Kitchen
        </h1>
        <p className="text-xs sm:text-sm text-cream-300/90 leading-relaxed">
          Questions about lunch-box orders, delivery timing, or weekend breakfast? Reach out to our kitchen directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/20 space-y-4">
            <h3 className="font-serif text-base font-bold text-white border-b border-gold-500/15 pb-2">
              Direct Contact Channels
            </h3>

            {/* WhatsApp */}
            <a
              href="https://wa.me/923038835378"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3 rounded-xl bg-obsidian-900 border border-brandGreen/30 hover:border-brandGreen transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-brandGreen/20 text-brandGreen">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-[11px] text-cream-400 block font-medium">WhatsApp Ordering & Helpline</span>
                <span className="text-sm font-bold text-white group-hover:text-brandGreen transition-colors">
                  0303-8835378
                </span>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/zain.kitchen_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3 rounded-xl bg-obsidian-900 border border-pink-500/30 hover:border-pink-500 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-cream-400 block font-medium">Official Instagram</span>
                <span className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">
                  @zain.kitchen_
                </span>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-obsidian-900 border border-gold-500/20">
              <div className="p-2.5 rounded-xl bg-gold-500/15 text-gold-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-cream-400 block font-medium">Kitchen Hub</span>
                <span className="text-xs font-semibold text-white">
                  Peshawar, Khyber Pakhtunkhwa, Pakistan
                </span>
              </div>
            </div>
          </div>

          {/* Timings Card */}
          <div className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/20 space-y-3">
            <h3 className="font-serif text-base font-bold text-white border-b border-gold-500/15 pb-2">
              Order Timings & Days
            </h3>
            <div className="space-y-2 text-xs text-cream-300">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Same-Day Ordering Window:</strong>
                  <p className="text-gold-300 font-semibold">10:00 AM – 12:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Kitchen Operations:</strong>
                  <p>Open Monday to Sunday</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Weekend Breakfast:</strong>
                  <p>Available Saturday & Sunday (Advance booking on WhatsApp)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-850 border border-gold-500/30 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-white border-b border-gold-500/20 pb-3 mb-4">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cream-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-300 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0303-XXXXXXX"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-300 mb-1">
                  Subject / Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white focus:outline-none focus:border-gold-400"
                >
                  <option value="Lunch Box Order">Lunch Box Order Inquiry</option>
                  <option value="Restaurant Dishes">Restaurant Dishes Inquiry</option>
                  <option value="Delivery Question">Peshawar Delivery Question</option>
                  <option value="Office Catering">Office & Corporate Lunch</option>
                  <option value="Weekend Breakfast">Weekend Breakfast Booking</option>
                  <option value="General Question">Other / General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-300 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today? Please share any details about dishes, delivery area, or timing..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:brightness-110 active:scale-98 text-obsidian-950 font-bold text-xs sm:text-sm shadow-xl shadow-gold-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-obsidian-950" />
                <span>Send Message via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
