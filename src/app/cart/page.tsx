'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/presentation/context/CartContext';
import { PriceTag } from '@/presentation/components/atoms/PriceTag';
import { formatLKR } from '@/shared/utils/currency';
import { COD_RULES } from '@/core/constants/CodRules';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Banknote, ShieldCheck, Sparkles, CheckCircle2, Truck } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, summary } = useCart();
  const [storeSettings, setStoreSettings] = React.useState<any | null>(null);

  React.useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setStoreSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 sm:py-28 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#FFF0F3] text-[#FF758F] flex items-center justify-center mx-auto border border-rose-100/80 shadow-2xs">
          <ShoppingBag className="w-10 h-10 stroke-[1.7]" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF758F] block">
            YOUR BAG IS CURRENTLY EMPTY
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight">
            Ready to Dress Your Little One?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Discover our handcrafted kids collection made from 100% hypoallergenic organic cotton, thoughtfully tailored for tropical sunshine and gentle baby skin.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF758F] hover:bg-[#F0627D] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm hover:scale-102 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F]"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const codMin = storeSettings?.delivery?.codMinOrder ?? COD_RULES.MIN_ORDER_AMOUNT;
  const codMax = storeSettings?.delivery?.codMaxOrder ?? COD_RULES.MAX_ORDER_AMOUNT;
  const isCodEligible = summary.subtotal >= codMin && summary.subtotal <= codMax;
  const freeShippingThreshold = storeSettings?.delivery?.freeShippingThreshold ?? (summary.subtotal + summary.freeShippingGap || 5000);
  const freeShippingProgress = Math.min(100, Math.round((summary.subtotal / freeShippingThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Page Header */}
      <div className="space-y-1.5 border-b border-slate-200/80 pb-5">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#FF758F] block">
          REVIEW YOUR SELECTION
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight">
          Shopping Bag ({summary.itemsCount} {summary.itemsCount === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Interactive Free Shipping Progress Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              {summary.isEligibleForFreeShipping ? (
                <div className="flex items-center gap-2 font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Congratulations! You have unlocked <strong>FREE Islandwide Delivery</strong> across Sri Lanka!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-700">
                  <Truck className="w-4 h-4 text-[#FF758F] shrink-0" />
                  <span>
                    Add <strong className="text-slate-900 font-bold">{formatLKR(summary.freeShippingGap)}</strong> more to unlock <strong className="text-[#FF758F]">FREE Delivery</strong>!
                  </span>
                </div>
              )}
              <span className="text-[11px] font-extrabold text-slate-500">{freeShippingProgress}%</span>
            </div>

            {/* Visual Progress Bar Track */}
            <div className="w-full h-2 rounded-full bg-rose-50 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF758F] to-[#E0486D] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition-colors hover:bg-slate-50/40"
              >
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  {/* Next.js Optimized Image Frame */}
                  <Link
                    href={`/products/${item.product.id}`}
                    className="relative w-20 h-24 rounded-2xl overflow-hidden bg-[#FAF6F3] shrink-0 group border border-slate-100/60"
                  >
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      fill
                      sizes="80px"
                      className="object-cover object-top group-hover:scale-104 transition-transform duration-300"
                    />
                  </Link>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF5F2] text-slate-700 border border-rose-100/60">
                        Size: {item.selectedSize}
                      </span>
                      {item.product.isCodAvailable && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          COD
                        </span>
                      )}
                    </div>
                    <Link href={`/products/${item.product.id}`} className="block">
                      <h3 className="text-sm font-bold text-slate-900 truncate hover:text-[#FF758F] transition-colors">
                        {item.product.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 truncate">{item.product.fabric}</p>
                    <PriceTag sellingPrice={item.product.sellingPrice} mrp={item.product.mrp} size="sm" />
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-[#FAF9F7]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-slate-200/70 text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F]"
                      title="Decrease quantity"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold text-slate-900">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-slate-200/70 text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F]"
                      title="Increase quantity"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors rounded-xl hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F]"
                    title="Remove item"
                    aria-label={`Remove ${item.product.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping Link */}
          <div className="pt-1 flex items-center justify-between text-xs">
            <Link
              href="/products"
              className="font-bold text-slate-600 hover:text-[#FF758F] flex items-center gap-1.5 transition-colors"
            >
              <span>← Continue Shopping Outfits</span>
            </Link>
            <span className="text-slate-400">All prices in Sri Lankan Rupees (LKR)</span>
          </div>
        </div>

        {/* Order Summary & COD Banner */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 font-serif">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal ({summary.itemsCount} items)</span>
                <span className="font-bold text-slate-900">{formatLKR(summary.subtotal)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Savings</span>
                  <span className="text-emerald-700 font-bold">-{formatLKR(summary.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 font-medium items-center">
                <span>Islandwide Delivery</span>
                <span>
                  {summary.shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      FREE
                    </span>
                  ) : (
                    <span className="font-bold text-slate-900">{formatLKR(summary.shippingFee)}</span>
                  )}
                </span>
              </div>
            </div>

            {/* COD Status Pill */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Doorstep Cash on Delivery (COD)</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                {isCodEligible
                  ? 'Pay cash upon delivery directly to our courier executive across all 25 districts.'
                  : `Minimum order for COD is ${formatLKR(codMin)}.`}
              </p>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Payable:</span>
              <span className="text-2xl font-black text-[#FF758F] font-serif">{formatLKR(summary.grandTotal)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-[#FF758F] hover:bg-[#F0627D] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#FF758F]/20 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>256-Bit SSL Encrypted & Verified Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
