'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/presentation/context/CartContext';
import { Address, PaymentMethod } from '@/shared/types/common';
import { COD_RULES } from '@/core/constants/CodRules';
import { SRI_LANKA_DISTRICTS } from '@/core/constants/SriLankaDistricts';
import { SRI_LANKAN_BANK_ACCOUNTS } from '@/core/constants/BankAccounts';
import { formatLKR } from '@/shared/utils/currency';
import {
  Banknote,
  Building2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Truck,
  Copy,
  Check,
  HelpCircle
} from 'lucide-react';

export const CodCheckoutForm: React.FC = () => {
  const router = useRouter();
  const { items, summary, selectedPaymentMethod, setSelectedPaymentMethod, clearCart } = useCart();

  const [formData, setFormData] = useState<Address>({
    fullName: '',
    phone: '',
    alternatePhone: '',
    addressLine1: '',
    addressLine2: '',
    district: 'Colombo',
    city: 'Colombo 03',
    state: 'Western Province',
    pincode: '00300',
    landmark: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedBankIdx, setCopiedBankIdx] = useState<number | null>(null);
  const [storeSettings, setStoreSettings] = useState<any | null>(null);

  // Load saved address and dynamic store settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('littlestyles_saved_address');
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }

    // Fetch dynamic store settings (Bank Accounts, Delivery Fees)
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setStoreSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const handleDistrictChange = (districtName: string) => {
    const matched = SRI_LANKA_DISTRICTS.find((d) => d.district === districtName);
    setFormData((prev) => ({
      ...prev,
      district: districtName,
      state: matched ? matched.province : prev.state,
      city: matched && matched.majorTowns.length > 0 ? matched.majorTowns[0] : prev.city,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyAccount = (accNo: string, idx: number) => {
    navigator.clipboard.writeText(accNo);
    setCopiedBankIdx(idx);
    setTimeout(() => setCopiedBankIdx(null), 2000);
  };

  // Dynamic delivery fee & timeframe calculation based on selected district, districtRates, and product settings
  const getDistrictDeliveryInfo = (districtName: string): { fee: number; estimatedDays: string; groupName?: string } => {
    if (!districtName) return { fee: 350, estimatedDays: 'Same-Day / 1 Day' };

    // Check custom district rates / groups configured by admin
    if (storeSettings?.delivery?.districtRates && Array.isArray(storeSettings.delivery.districtRates)) {
      const match = storeSettings.delivery.districtRates.find(
        (r: any) => r.districts?.includes(districtName) || r.districts?.includes('*')
      );
      if (match) {
        return {
          fee: match.fee,
          estimatedDays: match.estimatedDays || '1-3 Business Days',
          groupName: match.name,
        };
      }
    }

    const colomboFee = storeSettings?.delivery?.colomboFee ?? 350;
    const wpFee = storeSettings?.delivery?.westernProvinceFee ?? 400;
    const outstationFee = storeSettings?.delivery?.outstationFee ?? 500;
    if (districtName === 'Colombo') {
      return { fee: colomboFee, estimatedDays: 'Same-Day / 1 Day', groupName: 'Colombo District' };
    }
    if (districtName === 'Gampaha' || districtName === 'Kalutara') {
      return { fee: wpFee, estimatedDays: '1-2 Business Days', groupName: 'Western Province' };
    }
    return { fee: outstationFee, estimatedDays: '2-3 Business Days', groupName: 'Outstation Courier' };
  };

  const hasCustomProductFee = items.some((item) => item.product.deliveryFeeType === 'custom');
  const allProductsFreeShipping = items.length > 0 && items.every((item) => item.product.deliveryFeeType === 'free');
  const maxCustomProductFee = hasCustomProductFee
    ? Math.max(
        ...items
          .filter((item) => item.product.deliveryFeeType === 'custom' && typeof item.product.customDeliveryFee === 'number')
          .map((item) => item.product.customDeliveryFee as number)
      )
    : 0;

  const currentDistrictInfo = getDistrictDeliveryInfo(formData.district || 'Colombo');
  const freeThreshold = storeSettings?.delivery?.freeShippingThreshold ?? 5000;
  const isFreeDelivery = (summary.subtotal >= freeThreshold || allProductsFreeShipping) && items.length > 0;
  
  const baseShippingFee = hasCustomProductFee && maxCustomProductFee > 0
    ? maxCustomProductFee
    : currentDistrictInfo.fee;

  const actualShippingFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : baseShippingFee;
  const actualCodFee = selectedPaymentMethod === PaymentMethod.COD && items.length > 0
    ? (summary.subtotal >= COD_RULES.FREE_COD_THRESHOLD ? 0 : COD_RULES.COD_HANDLING_FEE)
    : 0;
  const actualGrandTotal = summary.subtotal + actualShippingFee + actualCodFee;

  const codMin = storeSettings?.delivery?.codMinOrder ?? COD_RULES.MIN_ORDER_AMOUNT;
  const codMax = storeSettings?.delivery?.codMaxOrder ?? COD_RULES.MAX_ORDER_AMOUNT;
  const isCodBlocked = summary.subtotal < codMin || summary.subtotal > codMax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.addressLine1.trim()) {
      setErrorMessage('Please fill in all mandatory delivery fields (Name, Phone, Address).');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 12) {
      setErrorMessage('Please enter a valid Sri Lankan mobile number (e.g., 0771234567).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save address locally for returning orders
      try {
        localStorage.setItem('littlestyles_saved_address', JSON.stringify(formData));
      } catch {
        // Ignore
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: formData,
          paymentMethod: selectedPaymentMethod,
          isCodOtpConfirmed: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'Failed to place order. Please review your details.');
        setIsSubmitting(false);
        return;
      }

      // Successful order creation
      clearCart();
      router.push(`/order-success/${data.order.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        {/* Step 1: Delivery Address */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF758F] text-white text-xs flex items-center justify-center font-sans font-extrabold">
                1
              </span>
              <span>Delivery Details</span>
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">
              Islandwide Delivery Across Sri Lanka
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                required
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ruwani Fernando"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F]/20 focus:border-[#FF758F] transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                Sri Lankan Mobile Number *
              </label>
              <input
                id="phone"
                type="tel"
                required
                maxLength={12}
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 077 123 4567"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F]/20 focus:border-[#FF758F] transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
              <p className="text-[10px] text-slate-400 mt-1">For delivery driver dispatch & status notifications</p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="addressLine1" className="block text-xs font-bold text-slate-700 mb-1.5">
                Delivery Address (House / Street / Lane) *
              </label>
              <input
                id="addressLine1"
                type="text"
                required
                name="addressLine1"
                autoComplete="street-address"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="e.g. No. 42/1, Temple Road"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F]/20 focus:border-[#FF758F] transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="district" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Delivery District & City Coverage *</span>
                <span className="text-[11px] font-normal text-slate-500">
                  Select your district to see exact delivery fee
                </span>
              </label>
              <select
                id="district"
                name="district"
                value={formData.district || 'Colombo'}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3.5 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F]/20 focus:border-[#FF758F] transition-all font-medium text-slate-900 cursor-pointer"
              >
                {SRI_LANKA_DISTRICTS.map((d) => {
                  const info = getDistrictDeliveryInfo(d.district);
                  return (
                    <option key={d.district} value={d.district}>
                      {d.district} ({d.province}) — {isFreeDelivery ? 'FREE Delivery' : `Delivery Fee: Rs. ${info.fee} (${info.estimatedDays})`}
                    </option>
                  );
                })}
              </select>

              {/* Dynamic Delivery Fee Info Box */}
              <div className="mt-2.5 p-3 rounded-2xl bg-[#FFF5F7] border border-[#FFD0DB] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#FF758F] shrink-0" />
                  <span className="text-slate-700">
                    Doorstep Courier to <strong className="text-slate-900 font-bold">{formData.district}</strong>:
                  </span>
                  {isFreeDelivery ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase">
                      FREE DELIVERY APPLIED
                    </span>
                  ) : (
                    <span className="font-black text-rose-600 font-mono text-sm">
                      {formatLKR(baseShippingFee)}
                    </span>
                  )}
                  {currentDistrictInfo.groupName && (
                    <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 font-bold border border-rose-200">
                      {currentDistrictInfo.groupName}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  ⚡ {currentDistrictInfo.estimatedDays || '1-3 Business Days'} Doorstep Courier
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-xs font-bold text-slate-700 mb-1.5">
                Town / City *
              </label>
              <input
                id="city"
                type="text"
                required
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Nugegoda, Negombo, Kandy"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F]/20 focus:border-[#FF758F] transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="landmark" className="block text-xs font-bold text-slate-700 mb-1.5">
                Landmark or Delivery Instructions (Optional)
              </label>
              <input
                id="landmark"
                type="text"
                name="landmark"
                value={formData.landmark || ''}
                onChange={handleChange}
                placeholder="e.g. Near Arpico Supercentre, Gate 2, Call before arriving"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F]/20 focus:border-[#FF758F] transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Payment Mode */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF758F] text-white text-xs flex items-center justify-center font-sans font-extrabold">
                2
              </span>
              <span>Payment Method</span>
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              No Payment Gateway Required
            </span>
          </div>

          <div className="space-y-3">
            {/* Cash on Delivery option */}
            <label
              className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedPaymentMethod === PaymentMethod.COD
                  ? 'border-[#FF758F] bg-[#FFF8FA] ring-2 ring-[#FF758F]/20 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300'
              } ${isCodBlocked ? 'opacity-60 bg-gray-50' : ''}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={PaymentMethod.COD}
                checked={selectedPaymentMethod === PaymentMethod.COD}
                onChange={() => setSelectedPaymentMethod(PaymentMethod.COD)}
                className="mt-1 text-[#FF758F] focus:ring-[#FF758F]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-sm text-slate-900">
                    Cash on Delivery (COD)
                  </span>
                  {summary.subtotal >= COD_RULES.FREE_COD_THRESHOLD ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      FREE COD
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      +Rs. {COD_RULES.COD_HANDLING_FEE} Courier Handling
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Pay cash directly to our courier executive at your doorstep when your package arrives.
                </p>
                {isCodBlocked && (
                  <p className="text-xs text-rose-600 font-semibold mt-1">
                    COD is unavailable for orders below Rs. {codMin.toLocaleString()} or above Rs. {codMax.toLocaleString()}.
                  </p>
                )}
              </div>
            </label>

            {/* Direct Bank Transfer option */}
            <label
              className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedPaymentMethod === PaymentMethod.BANK_TRANSFER || selectedPaymentMethod === PaymentMethod.ONLINE
                  ? 'border-[#FF758F] bg-[#FFF8FA] ring-2 ring-[#FF758F]/20 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={PaymentMethod.BANK_TRANSFER}
                checked={selectedPaymentMethod === PaymentMethod.BANK_TRANSFER || selectedPaymentMethod === PaymentMethod.ONLINE}
                onChange={() => setSelectedPaymentMethod(PaymentMethod.BANK_TRANSFER)}
                className="mt-1 text-[#FF758F] focus:ring-[#FF758F]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="font-bold text-sm text-slate-900">
                    Direct Bank Transfer / Deposit (Manual)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    0% Extra Fees
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Transfer funds via your Mobile Banking app (Flash, Q+, HNB SOLO), CDM, or over-the-counter deposit.
                </p>

                {/* Bank Account Details Preview */}
                {(selectedPaymentMethod === PaymentMethod.BANK_TRANSFER || selectedPaymentMethod === PaymentMethod.ONLINE) && (
                  <div className="mt-4 pt-3 border-t border-rose-100/80 space-y-3">
                    <p className="text-[11px] font-bold text-slate-700">
                      Transfer to any of our official Sri Lankan corporate accounts:
                    </p>
                    <div className="space-y-2">
                      {(storeSettings?.bankAccounts || SRI_LANKAN_BANK_ACCOUNTS).map((bank: any, idx: number) => (
                        <div
                          key={`${bank.bankName}-${idx}`}
                          className="p-3 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{bank.bankName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Acc: {bank.accountNumber} • {bank.branch}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCopyAccount(bank.accountNumber, idx);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:text-[#FF758F] bg-slate-50 hover:bg-rose-50 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            {copiedBankIdx === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Acc</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500 italic">
                      * You will receive a unique transfer reference on the confirmation page to include in your transfer remark.
                    </p>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="w-full py-4 bg-[#FF758F] hover:bg-[#F0627D] disabled:opacity-50 text-white font-extrabold uppercase tracking-wider rounded-2xl shadow-md shadow-[#FF758F]/20 transition-all flex items-center justify-center gap-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F] active:scale-98"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Placing Your Kids Wear Order...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>
                {selectedPaymentMethod === PaymentMethod.COD
                  ? `Place COD Order • ${formatLKR(actualGrandTotal)}`
                  : `Place Bank Transfer Order • ${formatLKR(actualGrandTotal)}`}
              </span>
            </>
          )}
        </button>
      </form>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 font-serif">
            Order Summary ({summary.itemsCount} Items)
          </h3>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="py-3 flex gap-3 text-xs items-center">
                <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-[#FAF6F3] shrink-0 border border-slate-100">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{item.product.title}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                  <p className="font-extrabold text-[#FF758F] mt-1">
                    {formatLKR(item.product.sellingPrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Items Total:</span>
              <span className="font-bold text-slate-900">{formatLKR(summary.subtotal)}</span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <span>Courier to {formData.district}:</span>
                {isFreeDelivery && (
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    FREE
                  </span>
                )}
              </span>
              <span className="font-bold text-slate-900">
                {actualShippingFee === 0 ? 'FREE' : formatLKR(actualShippingFee)}
              </span>
            </div>

            {selectedPaymentMethod === PaymentMethod.COD && actualCodFee > 0 && (
              <div className="flex justify-between text-slate-600 font-medium">
                <span>COD Handling Fee:</span>
                <span className="font-bold text-slate-900">{formatLKR(actualCodFee)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-black text-slate-900 font-serif">Total Payable:</span>
                <p className="text-[10px] text-slate-500 font-medium">All taxes & packaging included</p>
              </div>
              <span className="text-lg font-black text-slate-900 font-sans tracking-tight">
                {formatLKR(actualGrandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Reassurance Card */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <Truck className="w-4 h-4 text-amber-700" />
            <span>Sri Lanka Islandwide Fulfilment Guarantee</span>
          </div>
          <p className="leading-relaxed text-[11px] text-amber-900/90">
            Every package is carefully inspected and wrapped in protective eco-friendly packaging. We partner with Prompt Xpress, Pronto, and Domex to ensure prompt doorstep delivery.
          </p>
        </div>
      </div>
    </div>
  );
};
