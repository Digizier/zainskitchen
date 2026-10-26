"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { addToCart } from '@/lib/db';
import ProductDetailModal from './ProductDetailModal';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // For lunch boxes, initial add starts with 5 (or minimumOrderQuantity)
    const qty = product.isLunchBox ? (product.minimumOrderQuantity || 5) : 1;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <>
      <div
        onClick={() => setIsDetailOpen(true)}
        className="group relative flex flex-col justify-between rounded-2xl bg-obsidian-850 hover:bg-obsidian-800 border border-gold-500/20 hover:border-gold-500/50 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-gold-500/10 cursor-pointer overflow-hidden"
      >
        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {product.isLunchBox && (
            <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-500 text-obsidian-950 shadow-md">
              Min 5 Boxes
            </span>
          )}
          {product.isDailySpecial && (
            <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white shadow-md">
              Special
            </span>
          )}
        </div>

        {/* Image Container with Shimmer skeleton until loaded */}
        <div className="relative w-full aspect-square bg-obsidian-900 overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gold-500/15 to-transparent" />
          )}
          <Image
            src={product.thumbnail || '/images/dishes/roti_lunchbox_1.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImgLoaded(true)}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Quick preview icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailOpen(true);
            }}
            aria-label="View product details"
            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-gold-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold-500 hover:text-black"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Body - Compact on mobile */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gold-400/90 font-medium line-clamp-1">
              {product.categoryName}
            </span>
            <h3 className="font-serif text-xs sm:text-sm font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-2 mt-0.5">
              {product.name}
            </h3>

            {/* Included items preview on desktop */}
            {product.includedItems && product.includedItems.length > 0 && !compact && (
              <p className="hidden sm:line-clamp-1 text-[11px] text-cream-400/80 mt-1">
                {product.includedItems.join(' • ')}
              </p>
            )}
          </div>

          {/* Bottom Price & Add to Order Button */}
          <div className="mt-3 pt-2 border-t border-gold-500/15 flex items-center justify-between gap-1.5">
            <div className="flex flex-col">
              <span className="text-[10px] text-cream-400">Price</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs sm:text-sm font-bold text-white">Rs. {product.price}</span>
                {product.originalPrice && (
                  <span className="text-[10px] text-cream-500 line-through">
                    Rs. {product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAdd}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-md ${
                added
                  ? 'bg-brandGreen text-white'
                  : 'bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-obsidian-950'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && (
        <ProductDetailModal
          product={product}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </>
  );
}
