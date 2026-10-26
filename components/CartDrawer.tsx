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

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Enforce 5 lunchbox minimum rule across all lunchbox varieties
  const lunchBoxItems = cart.filter((item) => item.product.isLunchBox);
  const totalLunchBoxes = lunchBoxItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasLunchBox = lunchBoxItems.length > 0;
  const isLunchBoxRequirementMet = !hasLunchBox || totalLunchBoxes >= 5;
  const remainingLunchBoxesNeeded = Math.max(0, 5 - totalLunchBoxes);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-obsidian-950 border-l border-gold-500/25 shadow-2xl flex flex-col text-cream-100">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gold-500/20 flex items-center justify-between bg-obsidian-900">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Your Order Tray</h3>
                <p className="text-xs text-gold-300">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-cream-400 hover:text-white rounded-lg hover:bg-obsidian-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Minimum Lunch Box Requirement Alert */}
          {hasLunchBox && !isLunchBoxRequirementMet && (
            <div className="bg-amber-950/80 border-b border-gold-500/40 p-3 px-4 flex items-start gap-2.5 text-xs text-gold-200">
              <AlertCircle className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Lunch Box Minimum Order Notice</strong>
                Lunch box orders require at least <strong>5 boxes</strong> combined. You currently have{' '}
                <span className="text-gold-300 font-bold">{totalLunchBoxes}/5</span>. Please add{' '}
                <strong className="text-white underline">{remainingLunchBoxesNeeded} more</strong> to proceed.
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-gold-500/10">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-cream-400">
                <div className="w-16 h-16 rounded-full bg-obsidian-850 border border-gold-500/20 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-gold-500/40" />
                </div>
                <h4 className="font-medium text-white text-base mb-1">Your tray is empty</h4>
                <p className="text-xs text-cream-400/80 mb-5 max-w-xs">
                  Discover our homemade lunch boxes and mouth-watering Peshawar curries!
                </p>
                <Link
                  href="/lunch-boxes"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all"
                >
                  Browse Lunch Boxes
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="pt-3.5 first:pt-0 flex gap-3 items-center">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-obsidian-850 border border-gold-500/20 shrink-0">
                    <Image
                      src={item.product.thumbnail || '/images/dishes/roti_lunchbox_1.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-gold-300 font-medium">Rs. {item.product.price} each</p>
                    {item.product.isLunchBox && (
                      <span className="inline-block text-[9px] bg-gold-500/20 text-gold-300 px-1.5 py-0.5 rounded mt-0.5 border border-gold-500/30">
                        🍱 Lunch Box
                      </span>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gold-500/30 rounded-lg bg-obsidian-900 overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-gold-500/20 text-gold-300 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-white min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-gold-500/20 text-gold-300 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, 0)}
                        className="text-red-400/80 hover:text-red-300 p-1 text-xs ml-auto transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-white">
                      Rs. {item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gold-500/20 bg-obsidian-900 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-cream-400">Food Subtotal:</span>
                <span className="font-bold text-white text-base">Rs. {subtotal}</span>
              </div>
              <p className="text-[11px] text-cream-400/80 italic">
                * Delivery charges (Rs. 200–270 in Peshawar) calculated at checkout.
              </p>

              {isLunchBoxRequirementMet ? (
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-obsidian-950 font-bold text-sm shadow-xl shadow-gold-500/20 hover:brightness-110 active:scale-98 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl bg-obsidian-700 text-cream-500 font-bold text-sm cursor-not-allowed opacity-80"
                >
                  Add {remainingLunchBoxesNeeded} more lunch box(es) to proceed
                </button>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => clearCart()}
                  className="text-[11px] text-cream-400 hover:text-red-400 transition-colors"
                >
                  Clear tray
                </button>
                <span className="text-[11px] text-gold-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Freshly Prepared Today
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
