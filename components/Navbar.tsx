"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, MessageCircle, Menu as MenuIcon, X, Clock, MapPin, Search } from 'lucide-react';
import { getCart } from '@/lib/db';
import { CartItem } from '@/lib/types';
import CartDrawer from './CartDrawer';
import SmartSearchModal from './SmartSearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setCartItems(getCart());

    const handleCartUpdate = (e: any) => {
      setCartItems(e.detail || getCart());
    };

    window.addEventListener('zk_cart_updated', handleCartUpdate);
    window.addEventListener('storage', () => setCartItems(getCart()));

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('zk_cart_updated', handleCartUpdate);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Lunch Boxes', href: '/lunch-boxes' },
    { label: 'Full Menu', href: '/menu' },
    { label: 'Add-ons', href: '/add-ons' },
    { label: 'Catering & Office', href: '/catering' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-50 via-warm-100 to-amber-50 text-charcoal-700 text-xs py-1.5 px-4 border-b border-amber-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-900 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Ordering Window: <strong className="text-charcoal-900 font-bold">10:00 AM – 12:00 PM</strong>
            </span>
            <span className="hidden md:flex items-center gap-1 text-charcoal-600">
              <MapPin className="w-3 h-3 text-amber-600" />
              Peshawar, Pakistan
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-amber-950/80 font-medium">Ghar jaisa khana, ab aapke liye har roz!</span>
            <a
              href="https://wa.me/923038835378"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 transition-colors"
            >
              <span>0303-8835378</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar (Light, Crisp Restaurant Aesthetic) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-stone-200/80 py-2'
            : 'bg-white/90 backdrop-blur-sm border-b border-stone-100 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-gold-500 shadow-md group-hover:scale-105 transition-transform duration-300 bg-white">
                <Image
                  src="/branding/zains_kitchen_logo.jpg"
                  alt="Zain's Kitchen Logo"
                  width={52}
                  height={52}
                  className="object-cover w-full h-full"
                  priority
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-black tracking-wide text-charcoal-900 group-hover:text-amber-700 transition-colors">
                  ZAIN&apos;S KITCHEN
                </span>
                <span className="text-[10px] text-amber-700 tracking-wider uppercase font-semibold">
                  Where Taste Meets Passion
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-amber-800 bg-amber-50/90 border border-amber-200/80 shadow-xs'
                        : 'text-charcoal-700 hover:text-amber-700 hover:bg-stone-100/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search dishes"
                className="p-2 text-charcoal-700 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200/70"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Order on WhatsApp Button */}
              <a
                href="https://wa.me/923038835378?text=Assalam-o-Alaikum%20Zain's%20Kitchen!%20I%20would%20like%20to%20inquire%20about%20ordering."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-brandGreen hover:bg-green-700 text-white shadow-sm transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order on WhatsApp</span>
              </a>

              {/* Cart / Order Tray Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="View Order Tray"
                className="relative p-2 text-charcoal-800 hover:text-amber-700 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/90 rounded-xl transition-all shadow-xs active:scale-95"
              >
                <ShoppingBag className="w-5 h-5 text-amber-700" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow border-2 border-white animate-pulse">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                className="lg:hidden p-2 text-charcoal-800 hover:text-amber-700 bg-stone-100 rounded-lg border border-stone-200"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/98 border-b border-stone-200 px-4 pt-3 pb-5 mt-2 animate-fadeIn shadow-xl">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      isActive
                        ? 'text-amber-800 bg-amber-50 border border-amber-200'
                        : 'text-charcoal-800 hover:bg-stone-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-stone-200 mt-2 flex flex-col gap-2">
                <a
                  href="https://wa.me/923038835378?text=Assalam-o-Alaikum%20Zain's%20Kitchen!%20I%20would%20like%20to%20inquire%20about%20ordering."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brandGreen text-white text-sm font-bold shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Order on WhatsApp (0303-8835378)
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Slide-out Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Smart Search Modal */}
      {isSearchOpen && <SmartSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
