"use client";

import React from 'react';

interface ShimmerProps {
  className?: string;
  variant?: 'card' | 'text' | 'image' | 'banner';
}

export default function ShimmerSkeleton({ className = '', variant = 'card' }: ShimmerProps) {
  if (variant === 'banner') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-obsidian-800 border border-gold-500/20 ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
      </div>
    );
  }

  if (variant === 'image') {
    return (
      <div className={`relative overflow-hidden bg-obsidian-850 rounded-xl ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gold-500/15 to-transparent" />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`relative overflow-hidden h-4 rounded bg-obsidian-700/60 ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-obsidian-800 border border-gold-500/15 p-4 flex flex-col gap-3 ${className}`}>
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-obsidian-850">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      </div>
      <div className="h-4 w-3/4 rounded bg-obsidian-700/60 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
      </div>
      <div className="h-3 w-1/2 rounded bg-obsidian-700/40 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
      </div>
      <div className="mt-auto flex justify-between items-center pt-2">
        <div className="h-5 w-20 rounded bg-gold-500/20 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>
        <div className="h-8 w-24 rounded-lg bg-gold-500/30 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}
