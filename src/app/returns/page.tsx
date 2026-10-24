import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RotateCcw, ShieldCheck, MessageCircle, CheckCircle2, ArrowRight, Package, Clock, Sparkles } from 'lucide-react';

export const metadata = {
  title: '30-Day Easy Size Exchange & Return Policy | LittleStyles Kids Wear',
  description: 'Hassle-free 30-day size exchange guarantee for kids wear across Sri Lanka. Simple WhatsApp process and doorstep courier exchange.',
};

export default function ReturnsPage() {
  return (
    <div className="space-y-12 sm:space-y-16 py-10 sm:py-16 bg-[#FAF7F5]">
      {/* 1. Header with Visual Studio Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF758F] bg-[#FFF0F3] px-3.5 py-1 rounded-full border border-rose-100 inline-block">
              WORRY-FREE PARENT PROMISE
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight">
              30-Day Easy Size Exchange & Returns
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Kids grow fast! If an outfit is too snug or roomy, our hassle-free size exchange ensures your little one gets the perfect comfortable fit. We swap sizes right at your doorstep anywhere in Sri Lanka.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/94771234567?text=Hello%20LittleStyles!%20I%20would%20like%20to%20request%20a%20size%20exchange%20for%20my%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Request WhatsApp Exchange</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px] bg-slate-100">
            <Image
              src="/images/products/floral-dress.jpg"
              alt="LittleStyles gentle children's clothing exchange"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 3 Step Exchange Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <span className="w-9 h-9 rounded-2xl bg-[#FFF0F3] text-[#FF758F] font-black text-sm flex items-center justify-center font-sans">
              1
            </span>
            <h3 className="font-serif font-black text-base text-slate-900">Notify Us on WhatsApp</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Send a quick message to our team at <strong>+94 77 123 4567</strong> with your Order Number (e.g. LS-2026-XXXX) and desired replacement size.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <span className="w-9 h-9 rounded-2xl bg-[#FFF0F3] text-[#FF758F] font-black text-sm flex items-center justify-center font-sans">
              2
            </span>
            <h3 className="font-serif font-black text-base text-slate-900">Doorstep Courier Swap</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our courier arrives with the new size and collects the return parcel directly from your doorstep. No post office queues required!
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <span className="w-9 h-9 rounded-2xl bg-[#FFF0F3] text-[#FF758F] font-black text-sm flex items-center justify-center font-sans">
              3
            </span>
            <h3 className="font-serif font-black text-base text-slate-900">Enjoy Perfect Fit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your little adventurer enjoys a comfortable, buttery-soft organic cotton outfit tailored for everyday play and joyful moments.
            </p>
          </div>
        </div>

        {/* Eligibility Checklist */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-serif font-black text-lg text-slate-900 border-b border-slate-100 pb-3">
            Size Exchange Guidelines
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Garments must be unworn and unwashed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Original brand tags attached</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Within 30 days of doorstep parcel delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Available for all 25 Sri Lankan districts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}