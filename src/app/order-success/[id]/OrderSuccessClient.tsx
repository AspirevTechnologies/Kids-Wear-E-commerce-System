'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Order } from '@/core/entities/Order';
import { PaymentMethod, PaymentStatus } from '@/shared/types/common';
import { SRI_LANKAN_BANK_ACCOUNTS, BANK_TRANSFER_INSTRUCTIONS } from '@/core/constants/BankAccounts';
import { formatLKR } from '@/shared/utils/currency';
import {
  CheckCircle2,
  Banknote,
  Building2,
  MapPin,
  Calendar,
  MessageCircle,
  Copy,
  Check,
  UploadCloud,
  FileCheck2,
  Printer,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

export const OrderSuccessClient: React.FC<{ order: Order }> = ({ order }) => {
  const [copiedBankIdx, setCopiedBankIdx] = useState<number | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [transferRefInput, setTransferRefInput] = useState(order.slipUrl || '');
  const [slipImage, setSlipImage] = useState<string | null>(order.slipUrl || null);
  const [isUpdatingSlip, setIsUpdatingSlip] = useState(false);
  const [slipSubmitted, setSlipSubmitted] = useState(Boolean(order.slipUrl));
  const [storeSettings, setStoreSettings] = useState<any | null>(null);

  // Fetch dynamic store settings (Bank accounts)
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

  const isCod = order.paymentMethod === PaymentMethod.COD;
  const isBankTransfer =
    order.paymentMethod === PaymentMethod.BANK_TRANSFER ||
    order.paymentMethod === PaymentMethod.ONLINE;

  const handleCopyAccount = (accNo: string, idx: number) => {
    navigator.clipboard.writeText(accNo);
    setCopiedBankIdx(idx);
    setTimeout(() => setCopiedBankIdx(null), 2000);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = slipImage || transferRefInput.trim();
    if (!payload) return;

    setIsUpdatingSlip(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceOrSlip: payload }),
      });
      if (res.ok) {
        setSlipSubmitted(true);
      }
    } catch {
      // Local fallback
      setSlipSubmitted(true);
    } finally {
      setIsUpdatingSlip(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello LittleStyles! 🌸\nI have placed an order on your website.\n\n` +
      `📦 Order Number: #${order.orderNumber}\n` +
      `👤 Customer: ${order.shippingAddress.fullName}\n` +
      `📱 Mobile: ${order.shippingAddress.phone}\n` +
      `💳 Payment: ${isCod ? 'Cash on Delivery (COD)' : 'Bank Transfer'}\n` +
      `💰 Total: ${formatLKR(order.grandTotal)}\n` +
      `📍 Delivery: ${order.shippingAddress.city}, ${order.shippingAddress.district || ''}\n\n` +
      `Please confirm my order and let me know the dispatch details. Thank you!`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      {/* 1. Main Confirmation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 block">
            ORDER SUBMITTED • AWAITING FULFILMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif tracking-tight">
            Thank You for Choosing LittleStyles!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            We have safely recorded your order. Keep your order reference handy:
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-1">
            <span className="text-xs text-slate-500 font-medium">Order Reference:</span>
            <span className="font-mono font-black text-sm text-slate-900">#{order.orderNumber}</span>
            <button
              type="button"
              onClick={handleCopyRef}
              className="text-slate-400 hover:text-[#FF758F] transition-colors ml-1"
              title="Copy Order Reference"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 2. Cash on Delivery (COD) Notice Banner */}
        {isCod && (
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-left space-y-3">
            <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
              <Banknote className="w-5 h-5 text-amber-700 shrink-0" />
              <span>Doorstep Cash on Delivery (COD) Payment</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Please have exact cash of <strong className="text-slate-900 font-extrabold">{formatLKR(order.grandTotal)}</strong> ready for our delivery courier upon doorstep package handover.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-amber-800 pt-1">
              <span>• Delivery driver will call on: <strong>{order.shippingAddress.phone}</strong></span>
              <span>• Zero advance deposit required</span>
            </div>
          </div>
        )}

        {/* 3. Manual Bank Transfer Instructions & Deposit Card */}
        {isBankTransfer && (
          <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200/80 text-left space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/80 pb-3">
              <div className="flex items-center gap-2 font-bold text-blue-950 text-base font-serif">
                <Building2 className="w-5 h-5 text-blue-700 shrink-0" />
                <span>Direct Bank Transfer Payment Instructions</span>
              </div>
              <span className="text-xs font-black text-blue-900 bg-blue-100/80 px-3 py-1 rounded-full w-fit">
                Total to Transfer: {formatLKR(order.grandTotal)}
              </span>
            </div>

            <p className="text-xs text-blue-900 leading-relaxed">
              Please transfer <strong className="text-slate-900">{formatLKR(order.grandTotal)}</strong> to any of our official corporate bank accounts below. Please use <strong className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-900">#{order.orderNumber}</strong> as your transaction description / remark.
            </p>

            {/* Bank Accounts Grid */}
            <div className="space-y-3">
              {(storeSettings?.bankAccounts || SRI_LANKAN_BANK_ACCOUNTS).map((bank: any, idx: number) => (
                <div
                  key={`${bank.bankName}-${idx}`}
                  className="p-4 rounded-2xl bg-white border border-blue-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-900 text-sm block">{bank.bankName}</span>
                    <p className="text-slate-600 font-medium">Account Name: <strong className="text-slate-800">{bank.accountName}</strong></p>
                    <p className="text-slate-700 font-mono font-bold text-xs">
                      Account No: <span className="text-blue-700 font-black">{bank.accountNumber}</span> • Branch: {bank.branch}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyAccount(bank.accountNumber, idx)}
                    className="self-start sm:self-center px-3.5 py-1.5 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    {copiedBankIdx === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Account No</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Slip Submission Box */}
            <div className="p-5 rounded-2xl bg-white border border-blue-200/90 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  <span>Upload Bank Transfer Slip / Screenshot</span>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Instant Verification
                </span>
              </div>

              {slipSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Receipt Slip Successfully Uploaded!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Our finance team in Colombo will review your deposit slip and confirm your order within 2 to 4 business hours. You can track progress anytime from your Customer Dashboard.
                  </p>
                  {slipImage && slipImage.startsWith('data:image') && (
                    <div className="mt-2 pt-2 border-t border-emerald-200/60">
                      <span className="text-[10px] text-emerald-600 uppercase font-bold block mb-1">Uploaded Screenshot:</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slipImage}
                        alt="Uploaded Bank Slip"
                        className="max-h-40 rounded-lg border border-emerald-200 object-contain bg-white"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSlipSubmit} className="space-y-3">
                  <p className="text-[11px] text-slate-600">
                    Take a photo of your deposit receipt or upload a mobile banking transfer screenshot:
                  </p>

                  {/* Image Picker */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-2 transition-colors">
                      <UploadCloud className="w-4 h-4 text-blue-600" />
                      <span>{slipImage ? 'Change Screenshot' : 'Choose Slip Screenshot / Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileChange}
                      />
                    </label>

                    {slipImage && (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Screenshot loaded!</span>
                      </span>
                    )}
                  </div>

                  {/* Slip Preview if selected */}
                  {slipImage && slipImage.startsWith('data:image') && (
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl max-w-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slipImage}
                        alt="Bank Slip Preview"
                        className="max-h-36 rounded-lg object-contain w-full bg-white"
                      />
                    </div>
                  )}

                  {/* Optional Reference Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Bank Transaction ID / Reference (Optional)
                    </label>
                    <input
                      type="text"
                      value={transferRefInput}
                      onChange={(e) => setTransferRefInput(e.target.value)}
                      placeholder="e.g. COMBANK-98214 or CDM slip ref"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-900"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="submit"
                      disabled={isUpdatingSlip || (!slipImage && !transferRefInput.trim())}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs disabled:opacity-50"
                    >
                      {isUpdatingSlip ? 'Uploading Slip...' : 'Submit Receipt Slip'}
                    </button>

                    <a
                      href={`https://wa.me/94771234567?text=Hi%20LittleStyles!%20Here%20is%20my%20bank%20deposit%20slip%20for%20order%20${order.orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>Or WhatsApp Slip</span>
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 4. Delivery & Customer Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#FF758F] shrink-0" />
              <span>Estimated Delivery:</span>
            </span>
            <p className="font-bold text-slate-900">{order.estimatedDeliveryDate}</p>
            <p className="text-[11px] text-slate-500">Via Islandwide Express Courier</p>
          </div>

          <div className="space-y-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#FF758F] shrink-0" />
              <span>Delivering To:</span>
            </span>
            <p className="font-bold text-slate-900 truncate">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-[11px] text-slate-600 truncate">
              {order.shippingAddress.addressLine1}, {order.shippingAddress.city} ({order.shippingAddress.district || 'Sri Lanka'})
            </p>
          </div>
        </div>

        {/* 5. Action Buttons */}
        <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/94771234567?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
          </a>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <span>View in Customer Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
