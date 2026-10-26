"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Sparkles, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Our Story & Philosophy</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
          Where Taste Meets Passion
        </h1>
        <p className="text-xs sm:text-base text-cream-300/90 leading-relaxed">
          Bringing the comfort, warmth, and purity of homemade food to the heart of Peshawar.
        </p>
      </div>

      {/* Main Story Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden border-2 border-gold-500/30 shadow-2xl">
            <Image
              src="/images/banners/banner_2.jpg"
              alt="Zain's Kitchen Executive Lunch Boxes"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-obsidian-900/90 border border-gold-500/30">
              <span className="text-xs font-serif font-bold text-gold-300 block">Zain&apos;s Kitchen Philosophy</span>
              <p className="text-[11px] text-cream-300 mt-0.5">
                Ghar jaisa khana, ab aapke liye har roz! Swaad bhi, Sehat bhi!
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5 text-cream-300 text-xs sm:text-sm leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-white">
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
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <span>Explore Lunch Boxes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-5 py-3 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-cream-200 border border-gold-500/25 font-semibold text-xs transition-colors"
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
              className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/20 hover:border-gold-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-cream-400/90 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
