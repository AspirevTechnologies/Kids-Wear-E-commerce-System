'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/core/entities/Product';
import { ProductCard } from '@/presentation/components/molecules/ProductCard';
import { ArrowRight } from 'lucide-react';

interface NewArrivalsSectionProps {
  products: Product[];
}

/**
 * NewArrivalsSection Organism
 * Restores the preferred generous 2-line product showcase (4 columns x 2 rows on desktop = 8 products)
 * with original card sizing and completely borderless cards (no black outlines).
 */
export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products }) => {
  // Show 8 products across 2 full lines on desktop (4 per row)
  const displayProducts = products.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8" aria-label="New arrivals">
      {/* Section Header matching Reference Image */}
      <div className="relative flex flex-col items-center justify-center">
        <div className="text-center space-y-1">
          <h2 className="text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-slate-800 flex items-center justify-center gap-2.5">
            <span className="text-[#FF758F] text-base leading-none">♡</span>
            <span>NEW ARRIVALS</span>
            <span className="text-[#FF758F] text-base leading-none">♡</span>
          </h2>
          <div className="flex justify-center">
            <span className="text-[#FF758F] text-[10px] leading-none opacity-80">♡</span>
          </div>
        </div>

        {/* View All Products Link (Positioned on the right matching Reference) */}
        <div className="w-full sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 flex justify-end mt-2 sm:mt-0">
          <Link
            href="/products"
            className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 hover:text-[#FF758F] flex items-center gap-1 transition-colors"
          >
            <span>VIEW ALL PRODUCTS</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Two-Line Product Showcase: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
        {displayProducts.map((product) => (
          <div key={product.id} className="min-w-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Mobile-Friendly View All Outfits Button */}
      <div className="sm:hidden pt-2 text-center">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <span>View All Outfits ({products.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
};
