"use client";

import React from 'react';

interface ShimmerProps {
  className?: string;
  variant?: 'card' | 'text' | 'image' | 'banner';
}

export default function ShimmerSkeleton({ className = '', variant = 'card' }: ShimmerProps) {
  if (variant === 'banner') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-stone-100 border border-stone-200 ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
      </div>
    );
  }

  if (variant === 'image') {
    return (
      <div className={`relative overflow-hidden bg-stone-100 rounded-xl ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`relative overflow-hidden h-4 rounded bg-stone-200/70 ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white border border-stone-200 p-4 flex flex-col gap-3 shadow-xs ${className}`}>
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-100">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
      </div>
      <div className="h-4 w-3/4 rounded bg-stone-200/70 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
      </div>
      <div className="h-3 w-1/2 rounded bg-stone-200/50 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
      </div>
      <div className="mt-auto flex justify-between items-center pt-2">
        <div className="h-5 w-20 rounded bg-stone-200/70 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
        </div>
        <div className="h-8 w-24 rounded-lg bg-amber-100 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}
