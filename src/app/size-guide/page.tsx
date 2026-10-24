'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Ruler, Sparkles, Check, ArrowRight, PhoneCall, HelpCircle, Heart } from 'lucide-react';

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [activeTab, setActiveTab] = useState<'baby' | 'toddler' | 'junior'>('toddler');

  const babySizes = [
    {
      size: '0-3M',
      height: unit === 'cm' ? '50 - 62 cm' : '20 - 24.5 in',
      chest: unit === 'cm' ? '40 - 43 cm' : '15.5 - 17 in',
      waist: unit === 'cm' ? '38 - 41 cm' : '15 - 16 in',
      weight: unit === 'cm' ? '3.0 - 5.5 kg' : '6.5 - 12 lbs',
    },
    {
      size: '3-6M',
      height: unit === 'cm' ? '62 - 68 cm' : '24.5 - 27 in',
      chest: unit === 'cm' ? '43 - 46 cm' : '17 - 18 in',
      waist: unit === 'cm' ? '41 - 43 cm' : '16 - 17 in',
      weight: unit === 'cm' ? '5.5 - 7.5 kg' : '12 - 16.5 lbs',
    },
    {
      size: '6-12M',
      height: unit === 'cm' ? '68 - 80 cm' : '27 - 31.5 in',
      chest: unit === 'cm' ? '46 - 49 cm' : '18 - 19.5 in',
      waist: unit === 'cm' ? '43 - 45 cm' : '17 - 17.5 in',
      weight: unit === 'cm' ? '7.5 - 10.0 kg' : '16.5 - 22 lbs',
    },
    {
      size: '12-18M',
      height: unit === 'cm' ? '80 - 86 cm' : '31.5 - 34 in',
      chest: unit === 'cm' ? '49 - 51 cm' : '19.5 - 20 in',
      waist: unit === 'cm' ? '45 - 47 cm' : '17.5 - 18.5 in',
      weight: unit === 'cm' ? '10.0 - 12.0 kg' : '22 - 26 lbs',
    },
    {
      size: '18-24M',
      height: unit === 'cm' ? '86 - 92 cm' : '34 - 36 in',
      chest: unit === 'cm' ? '51 - 53 cm' : '20 - 21 in',
      waist: unit === 'cm' ? '47 - 49 cm' : '18.5 - 19.5 in',
      weight: unit === 'cm' ? '12.0 - 14.0 kg' : '26 - 31 lbs',
    },
  ];

  const toddlerSizes = [
    {
      size: '2-3Y',
      height: unit === 'cm' ? '92 - 98 cm' : '36 - 38.5 in',
      chest: unit === 'cm' ? '53 - 55 cm' : '21 - 21.5 in',
      waist: unit === 'cm' ? '49 - 51 cm' : '19.5 - 20 in',
      weight: unit === 'cm' ? '13 - 15 kg' : '28 - 33 lbs',
    },
    {
      size: '3-4Y',
      height: unit === 'cm' ? '98 - 104 cm' : '38.5 - 41 in',
      chest: unit === 'cm' ? '55 - 57 cm' : '21.5 - 22.5 in',
      waist: unit === 'cm' ? '51 - 53 cm' : '20 - 21 in',
      weight: unit === 'cm' ? '15 - 17 kg' : '33 - 37 lbs',
    },
    {
      size: '4-5Y',
      height: unit === 'cm' ? '104 - 110 cm' : '41 - 43.5 in',
      chest: unit === 'cm' ? '57 - 59 cm' : '22.5 - 23 in',
      waist: unit === 'cm' ? '53 - 55 cm' : '21 - 21.5 in',
      weight: unit === 'cm' ? '17 - 19 kg' : '37 - 42 lbs',
    },
    {
      size: '5-6Y',
      height: unit === 'cm' ? '110 - 116 cm' : '43.5 - 45.5 in',
      chest: unit === 'cm' ? '59 - 61 cm' : '23 - 24 in',
      waist: unit === 'cm' ? '55 - 57 cm' : '21.5 - 22.5 in',
      weight: unit === 'cm' ? '19 - 22 kg' : '42 - 48 lbs',
    },
  ];

  const juniorSizes = [
    {
      size: '6-7Y',
      height: unit === 'cm' ? '116 - 122 cm' : '45.5 - 48 in',
      chest: unit === 'cm' ? '61 - 63 cm' : '24 - 25 in',
      waist: unit === 'cm' ? '57 - 58 cm' : '22.5 - 23 in',
      weight: unit === 'cm' ? '22 - 25 kg' : '48 - 55 lbs',
    },
    {
      size: '7-8Y',
      height: unit === 'cm' ? '122 - 128 cm' : '48 - 50.5 in',
      chest: unit === 'cm' ? '63 - 66 cm' : '25 - 26 in',
      waist: unit === 'cm' ? '58 - 60 cm' : '23 - 23.5 in',
      weight: unit === 'cm' ? '25 - 29 kg' : '55 - 64 lbs',
    },
    {
      size: '8-10Y',
      height: unit === 'cm' ? '128 - 140 cm' : '50.5 - 55 in',
      chest: unit === 'cm' ? '66 - 71 cm' : '26 - 28 in',
      waist: unit === 'cm' ? '60 - 64 cm' : '23.5 - 25 in',
      weight: unit === 'cm' ? '29 - 36 kg' : '64 - 79 lbs',
    },
  ];

  const currentSizes = activeTab === 'baby' ? babySizes : activeTab === 'toddler' ? toddlerSizes : juniorSizes;

  return (
    <div className="space-y-12 sm:space-y-16 py-10 sm:py-16 bg-[#FAF7F5]">
      {/* 1. Header with Visual Studio Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF758F] bg-[#FFF0F3] px-3.5 py-1 rounded-full border border-rose-100 inline-block">
              FIT & MEASUREMENT GUIDE
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight">
              LittleStyles Perfect Fit Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Our handcrafted kids garments are tailored with gentle relaxed fits accommodating natural toddler and child growth. Remember, our 30-day doorstep exchange makes sizing completely stress-free!
            </p>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-700 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Relaxed Play-Ready Fit</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-rose-700">
                <Heart className="w-4 h-4 text-[#FF758F]" />
                <span>Zero Scratchy Seams</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[280px] bg-slate-100">
            <Image
              src="/images/products/curly-girl-dress.jpg"
              alt="Kids fit and sizing studio measurement"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Unit Selector & Tab Switcher */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('baby')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'baby'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Baby (0-24M)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('toddler')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'toddler'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Toddlers (2-6Y)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('junior')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'junior'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Juniors (6-10Y)
            </button>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                unit === 'cm' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Centimeters (cm)
            </button>
            <button
              type="button"
              onClick={() => setUnit('in')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                unit === 'in' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Inches (in)
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F5] border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-600">
                  <th className="py-4 px-6">Label Size</th>
                  <th className="py-4 px-6">Height Range</th>
                  <th className="py-4 px-6">Chest Measurement</th>
                  <th className="py-4 px-6">Waist Circumference</th>
                  <th className="py-4 px-6">Approx. Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
                {currentSizes.map((row, idx) => (
                  <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-[#FF758F] bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/80">
                        {row.size}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">{row.height}</td>
                    <td className="py-4 px-6">{row.chest}</td>
                    <td className="py-4 px-6">{row.waist}</td>
                    <td className="py-4 px-6 text-slate-500">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Measurement Tips Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF758F] flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900">Measure Chest</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Place a flexible measuring tape directly under the armpits and wrap around the fullest part of the chest, keeping tape level.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900">When in Doubt, Size Up</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Toddlers grow fast! If your child’s height or chest measurement falls near the upper limit, we recommend selecting the next size up.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900">Doorstep Size Swap</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Try the clothes on at home with tags attached. If you need a size adjustment, our courier will deliver the replacement right away.
            </p>
          </div>
        </div>

        {/* Bottom Contact Help */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Still unsure about the best size for your little one?{' '}
            <a
              href="https://wa.me/94771234567?text=Hello%20LittleStyles!%20Could%20you%20help%20me%20choose%20the%20right%20size?"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#FF758F] hover:underline inline-flex items-center gap-1"
            >
              <span>Ask our stylists on WhatsApp</span>
              <PhoneCall className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}