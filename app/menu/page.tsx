"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { UtensilsCrossed, Search, ChevronLeft, ChevronRight, Sparkles, Coffee } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ShimmerSkeleton from '@/components/ShimmerSkeleton';
import { getProducts } from '@/lib/db';
import { Product } from '@/lib/types';

function MenuPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 8; // Strict 8 products per page limit

  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);

    getProducts().then((res) => {
      // Exclude lunchboxes (which have their own dedicated page)
      const restaurantDishes = res.filter((p) => !p.isLunchBox && p.category !== 'add-ons');
      setProducts(restaurantDishes);
      setIsLoading(false);
    });

    const handleUpdate = (e: any) => {
      const all: Product[] = e.detail || [];
      setProducts(all.filter((p) => !p.isLunchBox && p.category !== 'add-ons'));
    };

    window.addEventListener('zk_products_updated', handleUpdate);
    return () => window.removeEventListener('zk_products_updated', handleUpdate);
  }, [categoryParam]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, activeCategory, searchQuery]);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold">
          <UtensilsCrossed className="w-3.5 h-3.5 text-gold-400" />
          <span>Authentic Peshawar Flavors</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
          Full Restaurant Menu
        </h1>
        <p className="text-xs sm:text-sm text-cream-300/90 leading-relaxed">
          Royal curries, slow-cooked Nihari, Biryani, and specialty savories cooked fresh to order.
        </p>
      </div>

      {/* Weekend Breakfast Notice Pill */}
      <div className="bg-obsidian-850 border border-gold-500/20 rounded-2xl p-3 px-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gold-200">
          <Coffee className="w-4 h-4 text-gold-400 shrink-0" />
          <span>
            <strong>Weekend Breakfast Notice:</strong> Traditional breakfast available Saturday & Sunday! Please confirm via WhatsApp.
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-cream-400">Open Monday – Sunday</span>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-b border-gold-500/15 pb-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-obsidian-850 border border-gold-500/20 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Dishes' },
            { id: 'restaurant-dishes', label: 'Main Dishes' },
            { id: 'naan-breads', label: 'Naan & Breads' },
            { id: 'restaurant-extras', label: 'Special Extras' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 shadow-md'
                  : 'text-cream-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-obsidian-850 border border-gold-500/20 text-white placeholder-cream-500 focus:outline-none focus:border-gold-400"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center text-xs text-cream-400">
        <span>
          Showing {paginatedProducts.length} of {filtered.length} dishes (Page {currentPage} of {totalPages})
        </span>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ShimmerSkeleton key={i} />)
        ) : paginatedProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-cream-400 text-xs">
            No restaurant dishes found matching your criteria.
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gold-300 text-xs">Loading Menu...</div>}>
      <MenuPageContent />
    </Suspense>
  );
}
