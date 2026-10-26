import Link from 'next/link';
import Image from 'next/image';
import { Home, UtensilsCrossed } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-5">
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold-500 shadow-xl shadow-gold-500/20 mx-auto">
        <Image
          src="/branding/zains_kitchen_logo.jpg"
          alt="Zain's Kitchen Logo"
          width={80}
          height={80}
          className="object-cover w-full h-full"
          unoptimized
        />
      </div>

      <div className="space-y-1">
        <span className="text-4xl font-serif font-black text-gold-400">404</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Dish or Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-cream-400 max-w-sm mx-auto">
          The page or recipe you are looking for has moved or does not exist. Let&apos;s get you back to our fresh homemade menu!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:brightness-110 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/lunch-boxes"
          className="px-5 py-2.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-cream-200 border border-gold-500/20 font-semibold text-xs flex items-center gap-2 transition-colors"
        >
          <UtensilsCrossed className="w-4 h-4 text-gold-400" />
          <span>Browse Lunch Boxes</span>
        </Link>
      </div>
    </div>
  );
}
