"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/lib/types';
import { getCategories } from '@/lib/db';

export default function CategoryAutoScroller() {
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getCategories().then((all) => {
      // Filter strictly for main categories with showInTopCategories toggle enabled
      const filtered = all.filter((c) => c.isMainCategory && c.showInTopCategories !== false);
      setCategories(filtered);
    });

    const handleUpdate = (e: any) => {
      const all: Category[] = e.detail || [];
      const filtered = all.filter((c) => c.isMainCategory && c.showInTopCategories !== false);
      setCategories(filtered);
    };

    window.addEventListener('zk_categories_updated', handleUpdate);
    return () => window.removeEventListener('zk_categories_updated', handleUpdate);
  }, []);

  // Smooth continuous auto-scrolling effect when categories > 4 or on mobile
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || categories.length === 0) return;

    let animationFrameId: number;
    const speed = 0.6; // Subtle, elegant continuous speed

    const step = () => {
      if (!isPaused && el) {
        // If scrolled near half (since we duplicate items for seamless loop)
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += speed;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [categories.length, isPaused]);

  if (categories.length === 0) return null;

  // We duplicate array items to achieve an infinite seamless continuous marquee loop
  const displayItems = categories.length > 3 ? [...categories, ...categories] : categories;

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            Fresh Choices
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Explore Main Categories
          </h2>
        </div>
        <Link
          href="/lunch-boxes"
          className="text-xs font-semibold text-gold-300 hover:text-white flex items-center gap-1 transition-colors group"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Scrollable Container with touch support and smooth loop */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-1.5 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayItems.map((cat, idx) => {
          const targetUrl =
            cat.slug === 'roti-lunch-boxes' || cat.slug === 'rice-lunch-boxes'
              ? `/lunch-boxes?category=${cat.slug}`
              : cat.slug === 'add-ons'
              ? '/add-ons'
              : `/menu?category=${cat.slug}`;

          return (
            <Link
              key={`${cat.id}-${idx}`}
              href={targetUrl}
              className="shrink-0 w-[38vw] sm:w-48 md:w-56 group flex flex-col rounded-2xl bg-obsidian-850 hover:bg-obsidian-800 border border-gold-500/20 hover:border-gold-500/60 p-3 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-gold-500/10"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-obsidian-900 border border-gold-500/20 mb-2.5">
                <Image
                  src={cat.image || '/images/dishes/lunchbox_roti.jpg'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-lg sm:text-xl drop-shadow-md">
                  {cat.icon || '🍱'}
                </span>
              </div>
              <h3 className="font-serif text-xs sm:text-sm font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[10px] text-cream-400/80 line-clamp-1 mt-0.5">
                {cat.description || 'Authentic home-style flavors'}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
