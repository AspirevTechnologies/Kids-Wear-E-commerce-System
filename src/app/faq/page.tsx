'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  HelpCircle,
  ChevronDown,
  Banknote,
  Building2,
  Truck,
  RotateCcw,
  Sparkles,
  PhoneCall,
  Search,
  MessageCircle,
  CheckCircle2,
  Leaf
} from 'lucide-react';
import { COD_RULES } from '@/core/constants/CodRules';
import { formatLKR } from '@/shared/utils/currency';

interface FAQItem {
  question: string;
  answer: string;
  category: 'payment' | 'shipping' | 'returns' | 'fabric';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'payment',
    question: 'How does Cash on Delivery (COD) work across Sri Lanka?',
    answer: `We offer Cash on Delivery across all 25 districts in Sri Lanka. When placing your order, select "Cash on Delivery" at checkout. Our courier partner (Domex or Prompt Xpress) will deliver the package directly to your doorstep. You inspect the sealed package and hand over the exact cash amount in Sri Lankan Rupees directly to the courier representative. COD is valid for orders between ${formatLKR(COD_RULES.MIN_ORDER_AMOUNT)} and ${formatLKR(COD_RULES.MAX_ORDER_AMOUNT)}.`,
  },
  {
    category: 'payment',
    question: 'How do I pay via direct Bank Transfer (BOC, Commercial Bank, HNB)?',
    answer:
      'Select "Direct Bank Transfer" during checkout to reserve your items. You will receive our official corporate bank accounts (Commercial Bank, Bank of Ceylon, and Hatton National Bank) along with your unique order reference (e.g. LS-2026-XXXX). After transferring via mobile banking, ATM deposit, or bank counter, simply take a photo or screenshot of your receipt slip and upload it in your Customer Dashboard or WhatsApp it to our team at +94 77 123 4567. We verify and dispatch within 24 hours.',
  },
  {
    category: 'payment',
    question: 'Do I need to create an account or sign in to order?',
    answer:
      'No! LittleStyles operates strictly on a hassle-free guest checkout model. You do not need to create an account, remember passwords, or sign in. You can track your order anytime using your Order Reference or your phone number via our Customer Dashboard.',
  },
  {
    category: 'shipping',
    question: 'What are the delivery charges and timelines?',
    answer:
      'Colombo 01-15 delivery is Rs. 350 (Same-Day / Next-Day delivery). Greater Colombo & Western Province (Gampaha, Kalutara) is Rs. 400 (1-2 business days). All other outstation districts across Sri Lanka are Rs. 500 (2-4 business days). Orders over Rs. 5,000 enjoy 100% FREE Islandwide Delivery.',
  },
  {
    category: 'shipping',
    question: 'Which courier services deliver the parcels?',
    answer:
      'We partner with premier Sri Lankan express logistics providers including Prompt Xpress, Domex Courier, and Pronto. Every parcel receives a unique courier consignment tracking number provided via SMS and updated on your Customer Dashboard.',
  },
  {
    category: 'returns',
    question: 'What is your size exchange and returns policy?',
    answer:
      'We offer an effortless 30-day size exchange guarantee. If an outfit does not fit your child perfectly, simply contact our WhatsApp support at +94 77 123 4567 or visit our Returns page. Our courier will bring the replacement size right to your doorstep and collect the original unworn garment simultaneously.',
  },
  {
    category: 'fabric',
    question: 'Are your fabrics safe for newborns and sensitive toddler skin?',
    answer:
      'Absolutely! 100% of our baby rompers, sleepwear, and everyday kids clothing are woven from certified GOTS (Global Organic Textile Standard) organic cotton. Our garments are completely free of formaldehyde, heavy metals, azo dyes, and chemical pesticides, keeping your child comfortable in Sri Lanka’s warm, tropical climate.',
  },
  {
    category: 'fabric',
    question: 'How should I wash and care for LittleStyles garments?',
    answer:
      'We recommend washing in cold water on a gentle machine cycle using baby-safe, mild detergent. Turn garments inside out to preserve delicate pastel hues and hand embroidery. Air dry flat in shade. Avoid tumble drying on high heat to prevent cotton shrinkage.',
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState<string>('');

  const filteredFaqs = FAQ_DATA.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-12 sm:space-y-16 py-10 sm:py-16 bg-[#FAF7F5]">
      {/* 1. Header with Visual Studio Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF758F] bg-[#FFF0F3] px-3.5 py-1 rounded-full border border-rose-100 inline-block">
              HELP CENTER & FAQ
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Find instant answers about Islandwide Cash on Delivery, manual bank verification, 25-district delivery timelines, and our 30-day doorstep size swap guarantee.
            </p>

            {/* Search Input Bar */}
            <div className="relative pt-2 max-w-lg">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions (e.g. COD, bank slip, delivery)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F] focus:border-transparent transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[280px] bg-slate-100">
            <Image
              src="/images/products/baby-knit-romper.jpg"
              alt="LittleStyles parent care & FAQ"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2" role="tablist">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Questions ({FAQ_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('payment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'payment'
                ? 'bg-[#FF758F] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>COD & Bank Payments</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('shipping')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'shipping'
                ? 'bg-[#FF758F] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Courier Shipping</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('returns')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'returns'
                ? 'bg-[#FF758F] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>30-Day Exchanges</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('fabric')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'fabric'
                ? 'bg-[#FF758F] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Organic Fabrics</span>
          </button>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-2xs space-y-2">
              <p className="font-bold text-slate-900 text-sm">No questions matched your search.</p>
              <p className="text-xs text-slate-500">Try searching for &quot;COD&quot;, &quot;exchange&quot;, or &quot;bank transfer&quot;.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base font-serif"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'bg-rose-50 text-[#FF758F] rotate-180' : 'bg-slate-100 text-slate-500'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-sans">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/80 border border-emerald-200/90 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center mx-auto shadow-sm">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-black text-lg text-emerald-950">
            Have a Specific Question?
          </h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
            Our Colombo customer care stylists are available 7 days a week on WhatsApp to assist with sizes, delivery status, and custom orders.
          </p>
          <div className="pt-1">
            <a
              href="https://wa.me/94771234567?text=Hello%20LittleStyles!%20I%20have%20a%20question%20about%20my%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-98"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Chat with Us on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}