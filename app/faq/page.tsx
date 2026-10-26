"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the minimum order for Lunch Boxes?',
      a: 'The minimum order for lunch boxes is 5 boxes. You are free to mix and match any combination of our Roti-Sabzi and Rice lunch box varieties to reach the 5-box minimum!',
    },
    {
      q: 'Do regular restaurant dishes require a 5-item minimum?',
      a: 'No! The 5-item minimum applies exclusively to lunch boxes. You can order single portions of our restaurant dishes (such as Chicken Biryani, Chicken Nihari, Karahi, Pulao, or Chowmein).',
    },
    {
      q: 'What are the delivery charges in Peshawar?',
      a: 'Our delivery fees are tiered based on distance from our kitchen in Peshawar: 0–3 km is Rs. 200, 3–6 km is Rs. 230, and more than 6 km is Rs. 270. Packaging is included in the price for Rice Lunch Boxes.',
    },
    {
      q: 'When should I place my order for same-day meals?',
      a: 'Our confirmed same-day order acceptance window is between 10:00 AM and 12:00 PM. We strongly recommend booking in advance to ensure kitchen capacity and timely delivery.',
    },
    {
      q: 'Can I pick up my food myself?',
      a: 'Yes, absolutely! We offer convenient self-pickup as well as direct doorstep delivery across Peshawar.',
    },
    {
      q: 'When is breakfast served?',
      a: 'Traditional homemade breakfast is available on Saturday and Sunday. Because our breakfast menu features rotating seasonal specials, please contact us on WhatsApp to confirm current items and place advance reservations.',
    },
    {
      q: 'How does corporate / office lunch delivery work?',
      a: 'We offer weekly and monthly lunch meal subscriptions for corporate offices, banks, clinics, and educational institutions in Peshawar. Visit our Catering & Office Lunch page or message us directly on WhatsApp for custom menus and quotations.',
    },
    {
      q: 'How do I pay for my order?',
      a: 'We accept Cash on Delivery (COD) as well as direct online transfers via JazzCash, EasyPaisa, and Bank Transfer. You can upload your payment receipt screenshot directly during checkout.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8 bg-[#FAF8F5]">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
          <span>Help & Clarity</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-charcoal-950">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-xl mx-auto leading-relaxed font-medium">
          Everything you need to know about ordering, delivery areas, lunch-box minimums, and payment policies at Zain&apos;s Kitchen.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-stone-200/90 overflow-hidden transition-all duration-200 shadow-xs"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-stone-50 transition-colors"
              >
                <span className="font-serif text-sm sm:text-base font-bold text-charcoal-900">
                  {faq.q}
                </span>
                <div className="p-1 rounded-lg bg-amber-50 text-amber-800 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-charcoal-600 leading-relaxed border-t border-stone-100 pt-3 animate-fadeIn font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help CTA Box */}
      <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 sm:p-8 text-center space-y-3 shadow-sm">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal-950">
          Still Have Questions?
        </h3>
        <p className="text-xs text-charcoal-600 max-w-md mx-auto font-medium">
          Our kitchen manager is happy to answer your questions and assist with special requests or advance bookings.
        </p>
        <div className="pt-2">
          <a
            href="https://wa.me/923038835378?text=Assalam-o-Alaikum%20Zain's%20Kitchen!%20I%20have%20a%20question."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brandGreen hover:bg-green-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp (0303-8835378)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
