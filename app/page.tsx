"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, UtensilsCrossed, Clock, Sparkles, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import BannerCarousel from '@/components/BannerCarousel';
import CategoryAutoScroller from '@/components/CategoryAutoScroller';
import BrandsAutoScroller from '@/components/BrandsAutoScroller';
import ProductCard from '@/components/ProductCard';
import ShimmerSkeleton from '@/components/ShimmerSkeleton';
import { getProducts } from '@/lib/db';
import { Product } from '@/lib/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts().then((res) => {
      setProducts(res);
      setIsLoading(false);
    });

    const handleUpdate = (e: any) => {
      setProducts(e.detail || []);
    };
    window.addEventListener('zk_products_updated', handleUpdate);
    return () => window.removeEventListener('zk_products_updated', handleUpdate);
  }, []);

  const flashDeals = products.filter((p) => p.isDailySpecial || p.isFeatured).slice(0, 4);
  const featuredLunchBoxes = products.filter((p) => p.isLunchBox).slice(0, 4);

  return (
    <div className="flex flex-col gap-8 sm:gap-12 pb-12 overflow-x-hidden bg-[#FAF8F5]">
      {/* 1. Hero Section (Warm, Inviting Restaurant Aesthetic) */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5F0E8] border-b border-amber-200/50">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-green-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Peshawar&apos;s Premium Home-Style Cloud Kitchen</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal-950 tracking-tight leading-[1.15]">
                Homemade Goodness,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800">
                  Made Fresh Every Day.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-charcoal-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Experience authentic home-cooked meals prepared with pure desi ghee, premium spices, and maternal love. From hearty executive lunch boxes to slow-cooked Chicken Nihari & Karahi.
              </p>

              {/* Taglines */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-charcoal-800 pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brandGreen" />
                  Ghar jaisa khana, ab aapke liye har roz!
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brandGreen" />
                  Swaad bhi, Sehat bhi!
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/lunch-boxes"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Explore Lunch Boxes</span>
                </Link>

                <a
                  href="https://wa.me/923038835378?text=Assalam-o-Alaikum%20Zain's%20Kitchen!%20I%20would%20like%20to%20order%20food."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brandGreen hover:bg-green-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order on WhatsApp (0303-8835378)</span>
                </a>
              </div>

              {/* Notice */}
              <div className="pt-2 text-[11px] sm:text-xs text-charcoal-600 flex items-center justify-center lg:justify-start gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Same-Day Order Acceptance Window:{' '}
                  <strong className="text-charcoal-900 font-bold">10:00 AM – 12:00 PM</strong> (Advance booking recommended)
                </span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md aspect-square rounded-3xl overflow-hidden border-2 border-amber-300 shadow-2xl bg-white group">
                <Image
                  src="/images/dishes/rest_biryani.jpg"
                  alt="Zain's Kitchen Signature Chicken Biryani"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stone-200 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gold-500 shrink-0 bg-white">
                    <Image
                      src="/branding/zains_kitchen_logo.jpg"
                      alt="Logo"
                      width={40}
                      height={40}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal-900">Zain&apos;s Signature Feast</h4>
                    <p className="text-[10px] text-amber-800 font-semibold">100% Fresh Daily • Peshawar Delivery</p>
                  </div>
                  <span className="ml-auto text-xs font-black text-amber-800">Rs. 400</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Pure Image Banner Carousel */}
      <BannerCarousel />

      {/* 3. Explore Main Categories */}
      <CategoryAutoScroller />

      {/* 4. Flash Deals & Chef Specials (2-Column Compact Grid on Mobile) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Special Taste Highlights
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-black text-charcoal-950">
              Flash Deals & Chef Specials
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 group"
          >
            <span>Full Menu</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <ShimmerSkeleton key={i} />)
          ) : (
            flashDeals.map((product) => (
              <ProductCard key={product.id} product={product} compact={true} />
            ))
          )}
        </div>
      </section>

      {/* 5. Featured Lunch Boxes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4">
        <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                Daily Office & Student Meals
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-black text-charcoal-950 mt-1">
                Executive Homemade Lunch Boxes
              </h2>
              <p className="text-xs text-charcoal-600 mt-1 max-w-xl">
                Wholesome meals packed fresh every morning. Minimum order is <strong>5 boxes</strong>. Mix and match your favorite varieties!
              </p>
            </div>
            <Link
              href="/lunch-boxes"
              className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition-all flex items-center gap-1.5"
            >
              <span>View All 10 Lunch Boxes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <ShimmerSkeleton key={i} />)
            ) : (
              featuredLunchBoxes.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. Authorized Quality Standards & Sourcing Scroller */}
      <BrandsAutoScroller />

      {/* 7. How Ordering Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
            Simple & Transparent
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-charcoal-950 mt-1">
            How Ordering Works
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2 font-medium">
            Order in less than 60 seconds with direct WhatsApp confirmation and doorstep delivery in Peshawar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              step: '01',
              title: 'Browse Our Menu',
              desc: 'Select from Roti-Sabzi lunch boxes, fragrant biryani sets, or royal restaurant curries.',
            },
            {
              step: '02',
              title: 'Build Your Order',
              desc: 'Choose quantities and options. Lunch box orders require at least 5 boxes.',
            },
            {
              step: '03',
              title: 'Pickup or Delivery',
              desc: 'Enter your Peshawar delivery address or choose convenient self-pickup.',
            },
            {
              step: '04',
              title: 'WhatsApp Confirmation',
              desc: 'Send your auto-formatted order to 0303-8835378 for final kitchen confirmation.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-amber-400 shadow-xs relative overflow-hidden group transition-all"
            >
              <span className="text-3xl font-serif font-black text-amber-400 group-hover:text-amber-600 transition-colors">
                {item.step}
              </span>
              <h3 className="text-sm font-bold text-charcoal-900 mt-2 mb-1.5">{item.title}</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Office Lunch & Bulk Catering Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-warm-100 to-amber-50 border border-amber-300/80 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
              Corporate & Special Occasions
            </span>
            <h3 className="font-serif text-xl sm:text-3xl font-black text-charcoal-950">
              Planning An Office Lunch Or Family Event?
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-700 max-w-xl font-medium">
              We provide custom lunch packages, weekly lunch-box subscriptions for Peshawar offices, and advance catering for small gatherings.
            </p>
          </div>
          <Link
            href="/catering"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all text-center"
          >
            Submit Catering Inquiry
          </Link>
        </div>
      </section>
    </div>
  );
}
