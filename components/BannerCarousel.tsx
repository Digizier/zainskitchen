"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '@/lib/types';
import { getBanners } from '@/lib/db';

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getBanners().then((res) => {
      const active = res.filter((b) => b.isActive);
      setBanners(active);
    });

    const handleUpdate = (e: any) => {
      const active = (e.detail || []).filter((b: Banner) => b.isActive);
      setBanners(active);
    };

    window.addEventListener('zk_banners_updated', handleUpdate);
    return () => window.removeEventListener('zk_banners_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  if (banners.length === 0) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-xl">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={banner.imageUrl}
              alt={banner.altText || "Zain's Kitchen Signature Meal"}
              fill
              priority={index === 0}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
        ))}

        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Banner"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-amber-600 hover:text-white text-charcoal-800 backdrop-blur-sm transition-all border border-stone-200 shadow-md active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Banner"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-amber-600 hover:text-white text-charcoal-800 backdrop-blur-sm transition-all border border-stone-200 shadow-md active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm border border-stone-200 shadow-sm">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-amber-600 shadow-xs'
                    : 'w-2 h-2 bg-stone-300 hover:bg-stone-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
