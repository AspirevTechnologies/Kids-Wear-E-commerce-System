import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, Sparkles, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

/**
 * HeroSection Organism - High-End Sri Lankan Kids Boutique Hero
 * Perfectly responsive on mobile (320px–420px) and desktop (1024px+).
 * Headline matches reference image: Didone serif bold, upright coral-pink serif on line 2, no full stops, with ♡.
 * Paragraph is concise and elegant (14 words); features sit cleanly without photo overlap or truncation.
 */
export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-[#FAF7F5] overflow-hidden border-b border-rose-100/60 w-full max-w-full">
      {/* Desktop Full-Bleed Kids Visual (Right 52% of section) */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[52%] z-0 pointer-events-none select-none">
        <Image
          src="/images/hero-kids.jpg"
          alt="LittleStyles kids smiling in pastel boutique clothing"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-top"
        />
        {/* Smooth soft edge feather into the warm cream canvas */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAF7F5] via-[#FAF7F5]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF7F5] to-transparent" />

        {/* Floating Circular Summer Collection Badge */}
        <div className="absolute top-10 right-10 w-26 h-26 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-md flex flex-col items-center justify-center text-center p-2 z-10 select-none">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">NEW</span>
          <span className="text-[10px] font-black uppercase text-slate-900 leading-tight mt-1">SUMMER<br />COLLECTION</span>
          <span className="text-[9px] font-extrabold text-slate-500 mt-0.5">2026</span>
          <span className="text-[#FF758F] text-xs leading-none mt-0.5">♡</span>
        </div>
      </div>

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16">
        <div className="max-w-xl space-y-5 sm:space-y-6 text-center lg:text-left mx-auto lg:mx-0">
          {/* Eyebrow Tracked Subtitle matching Reference */}
          <span className="text-[10.5px] sm:text-xs font-bold tracking-[0.2em] uppercase text-slate-400 block">
            TRENDY. COMFY. ADORABLE.
          </span>

          {/* Boutique Headline matching Reference Image Font Style (No full stops, pink on 2nd line) */}
          <h1 className="text-[36px] sm:text-[46px] md:text-[54px] lg:text-[60px] font-black tracking-tight leading-[1.08] text-slate-900 font-serif">
            <span>Little Outfits</span>
            <br />
            <span className="text-[#FF758F] font-serif font-black inline-block mt-0.5 sm:mt-1">
              Big Adventures
            </span>{' '}
            <span className="text-[#FF758F] font-light text-2xl sm:text-3xl lg:text-4xl inline-block -translate-y-1 select-none">
              ♡
            </span>
          </h1>

          {/* Concise, punchy 1-2 line boutique description (Short, punchy, elegant) */}
          <p className="text-xs sm:text-sm md:text-[15px] text-slate-600 max-w-md mx-auto lg:mx-0 leading-relaxed font-normal">
            Handcrafted pure organic cotton outfits, lovingly tailored for tropical sunshine and gentle baby skin.
          </p>

          {/* Dual Action Buttons (Mobile-first responsive wrapping) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1">
            <Link
              href="/products"
              className="px-8 py-3.5 bg-[#FF758F] hover:bg-[#F0627D] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F]"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/products?filter=new"
              className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs uppercase tracking-wider rounded-lg border border-slate-300 shadow-2xs transition-all hover:border-slate-800 active:scale-98 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              EXPLORE NEW ARRIVALS
            </Link>
          </div>

          {/* Mobile Full-Width Visual Container */}
          <div className="lg:hidden mt-6 relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] shadow-sm border border-slate-200/80 max-w-md mx-auto">
            <Image
              src="/images/hero-kids.jpg"
              alt="LittleStyles kids in pastel boutique outfits"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 448px"
              className="object-cover object-top"
            />
            {/* Mobile Collection Floating Badge */}
            <div className="absolute top-3 right-3 w-18 h-18 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center p-1 select-none">
              <span className="text-[7px] font-extrabold uppercase tracking-widest text-slate-400">NEW</span>
              <span className="text-[7.5px] font-black uppercase text-slate-800 leading-tight">SUMMER<br />DROP</span>
              <span className="text-[7.5px] font-extrabold text-[#FF758F]">2026 ♡</span>
            </div>
          </div>

          {/* 4 Feature Items Strip (No truncation, clean labels) */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3 text-left">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Tag className="w-3.5 h-3.5" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Trendy Collections</h4>
                <p className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5">New styles weekly</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Premium Quality</h4>
                <p className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5">Soft, safe & pure</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Safe for Kids</h4>
                <p className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5">100% hypoallergenic</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Truck className="w-3.5 h-3.5" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Islandwide COD</h4>
                <p className="text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5">Free over Rs. 5K</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
