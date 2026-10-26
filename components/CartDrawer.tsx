"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { getCart, updateCartQuantity, clearCart } from '@/lib/db';
import { CartItem } from '@/lib/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const refreshCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener('zk_cart_updated', refreshCart);
    window.addEventListener('storage', refreshCart);

    return () => {
      window.removeEventListener('zk_cart_updated', refreshCart);
    };
  }, []);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const lunchBoxItems = cart.filter((item) => item.product.isLunchBox);
  const totalLunchBoxes = lunchBoxItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasLunchBox = lunchBoxItems.length > 0;
  const isLunchBoxRequirementMet = !hasLunchBox || totalLunchBoxes >= 5;
  const remainingLunchBoxesNeeded = Math.max(0, 5 - totalLunchBoxes);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col text-charcoal-900">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal-950">Your Order Tray</h3>
                <p className="text-xs text-amber-800 font-semibold">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-charcoal-500 hover:text-charcoal-900 rounded-lg hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Minimum Lunch Box Alert */}
          {hasLunchBox && !isLunchBoxRequirementMet && (
            <div className="bg-amber-50 border-b border-amber-200 p-3 px-4 flex items-start gap-2.5 text-xs text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 block font-bold">Lunch Box Minimum Order Notice</strong>
                Lunch box orders require at least <strong>5 boxes</strong> combined. You currently have{' '}
                <span className="text-amber-700 font-extrabold">{totalLunchBoxes}/5</span>. Please add{' '}
                <strong className="underline font-bold">{remainingLunchBoxesNeeded} more</strong> to proceed.
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-charcoal-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-stone-400" />
                </div>
                <h4 className="font-bold text-charcoal-900 text-base mb-1">Your tray is empty</h4>
                <p className="text-xs text-charcoal-600 mb-5 max-w-xs">
                  Discover our homemade lunch boxes and mouth-watering Peshawar curries!
                </p>
                <Link
                  href="/lunch-boxes"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Browse Lunch Boxes
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="pt-3.5 first:pt-0 flex gap-3 items-center">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    <Image
                      src={item.product.thumbnail || '/images/dishes/roti_lunchbox_1.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-charcoal-900 truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-amber-800 font-semibold">Rs. {item.product.price} each</p>
                    {item.product.isLunchBox && (
                      <span className="inline-block text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded mt-0.5 font-bold">
                        🍱 Lunch Box
                      </span>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-amber-100 text-charcoal-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-charcoal-900 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-amber-100 text-charcoal-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, 0)}
                        className="text-red-500 hover:text-red-700 p-1 text-xs ml-auto transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-charcoal-950">
                      Rs. {item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-charcoal-700 font-medium">Food Subtotal:</span>
                <span className="font-black text-charcoal-950 text-base">Rs. {subtotal}</span>
              </div>
              <p className="text-[11px] text-charcoal-500 italic">
                * Delivery charges (Rs. 200–270 in Peshawar) calculated at checkout.
              </p>

              {isLunchBoxRequirementMet ? (
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-98 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl bg-stone-200 text-stone-500 font-bold text-sm cursor-not-allowed"
                >
                  Add {remainingLunchBoxesNeeded} more lunch box(es) to proceed
                </button>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => clearCart()}
                  className="text-[11px] text-charcoal-500 hover:text-red-600 transition-colors font-medium"
                >
                  Clear tray
                </button>
                <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Freshly Prepared Today
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
