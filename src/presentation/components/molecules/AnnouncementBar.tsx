'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, RotateCcw, MessageCircle, HelpCircle, Banknote } from 'lucide-react';

/**
 * AnnouncementBar Molecule
 * Fully responsive without any horizontal overflow on small mobile screens.
 * Removed login requirement (pure guest checkout), highlighting delivery & COD.
 */
export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#FAF8F6] text-slate-600 text-[11px] sm:text-xs py-2 px-3 sm:px-6 lg:px-8 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between gap-3 text-center sm:text-left">
        {/* Primary Delivery Offer - Always centered on mobile, left on desktop */}
        <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 truncate">
          <Truck className="w-3.5 h-3.5 text-[#FF758F] shrink-0" strokeWidth={2} aria-hidden="true" />
          <span className="font-medium text-[11px] sm:text-xs truncate">
            Islandwide Delivery • Free on orders over <strong className="font-bold text-slate-900">Rs. 5,000</strong>
          </span>
        </div>

        {/* Center: Easy Returns (Visible on desktop) */}
        <div className="hidden lg:flex items-center gap-2 font-medium text-slate-600">
          <RotateCcw className="w-3.5 h-3.5 text-[#FF758F] shrink-0" strokeWidth={2} aria-hidden="true" />
          <span>30-Day Easy Size Exchanges</span>
        </div>

        {/* Right: Cash on Delivery & WhatsApp (Hidden on extra small screens to prevent overflow) */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-4 font-medium shrink-0">
          <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Banknote className="w-3 h-3 text-emerald-600" />
            <span>Islandwide COD</span>
          </span>

          <a
            href="https://wa.me/94771234567?text=Hi%20LittleStyles,%20I%20have%20an%20inquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#FF758F] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F] rounded"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">Concierge:</span>
            <span className="font-semibold text-slate-800">+94 77 123 4567</span>
          </a>

          <span className="text-slate-300 hidden md:inline" aria-hidden="true">|</span>

          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-1 hover:text-[#FF758F] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F] rounded"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
