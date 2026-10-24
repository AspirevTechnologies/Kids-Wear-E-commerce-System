'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/core/entities/Order';
import { PaymentMethod, PaymentStatus, OrderStatus, Address } from '@/shared/types/common';
import { SRI_LANKAN_BANK_ACCOUNTS, BANK_TRANSFER_INSTRUCTIONS } from '@/core/constants/BankAccounts';
import { formatLKR } from '@/shared/utils/currency';
import {
  Package,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Building2,
  Banknote,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  UploadCloud,
  ShoppingBag,
  HelpCircle,
  FileText,
  AlertCircle,
  User,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'track' | 'address' | 'bank-info'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Guest Order Tracking State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackPhone, setTrackPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Order[] | null>(null);
  const [searchError, setSearchError] = useState('');

  // Selected Order for Modal / Details
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Bank Slip Upload Modal
  const [slipModalOrder, setSlipModalOrder] = useState<Order | null>(null);
  const [slipInput, setSlipInput] = useState('');
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [isSubmittingSlip, setIsSubmittingSlip] = useState(false);
  const [slipSuccessMessage, setSlipSuccessMessage] = useState('');

  const handleSlipImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Saved Address
  const [savedAddress, setSavedAddress] = useState<Address | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressFormData, setAddressFormData] = useState<Address>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Colombo 03',
    district: 'Colombo',
    state: 'Western Province',
    pincode: '00300',
  });

  // Copied bank account state
  const [copiedBankIdx, setCopiedBankIdx] = useState<number | null>(null);
  const [storeSettings, setStoreSettings] = useState<any | null>(null);

  // Fetch dynamic store settings (Bank accounts)
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setStoreSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch initial orders
  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders/lookup');
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();

    // Load saved address
    try {
      const saved = localStorage.getItem('littlestyles_saved_address');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedAddress(parsed);
        setAddressFormData(parsed);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSearchResult(null);

    if (!trackQuery.trim() && !trackPhone.trim()) {
      setSearchError('Please enter an Order Reference or Mobile Number.');
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (trackQuery.trim()) params.append('orderNumber', trackQuery.trim());
      if (trackPhone.trim()) params.append('phone', trackPhone.trim());

      const res = await fetch(`/api/orders/lookup?${params.toString()}`);
      const data = await res.json();

      if (data.success && data.orders && data.orders.length > 0) {
        setSearchResult(data.orders);
      } else {
        setSearchError(data.message || 'No orders found matching your search.');
      }
    } catch {
      setSearchError('Network error while searching for order. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('littlestyles_saved_address', JSON.stringify(addressFormData));
      setSavedAddress(addressFormData);
      setIsEditingAddress(false);
    } catch {
      // Ignore
    }
  };

  const handleCopyAccount = (accNo: string, idx: number) => {
    navigator.clipboard.writeText(accNo);
    setCopiedBankIdx(idx);
    setTimeout(() => setCopiedBankIdx(null), 2000);
  };

  const handleSlipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = slipImage || slipInput.trim();
    if (!slipModalOrder || !payload) return;

    setIsSubmittingSlip(true);
    try {
      const res = await fetch(`/api/orders/${slipModalOrder.id}/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceOrSlip: payload }),
      });
      const data = await res.json();

      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === data.order.id ? data.order : o)));
        setSlipSuccessMessage('Payment slip uploaded successfully! Our team will verify and dispatch.');
        setTimeout(() => {
          setSlipModalOrder(null);
          setSlipSuccessMessage('');
          setSlipInput('');
          setSlipImage(null);
        }, 3000);
      }
    } catch {
      setIsSubmittingSlip(false);
    }
  };

  // Helper for Stepper stages
  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_CONFIRMATION:
      case OrderStatus.PENDING_COD_VERIFICATION:
        return 1;
      case OrderStatus.CONFIRMED:
      case OrderStatus.PROCESSING:
        return 2;
      case OrderStatus.SHIPPED:
        return 3;
      case OrderStatus.OUT_FOR_DELIVERY:
        return 4;
      case OrderStatus.DELIVERED:
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* 1. Header Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative">
        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFF0F3] text-[#FF758F] border border-rose-100">
              CUSTOMER CONCIERGE & TRACKING
            </span>
            <span className="text-xs font-semibold text-slate-400">• Islandwide Sri Lanka</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif tracking-tight">
            Order Dashboard & Live Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Track your boutique kids wear orders, check Cash on Delivery (COD) dispatch progress, view official bank transfer accounts, and manage delivery addresses.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full md:w-auto">
          <div className="hidden lg:flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-rose-100/60">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-100">
              <Image
                src="/images/categories/baby.jpg"
                alt="LittleStyles Baby"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="text-left text-xs pr-2">
              <div className="font-bold text-slate-900">Need Help?</div>
              <div className="text-[11px] text-slate-500">Concierge: +94 77 123 4567</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <a
              href="https://wa.me/94771234567?text=Hello%20LittleStyles,%20I%20have%20an%20order%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Support</span>
            </a>

            <Link
              href="/products"
              className="flex-1 sm:flex-none px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Outfits</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto pb-px" role="tablist">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          role="tab"
          aria-selected={activeTab === 'orders'}
          className={`px-4 sm:px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'orders'
              ? 'border-[#FF758F] text-[#FF758F]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('track')}
          role="tab"
          aria-selected={activeTab === 'track'}
          className={`px-4 sm:px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'track'
              ? 'border-[#FF758F] text-[#FF758F]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Track Any Order</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bank-info')}
          role="tab"
          aria-selected={activeTab === 'bank-info'}
          className={`px-4 sm:px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'bank-info'
              ? 'border-[#FF758F] text-[#FF758F]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Bank Transfer Guide</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('address')}
          role="tab"
          aria-selected={activeTab === 'address'}
          className={`px-4 sm:px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'address'
              ? 'border-[#FF758F] text-[#FF758F]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Address</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#FF758F] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-5 items-center">
                <div className="sm:col-span-2 relative h-52 sm:h-full min-h-[220px] bg-slate-100">
                  <Image
                    src="/images/products/floral-dress.jpg"
                    alt="LittleStyles Pure Organic Kids Collection"
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent sm:hidden" />
                  <div className="absolute bottom-3 left-3 text-white text-xs font-bold sm:hidden">
                    New Season Baby & Kids
                  </div>
                </div>
                <div className="sm:col-span-3 p-6 sm:p-8 space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-50 text-[#FF758F] text-[11px] font-bold tracking-wide uppercase">
                    <Package className="w-3.5 h-3.5" />
                    <span>No Orders Placed Yet</span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                      Your parcel journey starts here
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Orders placed with Cash on Delivery or Bank Transfer appear here automatically with live courier milestones and digital receipts.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF758F] hover:bg-[#F0627D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm shadow-rose-500/20 active:scale-98"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Shop Collection</span>
                    </Link>
                    <button
                      onClick={() => setActiveTab('track')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Track by Phone</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const isCod = order.paymentMethod === PaymentMethod.COD;
                const progressStep = getStepProgress(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
                  >
                    {/* Order Summary Header Bar */}
                    <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono font-black text-sm text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200">
                          #{order.orderNumber}
                        </span>

                        {/* Order Fulfillment Status Pill */}
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                            order.status === OrderStatus.DELIVERED
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === OrderStatus.SHIPPED || order.status === OrderStatus.OUT_FOR_DELIVERY
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>

                        {/* Payment Method & Status Pill */}
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 ${
                            isCod
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {isCod ? <Banknote className="w-3.5 h-3.5 text-emerald-600" /> : <Building2 className="w-3.5 h-3.5 text-blue-600" />}
                          <span>{isCod ? 'Cash on Delivery' : 'Bank Transfer'}</span>
                          <span className="text-[10px] opacity-75 font-mono">({order.paymentStatus || (isCod ? 'COD Pending' : 'Awaiting Transfer')})</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                        <span>Placed: <strong className="text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</strong></span>
                        <span className="text-slate-300">|</span>
                        <span>Total: <strong className="text-slate-900 font-extrabold text-sm">{formatLKR(order.grandTotal)}</strong></span>
                      </div>
                    </div>

                    {/* Progress Stepper Bar */}
                    <div className="p-5 sm:p-6 border-b border-slate-100 bg-white">
                      <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-between relative">
                          {/* Stepper background line */}
                          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
                          <div
                            className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
                            style={{ width: `${((progressStep - 1) / 4) * 100}%` }}
                          />

                          {/* Step 1: Placed */}
                          <div className="flex flex-col items-center gap-1.5 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                              progressStep >= 1 ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' : 'bg-slate-200 text-slate-600'
                            }`}>
                              ✓
                            </div>
                            <span className="text-[10px] font-bold text-slate-700">Order Placed</span>
                          </div>

                          {/* Step 2: Confirmed */}
                          <div className="flex flex-col items-center gap-1.5 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                              progressStep >= 2 ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {progressStep >= 2 ? '✓' : '2'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700">Confirmed</span>
                          </div>

                          {/* Step 3: Dispatched */}
                          <div className="flex flex-col items-center gap-1.5 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                              progressStep >= 3 ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {progressStep >= 3 ? '✓' : '3'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700">Dispatched</span>
                          </div>

                          {/* Step 4: Out for Delivery */}
                          <div className="flex flex-col items-center gap-1.5 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                              progressStep >= 4 ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {progressStep >= 4 ? '✓' : '4'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700">Out for Delivery</span>
                          </div>

                          {/* Step 5: Delivered */}
                          <div className="flex flex-col items-center gap-1.5 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                              progressStep >= 5 ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {progressStep >= 5 ? '✓' : '5'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700">Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-5 sm:p-6 space-y-4">
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="relative w-16 h-20 rounded-2xl overflow-hidden bg-[#FAF6F3] border border-slate-100 shrink-0">
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.title}
                                fill
                                sizes="64px"
                                className="object-cover object-top"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {item.product.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Size: <span className="font-bold text-slate-700">{item.selectedSize}</span> • Qty: <span className="font-bold text-slate-700">{item.quantity}</span>
                              </p>
                              <p className="text-xs font-extrabold text-[#FF758F] mt-1">
                                {formatLKR(item.product.sellingPrice * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Expandable Order Details */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50/70 p-4 rounded-2xl">
                          <div className="space-y-1.5">
                            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-slate-400">
                              Delivery Address
                            </span>
                            <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                            <p className="text-slate-600">{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && <p className="text-slate-600">{order.shippingAddress.addressLine2}</p>}
                            <p className="text-slate-600">
                              {order.shippingAddress.city}, {order.shippingAddress.district || 'Sri Lanka'}
                            </p>
                            <p className="font-mono text-slate-700">Phone: {order.shippingAddress.phone}</p>
                            {order.shippingAddress.landmark && (
                              <p className="text-[11px] text-slate-500 italic">Note: {order.shippingAddress.landmark}</p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-slate-400">
                              Payment & Fulfilment Info
                            </span>
                            <p className="text-slate-700">
                              Method: <strong className="text-slate-900">{isCod ? 'Cash on Delivery (Doorstep)' : 'Direct Bank Transfer'}</strong>
                            </p>
                            <p className="text-slate-700">
                              Payment Status: <strong className="text-slate-900">{order.paymentStatus || 'Pending'}</strong>
                            </p>
                            {order.bankReference && (
                              <p className="text-slate-700">
                                Bank Reference: <strong className="font-mono text-blue-700">{order.bankReference}</strong>
                              </p>
                            )}
                            {order.slipUrl && (
                              <p className="text-slate-700">
                                Submitted Slip/Ref: <strong className="font-mono text-emerald-700">{order.slipUrl}</strong>
                              </p>
                            )}
                            {order.verificationNotes && (
                              <p className="text-[11px] text-slate-500 italic">Notes: {order.verificationNotes}</p>
                            )}
                            <p className="text-slate-700">
                              Estimated Arrival: <strong className="text-slate-900">{order.estimatedDeliveryDate}</strong>
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Card Action Footer */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          className="text-xs font-bold text-slate-700 hover:text-[#FF758F] transition-colors"
                        >
                          {isExpanded ? '▲ Hide Full Breakdown' : '▼ View Full Breakdown & Address'}
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* If Bank Transfer and slip not yet confirmed */}
                          {!isCod && order.paymentStatus !== PaymentStatus.PAID && (
                            <button
                              type="button"
                              onClick={() => {
                                setSlipModalOrder(order);
                                setSlipInput(order.slipUrl || '');
                              }}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                            >
                              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                              <span>{order.slipUrl ? 'Update Slip/Ref' : 'Submit Bank Slip'}</span>
                            </button>
                          )}

                          <a
                            href={`https://wa.me/94771234567?text=Hello%20LittleStyles,%20I%20would%20like%20to%20check%20on%20my%20Order%20%23${order.orderNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Inquire via WhatsApp</span>
                          </a>

                          <Link
                            href={`/order-success/${order.id}`}
                            className="px-3 py-1.5 bg-[#FFF0F3] hover:bg-[#FFE0E6] text-[#FF758F] text-xs font-extrabold rounded-xl transition-colors flex items-center gap-1"
                          >
                            <span>Receipt Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TRACK ANY ORDER (GUEST LOOKUP) */}
      {activeTab === 'track' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF758F] block">
                INSTANT GUEST LOOKUP
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                Track Any Boutique Order
              </h2>
              <p className="text-xs text-slate-600">
                Enter your Order Reference (e.g. LS-2026-4821) or the Sri Lankan mobile number used during guest checkout.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div>
                <label htmlFor="trackQuery" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Order Reference Number
                </label>
                <input
                  id="trackQuery"
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="e.g. LS-2026-4821 or ord_demo_01"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F]/20 focus:border-[#FF758F] font-mono text-slate-900"
                />
              </div>

              <div className="relative flex items-center justify-center">
                <span className="text-[11px] font-bold text-slate-400 bg-white px-3 relative z-10">OR</span>
                <div className="absolute inset-x-0 h-px bg-slate-100" />
              </div>

              <div>
                <label htmlFor="trackPhone" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Sri Lankan Mobile Number
                </label>
                <input
                  id="trackPhone"
                  type="tel"
                  value={trackPhone}
                  onChange={(e) => setTrackPhone(e.target.value)}
                  placeholder="e.g. 0771234567"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F]/20 focus:border-[#FF758F] font-medium text-slate-900"
                />
              </div>

              {searchError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{searchError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-3.5 bg-[#FF758F] hover:bg-[#F0627D] disabled:opacity-50 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Locating Order...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search Order Status</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Search Results Display */}
          {searchResult && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 font-serif">
                Search Results ({searchResult.length})
              </h3>
              {searchResult.map((resOrder) => (
                <div key={resOrder.id} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-black text-sm text-slate-900">#{resOrder.orderNumber}</span>
                      <p className="text-xs text-slate-500 mt-0.5">Placed: {new Date(resOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {resOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <p>Delivering To: <strong>{resOrder.shippingAddress.fullName}</strong> ({resOrder.shippingAddress.city})</p>
                    <p>Payment: <strong>{resOrder.paymentMethod === PaymentMethod.COD ? 'Cash on Delivery (Doorstep)' : 'Direct Bank Transfer'}</strong> • Total: <strong className="text-slate-900">{formatLKR(resOrder.grandTotal)}</strong></p>
                    <p>Estimated Date: <strong>{resOrder.estimatedDeliveryDate}</strong></p>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/order-success/${resOrder.id}`}
                      className="px-4 py-2 bg-[#FF758F] text-white text-xs font-bold rounded-xl hover:bg-[#F0627D] transition-colors"
                    >
                      View Order Receipt
                    </Link>
                    <a
                      href={`https://wa.me/94771234567?text=Hello%20LittleStyles,%20inquiring%20about%20Order%20%23${resOrder.orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      WhatsApp Check
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BANK TRANSFER GUIDE & ACCOUNTS */}
      {activeTab === 'bank-info' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 block">
                OFFICIAL SRI LANKAN CORPORATE ACCOUNTS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                Direct Bank Deposit Guide
              </h2>
              <p className="text-xs text-slate-600">
                LittleStyles accepts direct manual bank transfers with 0% extra gateway fees. Transfer via your Mobile Banking app, Cash Deposit Machine (CDM), or over-the-counter deposit.
              </p>
            </div>

            {/* Bank Accounts Grid */}
            <div className="space-y-3">
              {(storeSettings?.bankAccounts || SRI_LANKAN_BANK_ACCOUNTS).map((bank: any, idx: number) => (
                <div
                  key={`${bank.bankName}-${idx}`}
                  className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/70 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-700" />
                      <span className="font-extrabold text-slate-900 text-sm">{bank.bankName}</span>
                    </div>
                    <p className="text-slate-600 font-medium">Account Name: <strong className="text-slate-900">{bank.accountName}</strong></p>
                    <p className="text-slate-700 font-mono text-xs">
                      Account No: <span className="text-blue-700 font-black text-sm">{bank.accountNumber}</span> • Branch: {bank.branch}
                    </p>
                    <p className="text-[11px] text-slate-400">Branch Code: {bank.branchCode || 'N/A'} • Swift: {bank.swiftCode || 'N/A'}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyAccount(bank.accountNumber, idx)}
                    className="self-start sm:self-center px-4 py-2 text-xs font-bold text-blue-800 bg-white hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
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

            {/* Step-by-Step Instructions */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Deposit Instructions:
              </h4>
              <ol className="space-y-2 text-xs text-slate-600">
                {BANK_TRANSFER_INSTRUCTIONS.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SAVED ADDRESS */}
      {activeTab === 'address' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF758F] block">
                  LOCAL BROWSER STORAGE
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                  Saved Delivery Address
                </h2>
              </div>
              {savedAddress && !isEditingAddress && (
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(true)}
                  className="text-xs font-bold text-[#FF758F] hover:underline"
                >
                  Edit Address
                </button>
              )}
            </div>

            {isEditingAddress || !savedAddress ? (
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={addressFormData.fullName}
                      onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                      placeholder="e.g. Anoma Dissanayake"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={addressFormData.phone}
                      onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                      placeholder="e.g. 077 123 4567"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={addressFormData.addressLine1}
                      onChange={(e) => setAddressFormData({ ...addressFormData, addressLine1: e.target.value })}
                      placeholder="e.g. No 15, Queen's Road"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={addressFormData.city}
                      onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                      placeholder="e.g. Colombo 03"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                    <input
                      type="text"
                      value={addressFormData.district || 'Colombo'}
                      onChange={(e) => setAddressFormData({ ...addressFormData, district: e.target.value })}
                      placeholder="e.g. Colombo"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#FF758F] hover:bg-[#F0627D] text-white text-xs font-extrabold rounded-xl transition-all shadow-xs"
                  >
                    Save Address
                  </button>
                  {savedAddress && (
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <MapPin className="w-4 h-4 text-[#FF758F]" />
                  <span>{savedAddress.fullName}</span>
                </div>
                <p className="text-slate-600">{savedAddress.addressLine1}</p>
                {savedAddress.addressLine2 && <p className="text-slate-600">{savedAddress.addressLine2}</p>}
                <p className="text-slate-600">{savedAddress.city}, {savedAddress.district || 'Sri Lanka'}</p>
                <p className="font-mono text-slate-700">Mobile: {savedAddress.phone}</p>
                <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                  ✓ Automatically auto-fills when you checkout!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. MODAL: Bank Slip Submission */}
      {slipModalOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-black text-base text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <span>Submit Bank Transfer Slip</span>
              </h3>
              <button
                type="button"
                onClick={() => setSlipModalOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <p>Order Reference: <strong className="font-mono text-slate-900">#{slipModalOrder.orderNumber}</strong></p>
              <p>Payable Amount: <strong className="text-slate-900">{formatLKR(slipModalOrder.grandTotal)}</strong></p>
            </div>

            {slipSuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{slipSuccessMessage}</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Our Colombo accounts team will reconcile your statement and approve dispatch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSlipSubmit} className="space-y-4">
                {/* Photo / Screenshot Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Upload Transfer Screenshot or Deposit Receipt:
                  </label>
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                    <UploadCloud className="w-4 h-4 text-blue-600" />
                    <span>{slipImage ? 'Change Selected Screenshot' : 'Choose Receipt Screenshot / Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleSlipImageChange}
                    />
                  </label>

                  {slipImage && (
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slipImage}
                        alt="Slip Preview"
                        className="max-h-40 rounded-lg object-contain w-full bg-white"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transaction ID / Transfer Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={slipInput}
                    onChange={(e) => setSlipInput(e.target.value)}
                    placeholder="e.g. Transferred Rs. 4,440 from COMBANK App. Ref: 202610239481"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingSlip || (!slipImage && !slipInput.trim())}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSubmittingSlip ? 'Uploading...' : 'Submit Deposit Slip'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSlipModalOrder(null);
                      setSlipImage(null);
                      setSlipInput('');
                    }}
                    className="px-4 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                </div>

                <div className="text-center pt-1">
                  <a
                    href={`https://wa.me/94771234567?text=Hi%20LittleStyles!%20Here%20is%20my%20deposit%20slip%20for%20order%20${slipModalOrder.orderNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Or submit via WhatsApp (+94 77 123 4567)</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
