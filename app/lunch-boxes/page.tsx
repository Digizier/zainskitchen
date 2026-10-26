"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Package, AlertCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ShimmerSkeleton from '@/components/ShimmerSkeleton';
import { getProducts } from '@/lib/db';
import { Product } from '@/lib/types';

function LunchBoxesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'roti' | 'rice'>('all');
  const [selectedSub, setSelectedSub] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 8; // Strict 8 products per page limit for optimal performance

  useEffect(() => {
    if (categoryParam === 'roti-lunch-boxes') setActiveTab('roti');
    if (categoryParam === 'rice-lunch-boxes') setActiveTab('rice');

    getProducts().then((res) => {
      const lunchBoxes = res.filter((p) => p.isLunchBox);
      setProducts(lunchBoxes);
      setIsLoading(false);
    });

    const handleUpdate = (e: any) => {
      const all: Product[] = e.detail || [];
      setProducts(all.filter((p) => p.isLunchBox));
    };

    window.addEventListener('zk_products_updated', handleUpdate);
    return () => window.removeEventListener('zk_products_updated', handleUpdate);
  }, [categoryParam]);

  // Filter products by tab and subcategory
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeTab === 'roti' && p.category !== 'roti-lunch-boxes') return false;
      if (activeTab === 'rice' && p.category !== 'rice-lunch-boxes') return false;
      if (selectedSub !== 'all' && p.subCategory !== selectedSub) return false;
      return true;
    });
  }, [products, activeTab, selectedSub]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedSub]);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold">
          <Package className="w-3.5 h-3.5 text-gold-400" />
          <span>Freshly Prepared Daily</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
          Executive Lunch Boxes
        </h1>
        <p className="text-xs sm:text-sm text-cream-300/90 leading-relaxed">
          Wholesome homemade lunch boxes crafted for Peshawar offices, students, and families.
        </p>
      </div>

      {/* Minimum Order & Timing Policy Alert Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/80 via-obsidian-900 to-amber-950/80 border border-gold-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-gold-500/20 text-gold-400 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-0.5">Important Lunch Box Order Rules:</h4>
            <ul className="text-gold-200/90 space-y-0.5 text-[11px] sm:text-xs">
              <li>• <strong>Minimum Order:</strong> 5 Lunch Boxes (You can mix different varieties).</li>
              <li>• <strong>Order Acceptance Window:</strong> 10:00 AM – 12:00 PM for same-day meals.</li>
              <li>• <strong>Peshawar Delivery:</strong> 0–3 km (Rs. 200), 3–6 km (Rs. 230), 6 km+ (Rs. 270). Packaging included in rice boxes!</li>
            </ul>
          </div>
        </div>
        <a
          href="https://wa.me/923038835378?text=Assalam-o-Alaikum%20Zain's%20Kitchen!%20I%20want%20to%20inquire%20about%20ordering%20lunch%20boxes."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-brandGreen text-white font-bold text-xs hover:bg-brandGreen/90 transition-all shadow-md"
        >
          WhatsApp Inquiry
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-b border-gold-500/15 pb-4">
        {/* Main Category Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-obsidian-850 border border-gold-500/20">
          {[
            { id: 'all', label: 'All Lunch Boxes' },
            { id: 'roti', label: 'Roti & Sabzi (4)' },
            { id: 'rice', label: 'Rice Boxes (6)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedSub('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 shadow-md'
                  : 'text-cream-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Count Info */}
        <span className="text-xs text-cream-400 font-medium">
          Showing {paginatedProducts.length} of {filtered.length} lunch boxes (Page {currentPage} of {totalPages})
        </span>
      </div>

      {/* Products Grid (2 cols mobile, 4 cols desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ShimmerSkeleton key={i} />)
        ) : paginatedProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-cream-400 text-xs">
            No lunch boxes found in this category.
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Pagination Controls (Strict 8 products per page) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 pb-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            className="p-2 rounded-xl bg-obsidian-850 border border-gold-500/20 text-cream-300 hover:text-gold-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 shadow-md'
                    : 'bg-obsidian-850 border border-gold-500/20 text-cream-300 hover:text-gold-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
            className="p-2 rounded-xl bg-obsidian-850 border border-gold-500/20 text-cream-300 hover:text-gold-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function LunchBoxesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gold-300 text-xs">Loading Lunch Boxes...</div>}>
      <LunchBoxesContent />
    </Suspense>
  );
}
