"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { addToCart } from '@/lib/db';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(
    product.isLunchBox ? (product.minimumOrderQuantity || 5) : 1
  );
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, specialInstructions);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="relative w-full max-w-lg bg-obsidian-950 border border-gold-500/30 rounded-3xl shadow-2xl overflow-hidden text-cream-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-cream-200 hover:text-white hover:bg-gold-500/20 transition-colors border border-gold-500/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative w-full h-56 sm:h-64 bg-obsidian-900 overflow-hidden">
          <Image
            src={product.thumbnail || '/images/dishes/roti_lunchbox_1.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="text-xs px-2.5 py-1 rounded-full bg-gold-500 text-obsidian-950 font-bold shadow-md">
              {product.categoryName}
            </span>
            <div className="text-right">
              <span className="text-xl font-extrabold text-white">Rs. {product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-cream-500 line-through ml-2">
                  Rs. {product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-white mb-1.5">{product.name}</h2>
            <p className="text-xs sm:text-sm text-cream-300/90 leading-relaxed">{product.description}</p>
          </div>

          {/* Included Items Checklist */}
          {product.includedItems && product.includedItems.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-obsidian-900 border border-gold-500/20">
              <h4 className="text-xs font-semibold text-gold-300 uppercase tracking-wider mb-2">
                What&apos;s Included In This Dish:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-cream-200">
                {product.includedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Minimum Order Alert for Lunch Boxes */}
          {product.isLunchBox && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-950/60 border border-gold-500/30 text-xs text-gold-200">
              <AlertCircle className="w-4 h-4 text-gold-400 shrink-0" />
              <span>
                Minimum order for lunch boxes is <strong>5 boxes</strong>. (You can mix different lunch box varieties in your order!)
              </span>
            </div>
          )}

          {/* Special Instructions Input */}
          <div>
            <label className="block text-xs font-medium text-cream-400 mb-1">
              Special Instructions (Optional):
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Mild spice, extra napkin, separate salad..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-obsidian-900 border border-gold-500/25 text-white placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>

          {/* Quantity Controls & Action */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-center border border-gold-500/30 rounded-xl bg-obsidian-900 p-1">
              <button
                onClick={() => setQuantity(Math.max(product.isLunchBox ? 5 : 1, quantity - 1))}
                className="p-1.5 text-gold-300 hover:bg-gold-500/20 rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-white min-w-[36px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 text-gold-300 hover:bg-gold-500/20 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg ${
                added
                  ? 'bg-brandGreen text-white'
                  : 'bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-obsidian-950 shadow-gold-500/20'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Order Tray!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add (Rs. {product.price * quantity})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
