"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ShimmerSkeleton from '@/components/ShimmerSkeleton';
import { getProducts } from '@/lib/db';
import { Product } from '@/lib/types';

function AddOnsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeMenuType, setActiveMenuType] = useState<'all' | 'roti-addons' | 'rice-addons'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    getProducts().then((res) => {
      const addons = res.filter((p) => p.category === 'add-ons');
      setProducts(addons);
      setIsLoading(false);
    });

    const handleUpdate = (e: any) => {
      const all: Product[] = e.detail || [];
      setProducts(all.filter((p) => p.category === 'add-ons'));
    };

    window.addEventListener('zk_products_updated', handleUpdate);
    return () => window.removeEventListener('zk_products_updated', handleUpdate);
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeMenuType === 'roti-addons' && p.subCategory !== 'Roti Box Add-ons') return false;
      if (activeMenuType === 'rice-addons' && p.subCategory !== 'Rice Box Add-ons') return false;
      return true;
    });
  }, [products, activeMenuType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeMenuType]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 bg-[#FAF8F5]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Extra Portions & Sides</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-black text-charcoal-950">
          Lunch Box Add-Ons & Sides
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-medium">
          Order extra rotis, fragrant rice, fresh sabzi, salan gravy, kheer dessert, and chilled beverages.
        </p>
      </div>

      {/* Pricing Notice */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 text-xs text-charcoal-800 shadow-xs">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-charcoal-950 block font-bold mb-0.5">Category-Specific Pricing Policy:</strong>
          Add-on prices are specifically tailored to match each menu set (Roti Lunch Boxes vs. Rice Lunch Boxes). Please select the sides matching your preferred lunch box meal.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-stone-200 shadow-xs">
          {[
            { id: 'all', label: 'All Add-ons' },
            { id: 'roti-addons', label: 'Roti Box Sides' },
            { id: 'rice-addons', label: 'Rice Box Sides' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMenuType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMenuType === tab.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-charcoal-600 font-semibold">
          Showing {paginatedProducts.length} of {filtered.length} sides (Page {currentPage} of {totalPages})
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ShimmerSkeleton key={i} />)
        ) : paginatedProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-charcoal-600 text-xs">
            No add-ons found in this category.
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} compact={true} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 pb-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            className="p-2 rounded-xl bg-white border border-stone-200 text-charcoal-700 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
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
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-charcoal-700 hover:text-amber-700 shadow-xs'
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
            className="p-2 rounded-xl bg-white border border-stone-200 text-charcoal-700 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function AddOnsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-amber-700 text-xs">Loading Add-ons...</div>}>
      <AddOnsContent />
    </Suspense>
  );
}
