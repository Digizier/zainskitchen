"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, Check, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden text-charcoal-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-charcoal-700 hover:text-black hover:bg-stone-100 transition-colors border border-stone-200 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative w-full h-56 sm:h-64 bg-stone-100 overflow-hidden">
          <Image
            src={product.thumbnail || '/images/dishes/roti_lunchbox_1.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-600 text-white font-bold shadow-sm">
              {product.categoryName}
            </span>
            <div className="text-right">
              <span className="text-xl font-black text-white drop-shadow">Rs. {product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-white/80 line-through ml-2">
                  Rs. {product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal-950 mb-1.5">{product.name}</h2>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Included Items Checklist */}
          {product.includedItems && product.includedItems.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                What&apos;s Included In This Dish:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-charcoal-700 font-medium">
                {product.includedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Minimum Order Alert */}
          {product.isLunchBox && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Minimum order for lunch boxes is <strong>5 boxes</strong>. (You can mix different lunch box varieties in your order!)
              </span>
            </div>
          )}

          {/* Special Instructions Input */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Special Instructions (Optional):
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Mild spice, extra napkin, separate salad..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          {/* Quantity Controls & Action */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
              <button
                onClick={() => setQuantity(Math.max(product.isLunchBox ? 5 : 1, quantity - 1))}
                className="p-1.5 text-charcoal-700 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-charcoal-900 min-w-[36px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 text-charcoal-700 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md ${
                added
                  ? 'bg-brandGreen text-white'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20'
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
