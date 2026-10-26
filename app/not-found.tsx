import Link from 'next/link';
import Image from 'next/image';
import { Home, UtensilsCrossed } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-5">
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500 shadow-md mx-auto">
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
        <span className="text-4xl font-serif font-black text-amber-600">404</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
          Dish or Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-sm mx-auto">
          The page or recipe you are looking for has moved or does not exist. Let&apos;s get you back to our fresh homemade menu!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/lunch-boxes"
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-charcoal-800 border border-stone-200 font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          <UtensilsCrossed className="w-4 h-4 text-amber-600" />
          <span>Browse Lunch Boxes</span>
        </Link>
      </div>
    </div>
  );
}
