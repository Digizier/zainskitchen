"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Sparkles, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 bg-[#FAF8F5]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Our Story & Philosophy</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-charcoal-950">
          Where Taste Meets Passion
        </h1>
        <p className="text-xs sm:text-base text-charcoal-700 leading-relaxed font-medium">
          Bringing the comfort, warmth, and purity of homemade food to the heart of Peshawar.
        </p>
      </div>

      {/* Main Story Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden border-2 border-amber-300 shadow-2xl bg-white">
            <Image
              src="/images/banners/banner_2.jpg"
              alt="Zain's Kitchen Executive Lunch Boxes"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 border border-stone-200 shadow-lg">
              <span className="text-xs font-serif font-bold text-amber-900 block">Zain&apos;s Kitchen Philosophy</span>
              <p className="text-[11px] text-charcoal-700 mt-0.5 font-medium">
                Ghar jaisa khana, ab aapke liye har roz! Swaad bhi, Sehat bhi!
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5 text-charcoal-700 text-xs sm:text-sm leading-relaxed font-medium">
          <h2 className="font-serif text-2xl font-black text-charcoal-950">
            Peshawar&apos;s Premier Home-Based Cloud Kitchen
          </h2>
          <p>
            At <strong>Zain’s Kitchen</strong>, we believe that good food is born out of genuine care and maternal love. In a fast-paced world dominated by commercial diners and heavy restaurant grease, finding clean, balanced, and hygienic home-cooked meals is a daily struggle for employees, students, and families.
          </p>
          <p>
            Located right in <strong>Peshawar, Pakistan</strong>, our cloud kitchen is dedicated to filling that void. Every morning, we hand-pick fresh vegetables, premium cuts of poultry and meat, aged long-grain basmati rice, and authentic spices to prepare comforting, hygienic meals.
          </p>
          <p>
            Whether it&apos;s our signature <strong>Executive Roti & Sabzi Lunch Box</strong>, aromatic <strong>Chicken Biryani sets</strong>, or slow-cooked weekend delicacies like <strong>Chicken Nihari and White Karahi</strong>, every dish is cooked fresh daily to bring comfort to your workplace or dinner table.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/lunch-boxes"
              className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Explore Lunch Boxes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-5 py-3 rounded-xl bg-white hover:bg-stone-50 text-charcoal-800 border border-stone-200 font-bold text-xs transition-colors shadow-xs"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
        {[
          {
            title: 'Freshly Prepared Daily',
            desc: 'We never serve leftover food. Every dish is cooked fresh each morning for the day’s scheduled orders.',
            icon: Clock,
          },
          {
            title: '100% Halal & Hygienic',
            desc: 'Strict hygiene protocols, food-grade sealed containers, and hand-inspected pure ingredients.',
            icon: ShieldCheck,
          },
          {
            title: 'Pure Desi Ghee & Spices',
            desc: 'Home-style recipes tempered with real desi ghee, whole fragrant garam masala, and zero artificial preservatives.',
            icon: Award,
          },
          {
            title: 'Made with Passion',
            desc: 'Every lunch box is packed with the genuine care you would expect in your own mother’s kitchen.',
            icon: Heart,
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-amber-400 transition-colors shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-charcoal-900 mb-1">{item.title}</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed font-medium">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
