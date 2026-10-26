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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || categories.length === 0) return;

    let animationFrameId: number;
    const speed = 0.6;

    const step = () => {
      if (!isPaused && el) {
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

  const displayItems = categories.length > 3 ? [...categories, ...categories] : categories;

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
            Fresh Choices
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-black text-charcoal-950">
            Explore Main Categories
          </h2>
        </div>
        <Link
          href="/lunch-boxes"
          className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 transition-colors group"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

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
              className="shrink-0 w-[38vw] sm:w-48 md:w-56 group flex flex-col rounded-2xl bg-white hover:bg-white border border-stone-200/90 hover:border-amber-400 p-3 transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 mb-2.5">
                <Image
                  src={cat.image || '/images/dishes/lunchbox_roti.jpg'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-lg sm:text-xl drop-shadow-md">
                  {cat.icon || '🍱'}
                </span>
              </div>
              <h3 className="font-serif text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[10px] text-charcoal-500 line-clamp-1 mt-0.5">
                {cat.description || 'Authentic home-style flavors'}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
