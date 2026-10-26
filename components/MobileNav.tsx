"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, Package, ShoppingBag, MessageCircle } from 'lucide-react';
import { getCart } from '@/lib/db';
import CartDrawer from './CartDrawer';

export default function MobileNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const items = getCart();
      const count = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    };

    updateCount();
    window.addEventListener('zk_cart_updated', updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('zk_cart_updated', updateCount);
    };
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Lunch Boxes', href: '/lunch-boxes', icon: Package },
    { label: 'Full Menu', href: '/menu', icon: UtensilsCrossed },
  ];

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-2 py-1.5 shadow-[0_-4px_15px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center gap-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  isActive ? 'text-amber-700 font-bold' : 'text-charcoal-600 hover:text-amber-700'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-amber-100 text-amber-800' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Cart Tray Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-charcoal-600 hover:text-amber-700 relative transition-all"
          >
            <div className="relative p-1">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight text-amber-700 font-semibold">Cart Tray</span>
          </button>

          {/* WhatsApp Direct Order Button */}
          <a
            href="https://wa.me/923038835378?text=Assalam-o-Alaikum%20Zain's%20Kitchen!%20I%20would%20like%20to%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1 text-brandGreen hover:opacity-90 transition-all"
          >
            <div className="p-1 rounded-lg bg-green-50">
              <MessageCircle className="w-5 h-5 fill-brandGreen text-brandGreen" />
            </div>
            <span className="text-[10px] mt-0.5 font-bold tracking-tight text-brandGreen">WhatsApp</span>
          </a>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
