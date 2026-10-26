"use client";

import React from 'react';
import { ShieldCheck, Award, Sparkles, CheckCircle2, HeartHandshake, Truck } from 'lucide-react';

export default function BrandsAutoScroller() {
  const trustBadges = [
    { title: '100% Halal Ingredients', desc: 'Hand-slaughtered poultry & fresh beef', icon: ShieldCheck },
    { title: 'Aged Basmati Rice', desc: 'Aromatic extra long grain', icon: Sparkles },
    { title: 'Pure Desi Ghee & Spices', desc: 'No artificial flavors or colorings', icon: Award },
    { title: 'Hygienic Sealed Containers', desc: 'Food-grade leak-proof packaging', icon: CheckCircle2 },
    { title: 'Peshawar Doorstep Delivery', desc: 'Prompt dispatch 10AM - 12PM', icon: Truck },
    { title: 'Cooked Daily with Love', desc: 'Fresh home-style cooking', icon: HeartHandshake },
  ];

  const duplicated = [...trustBadges, ...trustBadges];

  return (
    <section className="py-6 bg-amber-50/60 border-y border-amber-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
        <span className="text-[11px] uppercase tracking-widest text-amber-800 font-bold">
          Quality You Can Trust
        </span>
        <h3 className="font-serif text-base sm:text-lg font-black text-charcoal-950">
          Authorized Quality Standards & Genuine Sourcing
        </h3>
      </div>

      <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
        <div className="flex gap-4 shrink-0 animate-marquee hover:[animation-play-state:paused] py-2">
          {duplicated.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-stone-200/90 shrink-0 shadow-xs"
              >
                <div className="p-2 rounded-lg bg-amber-100/80 text-amber-800">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900">{badge.title}</h4>
                  <p className="text-[10px] text-charcoal-600">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
