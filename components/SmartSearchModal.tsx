"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Search, X, Plus, Check } from 'lucide-react';
import { getProducts, addToCart } from '@/lib/db';
import { Product } from '@/lib/types';

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartSearchModal({ isOpen, onClose }: SmartSearchModalProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCategory = p.categoryName.toLowerCase().includes(q);
      const matchIncluded = (p.includedItems || []).some((item) => item.toLowerCase().includes(q));

      // Hinglish synonym mapping
      const isBiryaniSearch = (q.includes('biryani') || q.includes('briyani')) && p.name.toLowerCase().includes('biryani');
      const isPulaoSearch = (q.includes('pulao') || q.includes('pulav') || q.includes('pulawo')) && (p.name.toLowerCase().includes('pulao') || p.name.toLowerCase().includes('pulav'));
      const isRotiSearch = (q.includes('roti') || q.includes('chapati') || q.includes('phulka')) && (p.name.toLowerCase().includes('roti') || p.name.toLowerCase().includes('chapati'));
      const isNihariSearch = (q.includes('nihari') || q.includes('nehari')) && p.name.toLowerCase().includes('nihari');
      const isKarahiSearch = (q.includes('karahi') || q.includes('karai') || q.includes('kadai')) && p.name.toLowerCase().includes('karahi');
      const isSweetSearch = (q.includes('kheer') || q.includes('dessert') || q.includes('meetha')) && (p.name.toLowerCase().includes('kheer') || (p.includedItems || []).some((i) => i.toLowerCase().includes('kheer')));

      return matchName || matchDesc || matchCategory || matchIncluded || isBiryaniSearch || isPulaoSearch || isRotiSearch || isNihariSearch || isKarahiSearch || isSweetSearch;
    });
  }, [query, products]);

  if (!isOpen) return null;

  const handleAdd = (product: Product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-start justify-center pt-16 sm:pt-24 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-obsidian-950 border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gold-500/20 flex items-center gap-3 bg-obsidian-900">
          <Search className="w-5 h-5 text-gold-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes (e.g. Biryani, Nihari, Karahi, Lunch Box, Roti, Kheer)..."
            className="w-full bg-transparent text-white placeholder-cream-500 text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-cream-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-cream-400 hover:text-white rounded-lg hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2.5">
          {!query.trim() ? (
            <div className="py-8 text-center text-cream-400 text-xs">
              <p className="mb-2">Popular searches in Peshawar:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Chicken Biryani', 'Basic Lunch Box', 'Chicken Nihari', 'White Karahi', 'Special Lunch Box', 'Kheer'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-full bg-obsidian-800 hover:bg-gold-500/20 text-cream-300 hover:text-gold-300 text-xs border border-gold-500/15 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-10 text-center text-cream-400 text-xs">
              <p className="text-white font-medium mb-1">No matching dishes found for &quot;{query}&quot;</p>
              <p>Try searching for Biryani, Lunch Box, Karahi, or Nihari.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-obsidian-900/80 hover:bg-obsidian-850 border border-gold-500/15 transition-all"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-obsidian-800 shrink-0 border border-gold-500/20">
                  <Image
                    src={product.thumbnail || '/images/dishes/roti_lunchbox_1.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate">{product.name}</h4>
                  <p className="text-[11px] text-cream-400/80 line-clamp-1">{product.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-gold-300">Rs. {product.price}</span>
                    {product.isLunchBox && (
                      <span className="text-[9px] bg-gold-500/20 text-gold-300 px-1 rounded border border-gold-500/30">
                        🍱 Lunch Box (Min 5)
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(product)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shrink-0 ${
                    addedId === product.id
                      ? 'bg-brandGreen text-white'
                      : 'bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-obsidian-950 border border-gold-500/40'
                  }`}
                >
                  {addedId === product.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
