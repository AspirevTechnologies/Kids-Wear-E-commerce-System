'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  variant?: 'navbar' | 'footer' | 'compact';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * BrandLogo - Luxury Sri Lankan Kids Boutique Identity
 * Features an artisanal royal tiara crest with gold-rose accents and high-fashion serif typography.
 * Responsive sizing guarantees no clipping or horizontal overflow on 320px–375px mobile screens.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 sm:gap-2.5 group shrink-0 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F] focus-visible:ring-offset-2 rounded-xl p-0.5 ${className}`}
      aria-label="LittleStyles Home"
    >
      {/* 1. Artisanal Luxury Crest Tiara Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#FF758F]"
          aria-hidden="true"
        >
          {/* Tiara Arch Base */}
          <path
            d="M6 23C11 25 21 25 26 23C25 25 20 26.5 16 26.5C12 26.5 7 25 6 23Z"
            fill="#FF758F"
            fillOpacity="0.2"
          />
          <path
            d="M5 22.5C10 24.5 22 24.5 27 22.5"
            stroke="#FF758F"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Royal Crown Peaks */}
          <path
            d="M6 22L7.5 12L12 17L16 8L20 17L24.5 12L26 22"
            stroke="#FF758F"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Crown Pearls */}
          <circle cx="7.5" cy="10.5" r="1.3" fill="#FF758F" />
          <circle cx="16" cy="6.5" r="1.6" fill="#FF758F" />
          <circle cx="24.5" cy="10.5" r="1.3" fill="#FF758F" />
          {/* Center Heart / Sparkle */}
          <path
            d="M16 14.5L17.2 16.2L16 17.8L14.8 16.2L16 14.5Z"
            fill="#FF758F"
          />
        </svg>
      </div>

      {/* 2. Brand Wordmark & Atelier Subtitle */}
      <div className="flex flex-col">
        <span className="font-serif font-black text-[16px] sm:text-[19px] md:text-[22px] tracking-[0.1em] sm:tracking-[0.14em] text-slate-900 group-hover:text-black transition-colors uppercase leading-none">
          LITTLESTYLES
        </span>
        <span className="text-[7px] sm:text-[8px] md:text-[8.5px] tracking-[0.18em] sm:tracking-[0.22em] uppercase font-bold text-[#FF758F] leading-none mt-1 sm:mt-1.5">
          {variant === 'footer' ? 'FASHION FOR LITTLE ONES' : 'FASHION FOR LITTLE ONES'}
        </span>
      </div>
    </Link>
  );
};
