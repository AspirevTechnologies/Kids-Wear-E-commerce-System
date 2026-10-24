import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, ShieldCheck, Truck, ArrowRight, Award, CheckCircle2, Leaf, Clock, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Our Story & Heritage | LittleStyles Luxury Kids Wear',
  description: 'Learn about LittleStyles Sri Lanka - crafting pure hypoallergenic organic cotton clothing for infants, toddlers, and little adventurers.',
};

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-10 sm:py-16 bg-[#FAF7F5]">
      {/* 1. Hero Editorial Section with Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF758F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Boutique Story • Est. 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight leading-[1.12]">
              Handcrafted Outfits for Life&apos;s Little Adventures
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Founded with a parent’s love in Colombo, LittleStyles was born from a simple belief: children deserve clothes that feel as gentle as a parent&apos;s hug. We craft 100% hypoallergenic, breathable garments tailored specially for tropical warmth and delicate toddler skin.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% GOTS Organic Cotton</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Non-Toxic Natural Dyes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>25 Districts Islandwide COD</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FF758F] hover:bg-[#F0627D] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-500/20 active:scale-98"
              >
                <span>Discover Our Outfits</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Studio Image Column */}
          <div className="lg:col-span-5 relative h-80 sm:h-96 lg:h-full min-h-[420px] bg-slate-100">
            <Image
              src="/images/products/celebration_lounge_set_boy.jpg"
              alt="LittleStyles handcrafted kids wear photography"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg text-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#FF758F] flex items-center justify-center font-bold shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#FF758F] block">Purity Standard</span>
                  <p className="text-xs font-bold text-slate-900">Hypoallergenic & Rash-Free Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Craftsmanship & Heritage Split Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Secondary Studio Image */}
          <div className="lg:col-span-5 relative h-80 sm:h-96 lg:h-[460px] rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
            <Image
              src="/images/products/denim-overalls-studio.jpg"
              alt="Artisanal tailoring and stitching for kids outfits"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center"
            />
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 text-[11px] font-black text-slate-900 uppercase tracking-wider">
              Colombo Atelier
            </div>
          </div>

          {/* Heritage Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF758F] block">
              OUR ARTISANAL HERITAGE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight leading-tight">
              Designed in Colombo, Tailored for Gentle Skin
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every LittleStyles garment begins with hand-selected long-staple organic cotton yarns. We omit synthetic elastanes and scratchy polyester threads, opting instead for natural coconut shell buttons, enclosed seam linings, and gentle elastic waistbands that never pinch.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              From newborn organic rompers to celebration party frocks, each piece is pre-washed in chemical-free botanical baths so it arrives cloud-soft and ready to wear straight out of the boutique delivery box.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                <span className="font-serif font-black text-2xl text-slate-900">0% Azo Dyes</span>
                <p className="text-xs text-slate-500">Only baby-safe, skin-friendly natural colorants.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                <span className="font-serif font-black text-2xl text-[#FF758F]">100% GOTS</span>
                <p className="text-xs text-slate-500">Global Organic Textile Standard combed fibers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Values Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF758F] block">
            OUR THREE PILLARS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Why Sri Lankan Families Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 hover:border-[#FF758F]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#FF758F] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-black text-lg text-slate-900">100% Pure Organic Cotton</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every garment is made from GOTS-certified combed organic cotton, free from harsh chemicals, ensuring sensitive toddler skin remains calm, cool, and rash-free.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 hover:border-[#FF758F]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-black text-lg text-slate-900">Artisanal Sri Lankan Craft</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Each stitch, wooden button, and ruffled hem is thoughtfully finished by skilled local garment artisans, pairing timeless European boutique elegance with everyday comfort.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 hover:border-[#FF758F]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-black text-lg text-slate-900">Islandwide Doorstep Trust</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We deliver nationwide across all 25 Sri Lankan districts with hassle-free Cash on Delivery (COD), verified manual bank transfers, and 30-day easy size exchanges.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Stats Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="font-serif font-black text-3xl sm:text-4xl text-slate-900 block">5,000+</span>
              <span className="text-xs font-semibold text-slate-600">Happy Parents in Sri Lanka</span>
            </div>
            <div className="space-y-1">
              <span className="font-serif font-black text-3xl sm:text-4xl text-[#FF758F] block">25</span>
              <span className="text-xs font-semibold text-slate-600">Districts Islandwide Delivery</span>
            </div>
            <div className="space-y-1">
              <span className="font-serif font-black text-3xl sm:text-4xl text-slate-900 block">100%</span>
              <span className="text-xs font-semibold text-slate-600">Hypoallergenic Fabrics</span>
            </div>
            <div className="space-y-1">
              <span className="font-serif font-black text-3xl sm:text-4xl text-emerald-600 block">4.9 ★</span>
              <span className="text-xs font-semibold text-slate-600">Customer Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Call to Action Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-14 text-center space-y-6">
          <Image
            src="/images/banners/spring-sale.jpg"
            alt="LittleStyles spring kids collection"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-300 block">
              READY FOR PLAYTIME
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-white">
              Dress Your Little One in Pure Comfort
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Explore our boutique collection of rompers, frocks, tees, and cozy lounge sets with convenient Islandwide Cash on Delivery.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF758F] hover:bg-[#F0627D] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-500/30 active:scale-98"
              >
                <span>Shop All Kids Outfits</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}