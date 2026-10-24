'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * WhatsApp Concierge Floating Action Button
 * Seamlessly connects Sri Lankan parents to personal styling & Cash on Delivery orders.
 * Elevated z-index with responsive layout protection and keyboard accessibility.
 */
export const WhatsAppButton: React.FC = () => {
  return (
    <aside aria-label="WhatsApp Customer Concierge" className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 group">
      <a
        href="https://wa.me/94771234567?text=Hello%20LittleStyles!%20I%20would%20like%20to%20order%20kids%20wear%20with%20Cash%20on%20Delivery."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs rounded-full shadow-lg shadow-emerald-950/20 transition-all hover:scale-105 active:scale-95 border-2 border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        title="Chat with our Colombo Stylist on WhatsApp"
        aria-label="Contact concierge on WhatsApp (opens in new tab)"
      >
        {/* Pulsing Live Online Indicator */}
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>

        <MessageCircle className="w-4 h-4 fill-white text-[#128C7E] shrink-0" aria-hidden="true" />
        
        <span className="tracking-wide text-[11px] sm:text-xs font-semibold">
          <span className="hidden sm:inline">Order via </span>WhatsApp
        </span>
      </a>
    </aside>
  );
};
