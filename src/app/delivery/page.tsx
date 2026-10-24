'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, ShieldCheck, Clock, Banknote, MapPin, CheckCircle2, ArrowRight, Search } from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '@/core/constants/SriLankaDistricts';

export default function DeliveryPage() {
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const provinces = ['All', ...Array.from(new Set(SRI_LANKA_DISTRICTS.map((d) => d.province)))];

  const filteredDistricts = SRI_LANKA_DISTRICTS.filter((d) => {
    const matchesProvince = selectedProvince === 'All' || d.province === selectedProvince;
    const matchesSearch =
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.province.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvince && matchesSearch;
  });

  return (
    <div className="space-y-12 sm:space-y-16 py-10 sm:py-16 bg-[#FAF7F5]">
      {/* 1. Hero Banner with Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[280px] sm:min-h-[320px] flex items-center p-8 sm:p-14 border border-slate-200/80 shadow-sm">
          <Image
            src="/images/banners/welcome-boy.jpg"
            alt="LittleStyles Sri Lanka Islandwide Courier Delivery"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />

          <div className="relative z-10 max-w-xl space-y-3">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-300 block">
              ISLANDWIDE SRI LANKA FULFILMENT
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight leading-tight">
              Fast, Reliable Delivery Across All 25 Districts
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
              Doorstep Cash on Delivery (COD) and direct bank transfers with premier express logistics: Prompt Xpress, Domex Courier, and Pronto.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Three Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-black text-base text-slate-900">FREE Delivery Over Rs. 5,000</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All orders with a subtotal of Rs. 5,000 or above automatically qualify for 100% Free Islandwide Courier Delivery anywhere in Sri Lanka.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-black text-base text-slate-900">1 – 3 Days Express Dispatch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Colombo & Gampaha packages arrive within 24–48 hours. Outstation districts (Kandy, Galle, Kurunegala, Jaffna) arrive within 2–4 business days.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#FF758F] flex items-center justify-center">
              <Banknote className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-black text-base text-slate-900">Cash on Delivery (COD)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pay safely in exact cash directly to the courier executive upon package handover at your door. No credit cards or online gateways required.
            </p>
          </div>
        </div>
      </div>

      {/* 3. District Rates & Interactive Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF758F]">
                25-DISTRICT COVERAGE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                Delivery Rates & Estimated Timelines
              </h2>
              <p className="text-xs text-slate-500">
                Flat rate courier fees for orders under Rs. 5,000 (Free for orders Rs. 5,000+):
              </p>
            </div>

            {/* Quick District Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your district..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF758F] focus:border-transparent bg-slate-50/50"
              />
            </div>
          </div>

          {/* Province Chunking Chips (HCI Hick's Law) */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1" role="tablist">
            {provinces.map((prov) => (
              <button
                key={prov}
                type="button"
                onClick={() => setSelectedProvince(prov)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedProvince === prov
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#FAF7F5] text-slate-900 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">District</th>
                  <th className="py-3.5 px-4">Province</th>
                  <th className="py-3.5 px-4">Estimated Time</th>
                  <th className="py-3.5 px-4">Delivery Fee</th>
                  <th className="py-3.5 px-4">COD Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDistricts.map((d) => (
                  <tr key={d.district} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.district}</td>
                    <td className="py-3 px-4 text-slate-500">{d.province}</td>
                    <td className="py-3 px-4">{d.deliveryDays}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">Rs. {d.deliveryFee}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Doorstep Cash Available
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}