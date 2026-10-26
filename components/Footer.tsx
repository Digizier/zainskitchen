"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageCircle, Instagram, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#F5F2EB] border-t border-amber-200/80 text-charcoal-700 pb-20 lg:pb-8 pt-10 sm:pt-14 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link href="/" className="inline-flex items-center gap-3 mb-3 group">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-500 shadow-md bg-white">
                <Image
                  src="/branding/zains_kitchen_logo.jpg"
                  alt="Zain's Kitchen Official Emblem"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-charcoal-950 group-hover:text-amber-800 transition-colors">
                  ZAIN&apos;S KITCHEN
                </span>
                <p className="text-[11px] text-amber-800 tracking-wider uppercase font-semibold">
                  Where Taste Meets Passion
                </p>
              </div>
            </Link>
            <p className="text-xs text-charcoal-600 leading-relaxed mb-4">
              Peshawar&apos;s premier home-style cloud kitchen. Delivering authentic homemade lunch boxes, royal karahi curries, and rich biryani prepared daily with love & hygiene.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/923038835378"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-white border border-green-200 flex items-center justify-center text-brandGreen hover:bg-brandGreen hover:text-white transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://www.instagram.com/zain.kitchen_/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Menu Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-3 pb-1 border-b border-amber-300/40 inline-block sm:block">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/lunch-boxes" className="hover:text-amber-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  <span className="text-amber-600 font-bold">›</span> Roti & Sabzi Lunch Boxes
                </Link>
              </li>
              <li>
                <Link href="/lunch-boxes" className="hover:text-amber-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  <span className="text-amber-600 font-bold">›</span> Rice Lunch Boxes
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  <span className="text-amber-600 font-bold">›</span> Chicken Nihari & Karahi
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  <span className="text-amber-600 font-bold">›</span> Beef Pulao & Biryani
                </Link>
              </li>
              <li>
                <Link href="/add-ons" className="hover:text-amber-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  <span className="text-amber-600 font-bold">›</span> Kheer & Add-on Sides
                </Link>
              </li>
            </ul>
          </div>

          {/* Catering & Service Policies */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-3 pb-1 border-b border-amber-300/40 inline-block sm:block">
              Corporate & Delivery
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-600">
              <li>
                <Link href="/catering" className="hover:text-amber-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5 font-medium text-charcoal-700">
                  <span className="text-amber-600 font-bold">›</span> Office Lunch Plans
                </Link>
              </li>
              <li>
                <Link href="/catering" className="hover:text-amber-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5 font-medium text-charcoal-700">
                  <span className="text-amber-600 font-bold">›</span> Bulk Catering Inquiries
                </Link>
              </li>
              <li>
                <span className="text-amber-600 mr-1.5 font-bold">•</span> Min 5 boxes for lunch-box orders
              </li>
              <li>
                <span className="text-amber-600 mr-1.5 font-bold">•</span> 0–3 km: Rs. 200 delivery fee
              </li>
              <li>
                <span className="text-amber-600 mr-1.5 font-bold">•</span> Self-pickup or delivery to doorstep
              </li>
            </ul>
          </div>

          {/* Working Hours & Contact */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-3 pb-1 border-b border-amber-300/40 inline-block sm:block">
              Timings & Location
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start justify-center sm:justify-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-charcoal-900 font-bold">Order Window (Same Day):</p>
                  <p className="text-amber-800 font-extrabold">10:00 AM – 12:00 PM</p>
                </div>
              </div>
              <div className="flex items-start justify-center sm:justify-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-charcoal-900 font-bold">Days & Weekend Breakfast:</p>
                  <p className="text-charcoal-600">Open Mon – Sun | Sat & Sun Breakfast</p>
                </div>
              </div>
              <div className="flex items-start justify-center sm:justify-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-charcoal-900 font-bold">Location:</p>
                  <p className="text-charcoal-600">Peshawar, Khyber Pakhtunkhwa, Pakistan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-600">
          <p>© {new Date().getFullYear()} Zain&apos;s Kitchen. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px] text-amber-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              100% Homemade Fresh & Hygienic
            </span>
            <Link
              href="/admin"
              className="text-[11px] text-charcoal-700 hover:text-amber-800 transition-colors border border-amber-300/80 rounded px-2.5 py-0.5 bg-white shadow-xs font-semibold"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
