'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/core/entities/Product';
import { useCart } from '@/presentation/context/CartContext';
import { SizeSelector } from '@/presentation/components/molecules/SizeSelector';
import {
  ShoppingBag,
  Check,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  X,
  Truck,
  RotateCcw,
  MapPin,
  Banknote,
  Building2,
} from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '@/core/constants/SriLankaDistricts';
import { formatLKR } from '@/shared/utils/currency';

export const ProductDetailClient: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.variants[0]?.size || '2-3Y');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<'cm' | 'in'>('in');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Colombo');
  const [storeDelivery, setStoreDelivery] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.delivery) {
          setStoreDelivery(data.settings.delivery);
        }
      })
      .catch(() => {});
  }, []);

  const getProductDeliveryInfo = (district: string) => {
    if (product.deliveryFeeType === 'free') {
      return { fee: 0, isFree: true, text: 'FREE Nationwide', eta: '1 - 2 Business Days' };
    }
    if (product.deliveryFeeType === 'custom' && typeof product.customDeliveryFee === 'number') {
      return { fee: product.customDeliveryFee, isFree: false, text: formatLKR(product.customDeliveryFee), eta: '1 - 3 Business Days' };
    }
    if (storeDelivery?.districtRates && Array.isArray(storeDelivery.districtRates)) {
      const match = storeDelivery.districtRates.find((r: any) => r.districts?.includes(district) || r.districts?.includes('*'));
      if (match) {
        return { fee: match.fee, isFree: false, text: formatLKR(match.fee), eta: match.estimatedDays || '1-3 Business Days', groupName: match.name };
      }
    }
    if (district === 'Colombo') {
      return { fee: storeDelivery?.colomboFee || 350, isFree: false, text: formatLKR(storeDelivery?.colomboFee || 350), eta: 'Same-Day / 1 Day' };
    }
    if (district === 'Gampaha' || district === 'Kalutara') {
      return { fee: storeDelivery?.westernProvinceFee || 400, isFree: false, text: formatLKR(storeDelivery?.westernProvinceFee || 400), eta: '1 - 2 Business Days' };
    }
    return { fee: storeDelivery?.outstationFee || 500, isFree: false, text: formatLKR(storeDelivery?.outstationFee || 500), eta: '2 - 3 Business Days' };
  };

  const deliveryInfo = getProductDeliveryInfo(selectedDistrict);

  const handleAddToCart = () => {
    if (!selectedSize || stockCount <= 0) return;
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const currentVariant = product.variants?.find((v) => v.size === selectedSize);
  const stockCount = currentVariant ? (currentVariant.stock ?? 0) : 0;
  const isSizeOutOfStock = stockCount <= 0;

  const whatsappInquiryUrl = `https://wa.me/94771234567?text=${encodeURIComponent(
    `Hello LittleStyles! 🌸\nI am interested in ordering:\n` +
      `👗 Product: ${product.title}\n` +
      `📏 Size: ${selectedSize}\n` +
      `${selectedColor ? `🎨 Color: ${selectedColor}\n` : ''}` +
      `💰 Price: ${formatLKR(product.sellingPrice)}\n` +
      `Please let me know if this is in stock for delivery. Thank you!`
  )}`;

  return (
    <div className="space-y-6">
      {/* 1. Color Swatches (if available) */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Color Shade: <span className="text-[#FF758F] font-semibold">{selectedColor || product.colors[0].name}</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5" role="radiogroup" aria-label="Available color shades">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F] ${
                  selectedColor === c.name || (!selectedColor && c === product.colors![0])
                    ? 'border-[#FF758F] ring-2 ring-[#FF758F]/30 scale-110'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                title={c.name}
                aria-label={c.name}
              >
                <span
                  className="w-full h-full rounded-full block border border-black/10"
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Size Selector with Size Guide Button */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">Select Age / Size:</span>
          <button
            type="button"
            onClick={() => setShowSizeModal(true)}
            className="text-[11px] font-bold text-[#FF758F] hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F] rounded"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Size Chart & Fit Guide</span>
          </button>
        </div>

        <SizeSelector
          variants={product.variants}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
        />

        {/* Stock Status Badge */}
        {isSizeOutOfStock ? (
          <div className="flex items-center gap-2 text-[11px] font-bold text-rose-600 pt-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Size {selectedSize} is currently sold out. Please choose another size.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>In Stock ({stockCount} units available in size {selectedSize})</span>
          </div>
        )}

        {/* Fitting Note from Seller */}
        {product.sizeNotes && (
          <div className="text-[11px] text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 leading-relaxed">
            📏 <strong>Fitting Advice:</strong> {product.sizeNotes}
          </div>
        )}
      </div>

      {/* 3. Quantity Counter */}
      <div className="flex items-center gap-4 text-xs font-bold text-slate-800">
        <span>Quantity:</span>
        <div className="flex items-center border border-slate-200/90 rounded-xl bg-[#FAF9F7] overflow-hidden">
          <button
            type="button"
            disabled={isSizeOutOfStock}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-200/70 disabled:opacity-40 text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F]"
            title="Decrease Quantity"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-bold text-sm text-slate-900">{isSizeOutOfStock ? 0 : quantity}</span>
          <button
            type="button"
            disabled={isSizeOutOfStock || quantity >= stockCount}
            onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-200/70 disabled:opacity-40 text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F]"
            title="Increase Quantity"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={isSizeOutOfStock}
            onClick={handleAddToCart}
            className={`flex-1 py-4 px-6 rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F] disabled:opacity-50 disabled:cursor-not-allowed ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : isSizeOutOfStock
                ? 'bg-slate-200 text-slate-500 shadow-none'
                : 'bg-[#FF758F] hover:bg-[#F0627D] text-white shadow-[#FF758F]/25 hover:scale-101 active:scale-98'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Added to Shopping Bag!</span>
              </>
            ) : isSizeOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </>
            )}
          </button>

          <Link
            href={isSizeOutOfStock ? '#' : '/checkout'}
            onClick={(e) => {
              if (isSizeOutOfStock) {
                e.preventDefault();
                return;
              }
              if (selectedSize) addToCart(product, selectedSize, quantity);
            }}
            className={`py-4 px-8 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
              isSizeOutOfStock
                ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-101 active:scale-98'
            }`}
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* WhatsApp Quick Order Button */}
        <a
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-[#25D366]/10 hover:bg-[#25D366]/20 text-emerald-900 border border-[#25D366]/30 transition-all flex items-center justify-center gap-2 text-center"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>Ask or Order via WhatsApp (+94 77 123 4567)</span>
        </a>
      </div>

      {/* Interactive Delivery Estimator for this product */}
      <div className="p-4 rounded-3xl bg-[#FAF6F3] border border-rose-100/90 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Truck className="w-4 h-4 text-[#FF758F]" />
            <span>Delivery & Courier to Your District</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            COD Available
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF758F]"
            >
              {SRI_LANKA_DISTRICTS.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district} ({d.province})
                </option>
              ))}
            </select>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between sm:justify-start gap-2">
            <span className="text-slate-500 text-[11px]">Fee:</span>
            <span className={`font-black font-mono text-sm ${deliveryInfo.isFree ? 'text-emerald-700' : 'text-slate-900'}`}>
              {deliveryInfo.text}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <span>⚡ Estimated Arrival: <strong className="text-slate-800">{deliveryInfo.eta}</strong></span>
          <span className="text-slate-400">via Domex / Prompt Xpress</span>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
        <div className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#FF758F] shrink-0" />
          <span className="font-medium text-[11px]">Islandwide COD & Delivery</span>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-2.5">
          <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium text-[11px]">30-Day Easy Size Swap</span>
        </div>
      </div>

      {/* Mobile Sticky Purchase Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 z-40 shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-bold text-slate-500 truncate">{product.title}</div>
          <div className="text-sm font-extrabold text-slate-900">{formatLKR(product.sellingPrice)}</div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="px-6 py-3 rounded-xl bg-[#FF758F] hover:bg-[#F0627D] text-white font-extrabold text-xs uppercase tracking-wider shrink-0 shadow-sm active:scale-95"
        >
          {isAdded ? 'Added ✓' : 'Add to Bag'}
        </button>
      </div>

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF758F] block">
                  LITTLESTYLES SIZING GUIDE
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900">
                  Sri Lankan Kids Wear Size Chart
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold"
                aria-label="Close size guide"
              >
                ✕
              </button>
            </div>

            {/* Custom Uploaded Size Chart Image or Standard Table */}
            {product.sizeChartImage ? (
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.sizeChartImage}
                    alt={`${product.title} Size Chart`}
                    className="w-full h-auto max-h-96 object-contain rounded-xl mx-auto cursor-pointer hover:opacity-95"
                    onClick={() => {
                      const w = window.open('');
                      if (w) w.document.write(`<img src="${product.sizeChartImage}" style="max-width:100%;height:auto;margin:auto;display:block;" />`);
                    }}
                    title="Click to view full size"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Click image to expand full size</p>
                </div>
              </div>
            ) : (
              <>
                {/* Unit Toggle cm <-> in */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">Toggle Measurement Unit:</span>
                  <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSizeUnit('in')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        sizeUnit === 'in' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Inches (&quot;)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSizeUnit('cm')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        sizeUnit === 'cm' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Centimeters (cm)
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto text-xs rounded-2xl border border-slate-100">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF8F5] text-slate-800 font-extrabold text-[11px] border-b border-slate-200/80">
                      <tr>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Age Group</th>
                        <th className="py-2.5 px-3">Chest ({sizeUnit})</th>
                        <th className="py-2.5 px-3">Child Height ({sizeUnit})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {(product.sizeChartType === 'baby'
                        ? [
                            { size: '0-3M', age: '0-3 Months', chestIn: '16"', chestCm: '40 cm', hIn: '22-24"', hCm: '56-62 cm' },
                            { size: '3-6M', age: '3-6 Months', chestIn: '17"', chestCm: '43 cm', hIn: '24-27"', hCm: '62-68 cm' },
                            { size: '6-12M', age: '6-12 Months', chestIn: '18"', chestCm: '46 cm', hIn: '27-31"', hCm: '68-80 cm' },
                            { size: '12-18M', age: '12-18 Months', chestIn: '19"', chestCm: '48 cm', hIn: '31-34"', hCm: '80-86 cm' },
                            { size: '18-24M', age: '18-24 Months', chestIn: '20"', chestCm: '51 cm', hIn: '34-36"', hCm: '86-92 cm' },
                          ]
                        : product.sizeChartType === 'junior'
                        ? [
                            { size: '6-7Y', age: '6-7 Years', chestIn: '25"', chestCm: '63 cm', hIn: '46-48"', hCm: '116-122 cm' },
                            { size: '7-8Y', age: '7-8 Years', chestIn: '26"', chestCm: '66 cm', hIn: '48-50"', hCm: '122-128 cm' },
                            { size: '9-10Y', age: '9-10 Years', chestIn: '28"', chestCm: '71 cm', hIn: '53-55"', hCm: '134-140 cm' },
                            { size: '11-12Y', age: '11-12 Years', chestIn: '30"', chestCm: '76 cm', hIn: '57-60"', hCm: '146-152 cm' },
                          ]
                        : [
                            { size: '2-3Y', age: '2-3 Years', chestIn: '21"', chestCm: '53 cm', hIn: '36-38"', hCm: '92-98 cm' },
                            { size: '3-4Y', age: '3-4 Years', chestIn: '22"', chestCm: '56 cm', hIn: '38-41"', hCm: '98-104 cm' },
                            { size: '4-5Y', age: '4-5 Years', chestIn: '23"', chestCm: '58 cm', hIn: '41-43"', hCm: '104-110 cm' },
                            { size: '5-6Y', age: '5-6 Years', chestIn: '24"', chestCm: '61 cm', hIn: '43-46"', hCm: '110-116 cm' },
                          ]
                      ).map((row) => (
                        <tr key={row.size} className="hover:bg-slate-50/60">
                          <td className="py-2 px-3 font-bold text-slate-900">{row.size}</td>
                          <td className="py-2 px-3">{row.age}</td>
                          <td className="py-2 px-3">{sizeUnit === 'in' ? row.chestIn : row.chestCm}</td>
                          <td className="py-2 px-3">{sizeUnit === 'in' ? row.hIn : row.hCm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {product.sizeNotes && (
              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-rose-900 text-xs">
                📏 <strong>Fitting Advice from Boutique:</strong> {product.sizeNotes}
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              💡 <strong>Tip for Parents:</strong> If your child is between sizes or has chubby cheeks and arms, we recommend choosing one size up for longer wear and tropical breathing room.
            </div>

            <button
              type="button"
              onClick={() => setShowSizeModal(false)}
              className="w-full py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
