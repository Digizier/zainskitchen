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

  // Sync cart badge
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

  // Don't render public header inside admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-obsidian-950 via-gold-900 to-obsidian-950 text-gold-200 text-xs py-1.5 px-4 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gold-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Ordering Window: <strong className="text-white">10:00 AM – 12:00 PM</strong>
            </span>
            <span className="hidden md:flex items-center gap-1 text-cream-400">
              <MapPin className="w-3 h-3 text-gold-400" />
              Peshawar, Pakistan
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-gold-300/80">Ghar jaisa khana, ab aapke liye har roz!</span>
            <a
              href="https://wa.me/923038835378"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gold-300 transition-colors font-semibold flex items-center gap-1"
            >
              <span>0303-8835378</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-obsidian-950/95 backdrop-blur-md shadow-xl shadow-black/60 border-b border-gold-500/25 py-2'
            : 'bg-obsidian-900/90 backdrop-blur-sm border-b border-gold-500/15 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-gold-500 shadow-md shadow-gold-500/20 group-hover:scale-105 transition-transform duration-300">
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
                <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-200">
                  ZAIN&apos;S KITCHEN
                </span>
                <span className="text-[10px] text-gold-300/80 tracking-wider uppercase font-medium">
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
                    className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-gold-300 bg-gold-500/15 border border-gold-500/30'
                        : 'text-cream-200 hover:text-gold-300 hover:bg-obsidian-800'
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
                className="p-2 text-cream-300 hover:text-gold-300 hover:bg-obsidian-800 rounded-lg transition-colors border border-gold-500/10"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Order on WhatsApp Button (Desktop) */}
              <a
                href="https://wa.me/923038835378?text=Assalam-o-Alaikum%20Zain's%20Kitchen!%20I%20would%20like%20to%20inquire%20about%20ordering."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brandGreen hover:bg-brandGreen/90 text-white shadow-md shadow-brandGreen/20 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order on WhatsApp</span>
              </a>

              {/* Cart / Order Tray Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="View Order Tray"
                className="relative p-2 text-cream-100 hover:text-gold-300 bg-obsidian-800 hover:bg-obsidian-700 border border-gold-500/30 rounded-xl transition-all shadow-md active:scale-95"
              >
                <ShoppingBag className="w-5 h-5 text-gold-400" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-obsidian-950 animate-pulse">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                className="lg:hidden p-2 text-cream-200 hover:text-gold-300 bg-obsidian-800 rounded-lg border border-gold-500/20"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-obsidian-950/98 border-b border-gold-500/30 px-4 pt-3 pb-5 mt-2 animate-fadeIn shadow-2xl">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-gold-300 bg-gold-500/15 border border-gold-500/30 font-semibold'
                        : 'text-cream-200 hover:bg-obsidian-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-gold-500/20 mt-2 flex flex-col gap-2">
                <a
                  href="https://wa.me/923038835378?text=Assalam-o-Alaikum%20Zain's%20Kitchen!%20I%20would%20like%20to%20inquire%20about%20ordering."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brandGreen text-white text-sm font-semibold shadow-md"
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
