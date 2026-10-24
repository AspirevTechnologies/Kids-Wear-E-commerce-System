'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lock,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  DollarSign,
  Search,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  X,
  RefreshCw,
  LogOut,
  Building2,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Layers,
  ArrowUpRight,
  Store,
  Plus,
  Trash2,
  Edit2,
  Save,
  Sliders,
  Settings as SettingsIcon,
  MessageSquare,
  ShieldCheck,
  Percent,
  Upload,
  Image as ImageIcon,
  Camera,
  UploadCloud,
  Star,
} from 'lucide-react';
import { formatLKR } from '@/shared/utils/currency';
import { OrderStatus, PaymentMethod, PaymentStatus, BankAccountDetails } from '@/shared/types/common';
import { StoreSettings, DistrictDeliveryRate } from '@/core/entities/StoreSettings';
import { SRI_LANKA_DISTRICTS } from '@/core/constants/SriLankaDistricts';

export default function AdminDashboardPage() {
  // Authentication gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected Order for Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState<boolean>(false);
  const [orderUpdateFeedback, setOrderUpdateFeedback] = useState<string>('');
  const [selectedFulfillmentStatus, setSelectedFulfillmentStatus] = useState<string>('');
  const [courierTracking, setCourierTracking] = useState<string>('');

  // Product Editing / Adding State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [productForm, setProductForm] = useState<{
    title: string;
    category: string;
    fabric: string;
    sellingPrice: number;
    mrp: number;
    offerPercentage: number;
    description: string;
    images: string[];
    variants: Array<{ size: string; stock: number }>;
    sizeChartType: 'baby' | 'toddler' | 'junior' | 'custom';
    sizeChartImage: string;
    sizeNotes: string;
    deliveryFeeType: 'default' | 'free' | 'custom';
    customDeliveryFee: number;
  }>({
    title: '',
    category: 'Dresses & Frocks',
    fabric: '100% GOTS Organic Cotton',
    sellingPrice: 2990,
    mrp: 3500,
    offerPercentage: 15,
    description: '',
    images: ['/images/products/floral-dress.jpg'],
    variants: [
      { size: '2-3Y', stock: 10 },
      { size: '3-4Y', stock: 12 },
      { size: '4-5Y', stock: 8 },
    ],
    sizeChartType: 'toddler',
    sizeChartImage: '',
    sizeNotes: '',
    deliveryFeeType: 'default',
    customDeliveryFee: 350,
  });
  const [newProductImageUrl, setNewProductImageUrl] = useState<string>('');
  const [productFeedback, setProductFeedback] = useState<string>('');

  // Settings State & Feedback
  const [settingsForm, setSettingsForm] = useState<StoreSettings | null>(null);
  const [settingsFeedback, setSettingsFeedback] = useState<string>('');
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // New Bank Account Modal / Inline Form
  const [newBankForm, setNewBankForm] = useState<BankAccountDetails>({
    bankName: '',
    accountName: 'LittleStyles Kids Wear (Pvt) Ltd',
    accountNumber: '',
    branch: '',
    branchCode: '',
    swiftCode: '',
  });
  const [isAddingBank, setIsAddingBank] = useState<boolean>(false);

  // New District Delivery Rate Creator State
  const [isAddingDistrictRate, setIsAddingDistrictRate] = useState<boolean>(false);
  const [newDistrictRateForm, setNewDistrictRateForm] = useState<{
    name: string;
    districts: string[];
    fee: number;
    estimatedDays: string;
  }>({
    name: '',
    districts: ['Colombo'],
    fee: 400,
    estimatedDays: '1-2 Business Days',
  });

  // Custom Categories Management State
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');

  const defaultCategoryList = [
    'Dresses & Frocks',
    'Rompers & Onesies',
    'T-Shirts & Tops',
    'Pants & Shorts',
    'Sleepwear & Pyjamas',
    'Festive & Ethnic Wear',
    'Accessories & Shoes',
  ];

  const availableCategories = Array.from(
    new Set([
      ...defaultCategoryList,
      ...(settingsForm?.categories || []),
      ...products.map((p) => p.category).filter(Boolean),
    ])
  );

  // Check existing session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('ls_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 2026
    if (pinInput.trim() === '2026' || pinInput.trim() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('ls_admin_auth', 'true');
      setAuthError('');
      fetchDashboardData();
    } else {
      setAuthError('Invalid Admin PIN. Please enter 2026.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ls_admin_auth');
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/products'),
        fetch('/api/admin/settings'),
      ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      const settingsData = await settingsRes.json();

      if (ordersData.success) {
        setOrders(ordersData.orders || []);
      }
      if (productsData.success) {
        setProducts(productsData.products || []);
      }
      if (settingsData.success && settingsData.settings) {
        setSettings(settingsData.settings);
        setSettingsForm(settingsData.settings);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // ORDER ACTIONS
  // -------------------------------------------------------------
  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: PaymentStatus, note?: string) => {
    setIsUpdatingOrder(true);
    setOrderUpdateFeedback('');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentStatus: newPaymentStatus,
          verificationNotes: note,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderUpdateFeedback('Payment status updated successfully!');
        setSelectedOrder(data.order);
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      } else {
        setOrderUpdateFeedback(data.message || 'Update failed');
      }
    } catch (err: any) {
      setOrderUpdateFeedback(err.message || 'Error updating payment');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleUpdateFulfillment = async (orderId: string) => {
    if (!selectedFulfillmentStatus) return;
    setIsUpdatingOrder(true);
    setOrderUpdateFeedback('');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          orderStatus: selectedFulfillmentStatus,
          trackingNumber: courierTracking.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderUpdateFeedback('Fulfillment status updated successfully!');
        setSelectedOrder(data.order);
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      } else {
        setOrderUpdateFeedback(data.message || 'Update failed');
      }
    } catch (err: any) {
      setOrderUpdateFeedback(err.message || 'Error updating order');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // -------------------------------------------------------------
  // PRODUCT ACTIONS
  // -------------------------------------------------------------
  const handleToggleProductStock = async (productId: string, currentInStock: boolean) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          inStock: !currentInStock,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? data.product : p)));
      }
    } catch (err) {
      console.error('Failed to toggle stock:', err);
    }
  };

  const handleQuickUpdateStock = async (productId: string, size: string, newStock: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const updatedVariants = prod.variants.map((v: any) =>
      v.size === size ? { ...v, stock: Math.max(0, newStock) } : v
    );
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          variants: updatedVariants,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? data.product : p)));
      }
    } catch (err) {
      console.error('Failed to quick update stock:', err);
    }
  };

  // Price & Offer auto-calculation
  const handlePriceChange = (field: 'sellingPrice' | 'mrp', value: number) => {
    setProductForm((prev) => {
      const sp = field === 'sellingPrice' ? value : prev.sellingPrice;
      const mrp = field === 'mrp' ? value : prev.mrp;
      const autoOffer = mrp > sp && mrp > 0 ? Math.round(((mrp - sp) / mrp) * 100) : 0;
      return {
        ...prev,
        [field]: value,
        offerPercentage: autoOffer,
      };
    });
  };

  const handleOfferChange = (offerVal: number) => {
    setProductForm((prev) => {
      const pct = Math.max(0, Math.min(99, offerVal));
      const newSp = prev.mrp > 0 && pct > 0 ? Math.round(prev.mrp * (1 - pct / 100)) : prev.sellingPrice;
      return {
        ...prev,
        offerPercentage: pct,
        sellingPrice: newSp,
      };
    });
  };

  // Size variant management
  const handleAddSizeVariant = (sizeName: string = '') => {
    setProductForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: sizeName || `Size ${prev.variants.length + 1}`, stock: 10 }],
    }));
  };

  const handleUpdateSizeStock = (index: number, stock: number) => {
    setProductForm((prev) => {
      const next = [...prev.variants];
      next[index] = { ...next[index], stock: Math.max(0, stock) };
      return { ...prev, variants: next };
    });
  };

  const handleUpdateSizeName = (index: number, size: string) => {
    setProductForm((prev) => {
      const next = [...prev.variants];
      next[index] = { ...next[index], size };
      return { ...prev, variants: next };
    });
  };

  const handleRemoveSizeVariant = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setProductForm((prev) => ({
              ...prev,
              images: [...prev.images.filter((img) => img !== '/images/products/floral-dress.jpg' || prev.images.length > 1), reader.result as string],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddProductImageUrl = (urlToAdd?: string) => {
    const url = (urlToAdd || newProductImageUrl).trim();
    if (!url) return;
    setProductForm((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
    setNewProductImageUrl('');
  };

  const handleSetCoverImage = (index: number) => {
    setProductForm((prev) => {
      const updated = [...prev.images];
      const [promoted] = updated.splice(index, 1);
      updated.unshift(promoted);
      return { ...prev, images: updated };
    });
  };

  const handleRemoveProductImage = (index: number) => {
    setProductForm((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updated.length > 0 ? updated : ['/images/products/floral-dress.jpg'] };
    });
  };

  const handleSizeChartUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setProductForm((prev) => ({
          ...prev,
          sizeChartImage: reader.result as string,
          sizeChartType: 'custom',
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFeedback('');
    try {
      if (editingProduct) {
        // Edit existing product
        const res = await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: editingProduct.id,
            title: productForm.title,
            category: productForm.category,
            fabric: productForm.fabric,
            sellingPrice: Number(productForm.sellingPrice),
            mrp: Number(productForm.mrp),
            offerPercentage: Number(productForm.offerPercentage),
            description: productForm.description,
            images: productForm.images,
            variants: productForm.variants,
            sizeChartType: productForm.sizeChartType,
            sizeChartImage: productForm.sizeChartImage,
            sizeNotes: productForm.sizeNotes,
            deliveryFeeType: productForm.deliveryFeeType,
            customDeliveryFee: Number(productForm.customDeliveryFee),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? data.product : p)));
          setEditingProduct(null);
          setProductFeedback('Product updated successfully!');
        } else {
          setProductFeedback(data.message || 'Update failed');
        }
      } else {
        // Create new product
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [data.product, ...prev]);
          setIsAddingProduct(false);
          setProductFeedback('New product published successfully!');
        } else {
          setProductFeedback(data.message || 'Creation failed');
        }
      }
    } catch (err: any) {
      setProductFeedback(err.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product from the storefront?')) return;
    try {
      const res = await fetch(`/api/admin/products?productId=${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // -------------------------------------------------------------
  // SETTINGS ACTIONS (Bank Accounts, Delivery Fees, Contact Info)
  // -------------------------------------------------------------
  const handleSaveSettings = async (section: 'all' | 'delivery' | 'contact' | 'banks') => {
    if (!settingsForm) return;
    setIsSavingSettings(true);
    setSettingsFeedback('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSettingsForm(data.settings);
        setSettingsFeedback('Settings successfully updated and synchronized across website!');
        setTimeout(() => setSettingsFeedback(''), 4000);
      } else {
        setSettingsFeedback(data.message || 'Save failed');
      }
    } catch (err: any) {
      setSettingsFeedback(err.message || 'Error saving settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddDistrictRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrictRateForm.name || !settingsForm) return;
    const newRate: DistrictDeliveryRate = {
      id: `rate-${Date.now()}`,
      name: newDistrictRateForm.name,
      districts: newDistrictRateForm.districts.length > 0 ? newDistrictRateForm.districts : ['Colombo'],
      fee: Number(newDistrictRateForm.fee) || 400,
      estimatedDays: newDistrictRateForm.estimatedDays || '1-2 Business Days',
    };
    const currentRates = settingsForm.delivery?.districtRates || [];
    setSettingsForm({
      ...settingsForm,
      delivery: {
        ...settingsForm.delivery,
        districtRates: [...currentRates, newRate],
      },
    });
    setNewDistrictRateForm({
      name: '',
      districts: ['Colombo'],
      fee: 400,
      estimatedDays: '1-2 Business Days',
    });
    setIsAddingDistrictRate(false);
  };

  const handleDeleteDistrictRate = (rateId: string) => {
    if (!settingsForm) return;
    const currentRates = settingsForm.delivery?.districtRates || [];
    setSettingsForm({
      ...settingsForm,
      delivery: {
        ...settingsForm.delivery,
        districtRates: currentRates.filter((r) => r.id !== rateId),
      },
    });
  };

  const handleUpdateDistrictRateFee = (rateId: string, fee: number) => {
    if (!settingsForm) return;
    const currentRates = settingsForm.delivery?.districtRates || [];
    setSettingsForm({
      ...settingsForm,
      delivery: {
        ...settingsForm.delivery,
        districtRates: currentRates.map((r) => (r.id === rateId ? { ...r, fee } : r)),
      },
    });
  };

  const handleToggleDistrictInNewRate = (district: string) => {
    setNewDistrictRateForm((prev) => {
      const exists = prev.districts.includes(district);
      if (exists) {
        return { ...prev, districts: prev.districts.filter((d) => d !== district) };
      }
      return { ...prev, districts: [...prev.districts, district] };
    });
  };

  const handleAddNewCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    const updatedCategories = Array.from(new Set([...availableCategories, trimmed]));
    setProductForm((prev) => ({ ...prev, category: trimmed }));
    if (settingsForm) {
      setSettingsForm({ ...settingsForm, categories: updatedCategories });
      fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: updatedCategories }),
      }).catch(() => {});
    }
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
    if (!settingsForm) return;
    const updated = (settingsForm.categories || availableCategories).filter((c) => c !== categoryToDelete);
    setSettingsForm({ ...settingsForm, categories: updated });
    fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: updated }),
    }).catch(() => {});
  };

  const handleAddBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankForm.bankName || !newBankForm.accountNumber) return;
    if (!settingsForm) return;

    const updatedBanks = [...settingsForm.bankAccounts, { ...newBankForm }];
    setSettingsForm({
      ...settingsForm,
      bankAccounts: updatedBanks,
    });
    setNewBankForm({
      bankName: '',
      accountName: 'LittleStyles Kids Wear (Pvt) Ltd',
      accountNumber: '',
      branch: '',
      branchCode: '',
      swiftCode: '',
    });
    setIsAddingBank(false);
  };

  const handleDeleteBankAccount = (index: number) => {
    if (!settingsForm) return;
    const updated = settingsForm.bankAccounts.filter((_, idx) => idx !== index);
    setSettingsForm({ ...settingsForm, bankAccounts: updated });
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => {
    if (o.paymentStatus === PaymentStatus.PAID || o.paymentStatus === PaymentStatus.COD_COLLECTED) {
      return sum + (o.grandTotal || 0);
    }
    return sum;
  }, 0);

  const pendingBankTransfers = orders.filter(
    (o) =>
      o.paymentMethod === PaymentMethod.BANK_TRANSFER &&
      (o.paymentStatus === PaymentStatus.VERIFICATION_PENDING || o.paymentStatus === PaymentStatus.AWAITING_TRANSFER)
  );

  const activeCodOrders = orders.filter(
    (o) => o.paymentMethod === PaymentMethod.COD && o.paymentStatus === PaymentStatus.COD_PENDING
  );

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress?.phone?.includes(searchQuery) ||
      o.shippingAddress?.city?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'bank_pending') {
      return (
        o.paymentMethod === PaymentMethod.BANK_TRANSFER &&
        (o.paymentStatus === PaymentStatus.VERIFICATION_PENDING || o.paymentStatus === PaymentStatus.AWAITING_TRANSFER)
      );
    }
    if (statusFilter === 'cod') {
      return o.paymentMethod === PaymentMethod.COD;
    }
    if (statusFilter === 'in_fulfilment') {
      return (
        o.status === OrderStatus.CONFIRMED ||
        o.status === OrderStatus.SHIPPED ||
        o.status === OrderStatus.OUT_FOR_DELIVERY ||
        o.status === OrderStatus.PROCESSING
      );
    }
    if (statusFilter === 'delivered') {
      return o.status === OrderStatus.DELIVERED;
    }
    return true;
  });

  // -------------------------------------------------------------
  // LOGIN SCREEN IF NOT AUTHENTICATED
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:py-16 bg-[#FAF6F3]">
        <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl grid grid-cols-1 md:grid-cols-2">
          {/* Left Brand Visual Column */}
          <div className="relative min-h-[260px] md:min-h-[460px] bg-slate-900 text-white p-8 flex flex-col justify-between overflow-hidden">
            <Image
              src="/images/hero-kids.jpg"
              alt="LittleStyles Merchant Operations"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent" />

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold text-rose-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Colombo Operations Node</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
                LittleStyles Merchant Cloud
              </h2>
            </div>

            <div className="relative z-10 space-y-3 pt-6 border-t border-white/15">
              <p className="text-xs text-slate-200 leading-relaxed font-light">
                Direct portal for Sri Lankan islandwide COD fulfillment, instant manual bank slip verification, and real-time inventory management.
              </p>
              <div className="flex items-center gap-4 text-[11px] text-rose-200 font-semibold">
                <span>✓ 25 Districts</span>
                <span>•</span>
                <span>✓ COMBANK / BOC / HNB</span>
                <span>•</span>
                <span>✓ Zero Gateway Fees</span>
              </div>
            </div>
          </div>

          {/* Right PIN Entry Form */}
          <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#FF758F] flex items-center justify-center border border-rose-200">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                Seller Staff Sign-In
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your authorized 4-digit staff PIN to unlock daily order management, slip approvals, and product controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Admin Security PIN
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  maxLength={10}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-center text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#FF758F] focus:border-transparent transition-all shadow-inner bg-slate-50/50"
                />
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Demo Staff PIN:</span>
                  <button
                    type="button"
                    onClick={() => setPinInput('2026')}
                    className="font-bold text-[#FF758F] hover:text-[#F0627D] underline underline-offset-2"
                  >
                    Quick-Fill &quot;2026&quot;
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 text-center animate-shake">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#FF758F] hover:bg-[#F0627D] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-rose-500/20 transition-all active:scale-98"
              >
                Access Seller Dashboard
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link href="/" className="inline-flex items-center gap-1.5 font-bold hover:text-slate-900 transition-colors">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span>Return to Storefront</span>
              </Link>
              <Link href="/dashboard" className="font-semibold text-[#FF758F] hover:text-[#F0627D]">
                Customer Tracker →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED SELLER DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAF6F3] pb-24">
      {/* Top Admin Header */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#FF758F] flex items-center justify-center font-bold border border-rose-200">
              LS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 font-serif">LittleStyles Seller Admin</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Live Operations
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Sri Lanka Local E-Commerce • AspireV SADP Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              type="button"
              onClick={fetchDashboardData}
              title="Refresh Data"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF758F]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-slate-500" />
              <span>View Store</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto text-xs font-bold pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#FF758F] text-[#FF758F]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Fulfillment ({orders.length})</span>
            {pendingBankTransfers.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">
                {pendingBankTransfers.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#FF758F] text-[#FF758F]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Product Catalog & Pricing ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#FF758F] text-[#FF758F]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Bank & Store Settings</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI METRIC CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Gross Settled Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-serif">{formatLKR(totalRevenue)}</div>
            <p className="text-[11px] text-slate-400">Verified bank transfers & COD collected</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Total Orders</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-serif">{orders.length}</div>
            <p className="text-[11px] text-slate-400">Guest checkout islandwide</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-amber-200 bg-amber-50/20 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider">
              <span>Pending Bank Verification</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-900 font-serif">
              {pendingBankTransfers.length}
            </div>
            <p className="text-[11px] text-amber-700 font-medium">Deposit slips to inspect</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-rose-200 bg-rose-50/20 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-rose-800 text-xs font-bold uppercase tracking-wider">
              <span>COD In-Transit</span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#FF758F] flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-900 font-serif">{activeCodOrders.length}</div>
            <p className="text-[11px] text-rose-700 font-medium">Pending cash collection</p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ORDERS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('bank_pending')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    statusFilter === 'bank_pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <span>Bank Slip Verification</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/30">
                    {pendingBankTransfers.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('cod')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === 'cod'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  COD Orders ({orders.filter((o) => o.paymentMethod === PaymentMethod.COD).length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('in_fulfilment')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === 'in_fulfilment'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  In Fulfilment ({orders.filter((o) => o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.SHIPPED || o.status === OrderStatus.OUT_FOR_DELIVERY).length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('delivered')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === 'delivered'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  Delivered ({orders.filter((o) => o.status === OrderStatus.DELIVERED).length})
                </button>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order #, customer, phone..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF758F] focus:border-transparent font-medium"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No Orders Match Criteria</h3>
                  <p className="text-xs text-slate-500">Try clearing filters or search query.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-6">Order Ref</th>
                        <th className="py-4 px-6">Customer & District</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Items</th>
                        <th className="py-4 px-6">Total (LKR)</th>
                        <th className="py-4 px-6">Payment Status</th>
                        <th className="py-4 px-6">Fulfillment</th>
                        <th className="py-4 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {filteredOrders.map((order) => {
                        const isBankPending =
                          order.paymentMethod === PaymentMethod.BANK_TRANSFER &&
                          (order.paymentStatus === PaymentStatus.VERIFICATION_PENDING ||
                            order.paymentStatus === PaymentStatus.AWAITING_TRANSFER);

                        return (
                          <tr
                            key={order.id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isBankPending ? 'bg-amber-50/30' : ''
                            }`}
                          >
                            <td className="py-4 px-6">
                              <span className="font-mono font-black text-slate-900 block">
                                {order.orderNumber}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase">
                                {order.paymentMethod === PaymentMethod.COD ? 'Doorstep COD' : 'Direct Bank Deposit'}
                              </span>
                            </td>

                            <td className="py-4 px-6">
                              <span className="font-bold text-slate-900 block truncate max-w-[160px]">
                                {order.shippingAddress?.fullName}
                              </span>
                              <span className="text-[11px] text-slate-500 block">
                                {order.shippingAddress?.city}, {order.shippingAddress?.district}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                {order.shippingAddress?.phone}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-slate-500 text-[11px] whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>

                            <td className="py-4 px-6">
                              <span className="font-bold text-slate-800">
                                {order.items?.reduce((s: number, i: any) => s + i.quantity, 0)} pcs
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                                {order.items?.[0]?.product?.title}
                              </span>
                            </td>

                            <td className="py-4 px-6 font-black text-slate-900 whitespace-nowrap">
                              {formatLKR(order.grandTotal)}
                            </td>

                            <td className="py-4 px-6 whitespace-nowrap">
                              {order.paymentStatus === PaymentStatus.PAID && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>PAID</span>
                                </span>
                              )}
                              {order.paymentStatus === PaymentStatus.COD_COLLECTED && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>COD COLLECTED</span>
                                </span>
                              )}
                              {order.paymentStatus === PaymentStatus.COD_PENDING && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                  <Clock className="w-3 h-3" />
                                  <span>COD PENDING</span>
                                </span>
                              )}
                              {order.paymentStatus === PaymentStatus.VERIFICATION_PENDING && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                                  <AlertCircle className="w-3 h-3 text-amber-700" />
                                  <span>SLIP UPLOADED</span>
                                </span>
                              )}
                              {order.paymentStatus === PaymentStatus.AWAITING_TRANSFER && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  <Clock className="w-3 h-3" />
                                  <span>AWAITING SLIP</span>
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-6 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                                  order.status === OrderStatus.DELIVERED
                                    ? 'bg-purple-100 text-purple-800'
                                    : order.status === OrderStatus.SHIPPED || order.status === OrderStatus.OUT_FOR_DELIVERY
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : order.status === OrderStatus.CONFIRMED
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setSelectedFulfillmentStatus(order.status);
                                  setOrderUpdateFeedback('');
                                  setCourierTracking('');
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-[#FF758F] text-white text-[11px] font-bold transition-all shadow-xs"
                              >
                                Manage Order
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PRODUCT INVENTORY & PRICING */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-serif">Product Catalog & Stock Control</h2>
                <p className="text-xs text-slate-500">
                  Edit prices, product specifications, stock status, or add new items to the live boutique storefront.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      title: '',
                      category: 'Dresses & Frocks',
                      fabric: '100% GOTS Organic Cotton',
                      sellingPrice: 2990,
                      mrp: 3500,
                      offerPercentage: 15,
                      description: '',
                      variants: [
                        { size: '2-3Y', stock: 10 },
                        { size: '3-4Y', stock: 12 },
                        { size: '4-5Y', stock: 8 },
                      ],
                      sizeChartType: 'toddler',
                      sizeChartImage: '',
                      sizeNotes: '',
                      deliveryFeeType: 'default',
                      customDeliveryFee: 350,
                      images: ['/images/products/floral-dress.jpg'],
                    });
                    setIsAddingProduct(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#FF758F] text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl">
                  {products.length} Products Live
                </span>
              </div>
            </div>

            {productFeedback && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{productFeedback}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const totalStock = product.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0;
                const inStock = totalStock > 0;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between"
                  >
                    <div className="p-5 flex gap-4 items-start">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="w-20 h-24 object-cover object-top rounded-2xl bg-stone-50 shrink-0 border border-slate-100"
                      />
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">
                              {product.category}
                            </span>
                            {product.offerPercentage > 0 && (
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                                {product.offerPercentage}% OFF
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(product);
                              const autoOffer =
                                product.mrp > product.sellingPrice
                                  ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
                                  : 0;
                              setProductForm({
                                title: product.title,
                                category: product.category,
                                fabric: product.fabric,
                                sellingPrice: product.sellingPrice,
                                mrp: product.mrp,
                                offerPercentage: typeof product.offerPercentage === 'number' ? product.offerPercentage : autoOffer,
                                description: product.description || '',
                                variants:
                                  product.variants && product.variants.length > 0
                                    ? product.variants.map((v: any) => ({ size: v.size, stock: v.stock }))
                                    : [
                                        { size: '2-3Y', stock: 10 },
                                        { size: '3-4Y', stock: 12 },
                                        { size: '4-5Y', stock: 8 },
                                      ],
                                sizeChartType: product.sizeChartType || 'toddler',
                                sizeChartImage: product.sizeChartImage || '',
                                sizeNotes: product.sizeNotes || '',
                                deliveryFeeType: product.deliveryFeeType || 'default',
                                customDeliveryFee: product.customDeliveryFee || 350,
                                images: product.images && product.images.length > 0 ? [...product.images] : ['/images/products/floral-dress.jpg'],
                              });
                              setIsAddingProduct(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
                            title="Edit details & price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate">{product.fabric}</p>
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-sm font-black text-rose-600 font-serif">
                            {formatLKR(product.sellingPrice)}
                          </span>
                          <span className="text-[11px] text-slate-400 line-through">
                            {formatLKR(product.mrp)}
                          </span>
                        </div>

                        {/* Interactive Stock per Size Controller */}
                        <div className="pt-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span>Stock per Size:</span>
                            <span className="text-slate-500 font-mono">Total: {totalStock} pcs</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {product.variants?.map((v: any) => (
                              <div
                                key={v.size}
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                                  v.stock > 0
                                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                                    : 'bg-red-50 border-red-200 text-red-600'
                                }`}
                              >
                                <span className="font-sans font-extrabold text-[10px] text-slate-900">{v.size}:</span>
                                <button
                                  type="button"
                                  onClick={() => handleQuickUpdateStock(product.id, v.size, Math.max(0, v.stock - 1))}
                                  className="w-3.5 h-3.5 rounded bg-white hover:bg-rose-100 text-slate-500 hover:text-rose-700 flex items-center justify-center text-[10px] font-bold border border-slate-200"
                                  title="Decrease quantity by 1"
                                >
                                  -
                                </button>
                                <span className={`min-w-4 text-center text-[11px] font-black ${v.stock === 0 ? 'text-red-600' : 'text-slate-900'}`}>
                                  {v.stock}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQuickUpdateStock(product.id, v.size, v.stock + 1)}
                                  className="w-3.5 h-3.5 rounded bg-white hover:bg-emerald-100 text-slate-500 hover:text-emerald-700 flex items-center justify-center text-[10px] font-bold border border-slate-200"
                                  title="Increase quantity by 1"
                                >
                                  +
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-1 flex items-center gap-2 flex-wrap text-[10px]">
                          {product.deliveryFeeType === 'free' && (
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              🚚 FREE Delivery
                            </span>
                          )}
                          {product.deliveryFeeType === 'custom' && (
                            <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              🚚 Custom Fee: Rs. {product.customDeliveryFee}
                            </span>
                          )}
                          {product.sizeChartImage && (
                            <span className="font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              ✓ Size Chart
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            inStock ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-700">
                          {inStock ? `In Stock (${totalStock})` : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleProductStock(product.id, inStock)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            inStock
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: BANK & STORE SETTINGS (Live Admin Control) */}
        {/* ========================================================= */}
        {activeTab === 'settings' && settingsForm && (
          <div className="space-y-8">
            {settingsFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{settingsFeedback}</span>
                </div>
                <button type="button" onClick={() => setSettingsFeedback('')} className="text-emerald-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Bank Accounts & Category Taxonomy */}
              <div className="lg:col-span-6 space-y-8">
                {/* Corporate Bank Accounts Card */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF758F] flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 font-serif">Corporate Bank Accounts</h2>
                      <p className="text-xs text-slate-500">Live accounts shown to customers during bank transfer checkout</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingBank(!isAddingBank)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#FF758F] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Bank</span>
                  </button>
                </div>

                {/* Add New Bank Form */}
                {isAddingBank && (
                  <form onSubmit={handleAddBankAccount} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase">New Bank Account</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Bank Name</label>
                        <input
                          type="text"
                          required
                          value={newBankForm.bankName}
                          onChange={(e) => setNewBankForm({ ...newBankForm, bankName: e.target.value })}
                          placeholder="e.g. Sampath Bank"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Account Number</label>
                        <input
                          type="text"
                          required
                          value={newBankForm.accountNumber}
                          onChange={(e) => setNewBankForm({ ...newBankForm, accountNumber: e.target.value })}
                          placeholder="e.g. 018293847"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Branch & Code</label>
                        <input
                          type="text"
                          value={newBankForm.branch}
                          onChange={(e) => setNewBankForm({ ...newBankForm, branch: e.target.value })}
                          placeholder="e.g. Colombo Fort (001)"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Swift Code</label>
                        <input
                          type="text"
                          value={newBankForm.swiftCode}
                          onChange={(e) => setNewBankForm({ ...newBankForm, swiftCode: e.target.value })}
                          placeholder="e.g. BSAMLKLX"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingBank(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                      >
                        Add to List
                      </button>
                    </div>
                  </form>
                )}

                {/* Bank Accounts List with In-Place Editing */}
                <div className="space-y-4">
                  {settingsForm.bankAccounts.map((bank, index) => (
                    <div key={index} className="p-4 rounded-2xl bg-[#FAF6F3] border border-rose-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={bank.bankName}
                          onChange={(e) => {
                            const updated = [...settingsForm.bankAccounts];
                            updated[index].bankName = e.target.value;
                            setSettingsForm({ ...settingsForm, bankAccounts: updated });
                          }}
                          className="font-black text-slate-900 bg-transparent border-b border-dashed border-slate-300 text-sm focus:outline-none focus:border-[#FF758F]"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteBankAccount(index)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-md"
                          title="Delete Bank"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Account Number</span>
                          <input
                            type="text"
                            value={bank.accountNumber}
                            onChange={(e) => {
                              const updated = [...settingsForm.bankAccounts];
                              updated[index].accountNumber = e.target.value;
                              setSettingsForm({ ...settingsForm, bankAccounts: updated });
                            }}
                            className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 w-full text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Account Name</span>
                          <input
                            type="text"
                            value={bank.accountName}
                            onChange={(e) => {
                              const updated = [...settingsForm.bankAccounts];
                              updated[index].accountName = e.target.value;
                              setSettingsForm({ ...settingsForm, bankAccounts: updated });
                            }}
                            className="font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 w-full text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Branch & Code</span>
                          <input
                            type="text"
                            value={bank.branch}
                            onChange={(e) => {
                              const updated = [...settingsForm.bankAccounts];
                              updated[index].branch = e.target.value;
                              setSettingsForm({ ...settingsForm, bankAccounts: updated });
                            }}
                            className="text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 w-full text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Swift Code</span>
                          <input
                            type="text"
                            value={bank.swiftCode || ''}
                            onChange={(e) => {
                              const updated = [...settingsForm.bankAccounts];
                              updated[index].swiftCode = e.target.value;
                              setSettingsForm({ ...settingsForm, bankAccounts: updated });
                            }}
                            className="font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 w-full text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={isSavingSettings}
                    onClick={() => handleSaveSettings('banks')}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#FF758F] text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingSettings ? 'Saving...' : 'Save Bank Accounts'}</span>
                  </button>
                </div>
              </div>

                {/* Product Categories Manager */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF758F] flex items-center justify-center font-bold shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 font-serif">Store Product Categories</h2>
                        <p className="text-xs text-slate-500">Categories available for product assignment and storefront filters</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(!isAddingCategory)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#FF758F] text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  {isAddingCategory && (
                    <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-200 flex items-center gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Type new category name (e.g. Swimwear & Beach)..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewCategory();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddNewCategory()}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#FF758F] text-white text-xs font-bold transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(false)}
                        className="px-2 py-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {availableCategories.map((cat) => {
                      const count = products.filter((p) => p.category === cat).length;
                      return (
                        <div
                          key={cat}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-800 flex items-center gap-2 shadow-2xs"
                        >
                          <span>{cat}</span>
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold flex items-center justify-center">
                            {count}
                          </span>
                          {!defaultCategoryList.includes(cat) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat)}
                              className="text-slate-400 hover:text-red-600 p-0.5 ml-0.5"
                              title="Delete Category"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Delivery Rates & Store Contact Details */}
              <div className="lg:col-span-6 space-y-8">
                {/* Delivery Rates Editor */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 font-serif">Delivery & Courier Rates</h2>
                      <p className="text-xs text-slate-500">Live shipping fees calculated on checkout & cart</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Colombo 01 - 15 Fee</span>
                        <span className="text-[11px] text-slate-500">Same-Day / Next-Day Express</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-500">Rs.</span>
                        <input
                          type="number"
                          value={settingsForm.delivery.colomboFee}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              delivery: { ...settingsForm.delivery, colomboFee: Number(e.target.value) },
                            })
                          }
                          className="w-24 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-right text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Western Province Fee</span>
                        <span className="text-[11px] text-slate-500">Gampaha & Kalutara Districts</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-500">Rs.</span>
                        <input
                          type="number"
                          value={settingsForm.delivery.westernProvinceFee}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              delivery: { ...settingsForm.delivery, westernProvinceFee: Number(e.target.value) },
                            })
                          }
                          className="w-24 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-right text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Outstation (22 Districts) Fee</span>
                        <span className="text-[11px] text-slate-500">Domex & Pronto Courier</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-500">Rs.</span>
                        <input
                          type="number"
                          value={settingsForm.delivery.outstationFee}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              delivery: { ...settingsForm.delivery, outstationFee: Number(e.target.value) },
                            })
                          }
                          className="w-24 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-right text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-emerald-950 block">Free Shipping Threshold</span>
                        <span className="text-[11px] text-emerald-800">Orders above this receive free delivery</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-emerald-700">Rs.</span>
                        <input
                          type="number"
                          value={settingsForm.delivery.freeShippingThreshold}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              delivery: { ...settingsForm.delivery, freeShippingThreshold: Number(e.target.value) },
                            })
                          }
                          className="w-24 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-mono font-bold text-right text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block mb-1">COD Min Order (Rs.)</span>
                        <input
                          type="number"
                          value={settingsForm.delivery.codMinOrder}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              delivery: { ...settingsForm.delivery, codMinOrder: Number(e.target.value) },
                            })
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block mb-1">COD Max Order (Rs.)</span>
                        <input
                          type="number"
                          value={settingsForm.delivery.codMaxOrder}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              delivery: { ...settingsForm.delivery, codMaxOrder: Number(e.target.value) },
                            })
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                        />
                      </div>
                    </div>

                    {/* Custom District & Regional Groups Manager */}
                    <div className="pt-4 border-t border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 block">
                            Custom District Rates & Groups
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Create custom pricing for specific districts or group districts together
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsAddingDistrictRate(!isAddingDistrictRate)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#FF758F] text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add District Rate</span>
                        </button>
                      </div>

                      {/* Add District Rate Inline Form */}
                      {isAddingDistrictRate && (
                        <form onSubmit={handleAddDistrictRate} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                          <h4 className="text-xs font-bold text-slate-900 uppercase">New Custom District Rate / Group</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                Zone / Group Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={newDistrictRateForm.name}
                                onChange={(e) => setNewDistrictRateForm({ ...newDistrictRateForm, name: e.target.value })}
                                placeholder="e.g. Kandy Express or Southern Coastal"
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Delivery Fee (Rs.) *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min={0}
                                  value={newDistrictRateForm.fee}
                                  onChange={(e) => setNewDistrictRateForm({ ...newDistrictRateForm, fee: Number(e.target.value) })}
                                  placeholder="450"
                                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                  Estimated Days
                                </label>
                                <input
                                  type="text"
                                  value={newDistrictRateForm.estimatedDays}
                                  onChange={(e) => setNewDistrictRateForm({ ...newDistrictRateForm, estimatedDays: e.target.value })}
                                  placeholder="e.g. 1-2 Days"
                                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* District Click-to-Group Selector */}
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                              Select Covered Districts (Click to toggle in this group):
                            </label>
                            <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200">
                              {SRI_LANKA_DISTRICTS.map((d) => {
                                const isSelected = newDistrictRateForm.districts.includes(d.district);
                                return (
                                  <button
                                    key={d.district}
                                    type="button"
                                    onClick={() => handleToggleDistrictInNewRate(d.district)}
                                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                                      isSelected
                                        ? 'bg-blue-600 text-white shadow-2xs'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                  >
                                    {isSelected ? '✓ ' : '+ '}{d.district}
                                  </button>
                                );
                              })}
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              Selected: {newDistrictRateForm.districts.join(', ') || 'None selected'}
                            </span>
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setIsAddingDistrictRate(false)}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                            >
                              Add to Rates List
                            </button>
                          </div>
                        </form>
                      )}

                      {/* District Rates List */}
                      <div className="space-y-2.5">
                        {settingsForm.delivery.districtRates?.map((rate) => (
                          <div
                            key={rate.id}
                            className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900">{rate.name}</span>
                                <span className="text-[10px] text-slate-500 font-medium">({rate.estimatedDays})</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {rate.districts.map((dist) => (
                                  <span key={dist} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white text-slate-600 border border-slate-200">
                                    {dist === '*' ? 'All Other Outstation' : dist}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-slate-400 text-[11px]">Rs.</span>
                                <input
                                  type="number"
                                  min={0}
                                  value={rate.fee}
                                  onChange={(e) => handleUpdateDistrictRateFee(rate.id, Number(e.target.value))}
                                  className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg font-mono font-bold text-right text-xs"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteDistrictRate(rate.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete District Rate"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={isSavingSettings}
                      onClick={() => handleSaveSettings('delivery')}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingSettings ? 'Saving...' : 'Save Delivery Rates'}</span>
                    </button>
                  </div>
                </div>

                {/* Store Contact & WhatsApp Editor */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 font-serif">Store Contact & WhatsApp</h2>
                      <p className="text-xs text-slate-500">Contact links displayed across website and customer chats</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        WhatsApp Number (International without +)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.contact.whatsapp}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            contact: { ...settingsForm.contact, whatsapp: e.target.value },
                          })
                        }
                        placeholder="e.g. 94771234567"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Display Hotline Phone
                      </label>
                      <input
                        type="text"
                        value={settingsForm.contact.phone}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            contact: { ...settingsForm.contact, phone: e.target.value },
                          })
                        }
                        placeholder="e.g. 077 123 4567"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Showroom Address
                      </label>
                      <input
                        type="text"
                        value={settingsForm.contact.address}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            contact: { ...settingsForm.contact, address: e.target.value },
                          })
                        }
                        placeholder="e.g. No. 45, Galle Road, Colombo 03, Sri Lanka"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Operating Hours
                      </label>
                      <input
                        type="text"
                        value={settingsForm.contact.workingHours}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            contact: { ...settingsForm.contact, workingHours: e.target.value },
                          })
                        }
                        placeholder="e.g. Mon - Sat: 9:00 AM - 8:00 PM"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={isSavingSettings}
                      onClick={() => handleSaveSettings('contact')}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingSettings ? 'Saving...' : 'Save Contact Details'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================= */}
      {/* ORDER ACTION MODAL */}
      {/* ============================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                  MANAGE ORDER LIFECYCLE
                </span>
                <h3 className="text-xl font-black text-slate-900 font-serif">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderUpdateFeedback && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{orderUpdateFeedback}</span>
              </div>
            )}

            {/* Customer & Delivery Details */}
            <div className="p-4 rounded-2xl bg-[#FAF6F3] border border-rose-100/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Customer Details</span>
                <div className="font-bold text-slate-900 text-sm">{selectedOrder.shippingAddress?.fullName}</div>
                <div className="font-mono text-slate-700 flex items-center gap-1.5 pt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.shippingAddress?.phone}</span>
                </div>
                <a
                  href={`https://wa.me/94${selectedOrder.shippingAddress?.phone?.replace(/^0/, '')}?text=Hello%20${encodeURIComponent(
                    selectedOrder.shippingAddress?.fullName || 'Customer'
                  )}!%20This%20is%20LittleStyles%20regarding%20order%20${selectedOrder.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 pt-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Shipping Address</span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {selectedOrder.shippingAddress?.addressLine1}
                  {selectedOrder.shippingAddress?.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                  <br />
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.district}
                  <br />
                  Postal Code: {selectedOrder.shippingAddress?.pincode}
                </p>
              </div>
            </div>

            {/* FINANCIAL / PAYMENT STATUS ACTIONS */}
            <div className="p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Financial Payment Status</h4>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    Method: {selectedOrder.paymentMethod === PaymentMethod.COD ? 'Cash on Delivery (Doorstep)' : 'Direct Bank Transfer'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Grand Total</span>
                  <span className="text-lg font-black text-rose-600 font-serif">
                    {formatLKR(selectedOrder.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Bank Transfer Slip Inspector */}
              {selectedOrder.paymentMethod === PaymentMethod.BANK_TRANSFER && (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Bank Deposit Verification</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 font-bold border border-amber-200">
                      Ref: {selectedOrder.bankReference || 'None'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1.5">
                    <span className="text-slate-500 block text-[11px] font-bold">Customer Slip / Transaction Details:</span>
                    {selectedOrder.slipUrl ? (
                      selectedOrder.slipUrl.startsWith('data:image/') || selectedOrder.slipUrl.startsWith('http') ? (
                        <div className="space-y-2 mt-1">
                          <div className="p-2.5 bg-white rounded-xl border border-amber-300 shadow-sm inline-block max-w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={selectedOrder.slipUrl}
                              alt="Bank Transfer Slip Screenshot"
                              className="max-h-80 w-auto rounded-lg object-contain cursor-pointer hover:opacity-90"
                              onClick={() => {
                                const w = window.open('');
                                if (w) {
                                  w.document.write(`<img src="${selectedOrder.slipUrl}" style="max-width:100%;height:auto;margin:auto;display:block;" />`);
                                }
                              }}
                              title="Click to view full resolution"
                            />
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            ✓ Verified screenshot attached by customer. Click image to inspect full size.
                          </p>
                        </div>
                      ) : (
                        <p className="font-mono font-bold mt-0.5 bg-white p-2.5 rounded-lg border border-amber-200/80 text-slate-900">
                          {selectedOrder.slipUrl}
                        </p>
                      )
                    ) : (
                      <p className="text-xs italic text-slate-400 bg-white p-2.5 rounded-lg border border-amber-100">
                        No receipt slip or screenshot submitted yet by customer.
                      </p>
                    )}
                    {selectedOrder.verificationNotes && (
                      <p className="text-[11px] text-slate-500 mt-1 italic">{selectedOrder.verificationNotes}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedOrder.paymentStatus !== PaymentStatus.PAID ? (
                      <>
                        <button
                          type="button"
                          disabled={isUpdatingOrder}
                          onClick={() =>
                            handleUpdatePaymentStatus(
                              selectedOrder.id,
                              PaymentStatus.PAID,
                              `Verified in bank account by seller on ${new Date().toLocaleString()}`
                            )
                          }
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Verify & Mark as PAID</span>
                        </button>

                        <button
                          type="button"
                          disabled={isUpdatingOrder}
                          onClick={() =>
                            handleUpdatePaymentStatus(
                              selectedOrder.id,
                              PaymentStatus.AWAITING_TRANSFER,
                              `Slip flagged as unclear/unverified on ${new Date().toLocaleString()}. Please re-upload.`
                            )
                          }
                          className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold text-xs transition-colors"
                        >
                          Flag Slip / Request Re-upload
                        </button>
                      </>
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Payment Verified & Confirmed</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* COD Collection Toggle */}
              {selectedOrder.paymentMethod === PaymentMethod.COD && (
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-900 block">Doorstep Cash Collection</span>
                    <p className="text-[11px] text-blue-700">
                      {selectedOrder.paymentStatus === PaymentStatus.COD_COLLECTED
                        ? 'Cash collected and remitted by courier.'
                        : 'Awaiting courier delivery and doorstep cash collection.'}
                    </p>
                  </div>
                  {selectedOrder.paymentStatus !== PaymentStatus.COD_COLLECTED ? (
                    <button
                      type="button"
                      disabled={isUpdatingOrder}
                      onClick={() =>
                        handleUpdatePaymentStatus(
                          selectedOrder.id,
                          PaymentStatus.COD_COLLECTED,
                          `Cash remitted by courier on ${new Date().toLocaleString()}`
                        )
                      }
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                    >
                      Mark Cash Collected
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                      Cash Collected & Settled
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* FULFILLMENT STATUS UPDATE */}
            <div className="p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Update Fulfillment & Courier Dispatch
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Fulfillment Stage</label>
                  <select
                    value={selectedFulfillmentStatus}
                    onChange={(e) => setSelectedFulfillmentStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F]"
                  >
                    <option value={OrderStatus.PENDING_CONFIRMATION}>1. PENDING (Awaiting Review)</option>
                    <option value={OrderStatus.CONFIRMED}>2. CONFIRMED (Packed & Ready)</option>
                    <option value={OrderStatus.SHIPPED}>3. SHIPPED (Handed to Courier)</option>
                    <option value={OrderStatus.OUT_FOR_DELIVERY}>4. OUT FOR DELIVERY (Doorstep Dispatch)</option>
                    <option value={OrderStatus.DELIVERED}>5. DELIVERED (Completed)</option>
                    <option value={OrderStatus.CANCELLED}>6. CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Courier Partner & Tracking Ref
                  </label>
                  <input
                    type="text"
                    value={courierTracking}
                    onChange={(e) => setCourierTracking(e.target.value)}
                    placeholder="e.g. Prompt Xpress #PR-8321"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF758F]"
                  />
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setCourierTracking('Prompt Xpress #PR-' + Math.floor(1000 + Math.random() * 9000))}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      + Prompt Xpress
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourierTracking('Domex #DOM-' + Math.floor(10000 + Math.random() * 90000))}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      + Domex
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourierTracking('Pronto #PRO-' + Math.floor(1000 + Math.random() * 9000))}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      + Pronto
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={isUpdatingOrder}
                  onClick={() => handleUpdateFulfillment(selectedOrder.id)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#FF758F] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  {isUpdatingOrder ? 'Saving...' : 'Update Fulfillment'}
                </button>
              </div>
            </div>

            {/* Line Items List */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-400">Ordered Items</span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.title}
                        className="w-12 h-14 object-cover rounded-xl bg-slate-50 border border-slate-100"
                      />
                      <div>
                        <h5 className="font-bold text-slate-900">{item.product?.title}</h5>
                        <div className="text-[11px] text-slate-400">
                          Size: <strong className="text-slate-700">{item.selectedSize}</strong> • Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-black text-slate-900 font-serif">
                      {formatLKR(item.product?.sellingPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* PRODUCT ADD / EDIT MODAL (With Sizes, Quantities, Offer %, & Size Chart) */}
      {/* ============================================================= */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
                  INVENTORY & PRODUCT MANAGEMENT
                </span>
                <h3 className="text-xl font-black text-slate-900 font-serif">
                  {editingProduct ? 'Edit Product & Stock Variants' : 'Add New Kids Wear Item'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editingProduct ? `Updating SKU ${editingProduct.id}` : 'Publish new product with size variants & offer pricing'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingProduct(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              {/* Basic Information */}
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1">
                  1. Product Details
                </h4>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    placeholder="e.g. Pure Linen Organic Summer Romper"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#FF758F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">Category *</label>
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(!isAddingCategory)}
                        className="text-[10px] font-bold text-[#FF758F] hover:text-rose-700 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isAddingCategory ? 'Pick Existing' : '+ Add New Category'}</span>
                      </button>
                    </div>

                    {isAddingCategory ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g. Swimwear & Sun"
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#FF758F]"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewCategory();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddNewCategory()}
                          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-[#FF758F] text-white text-xs font-bold transition-colors"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingCategory(false)}
                          className="px-2 py-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <select
                        value={productForm.category}
                        onChange={(e) => {
                          if (e.target.value === '__add_new__') {
                            setIsAddingCategory(true);
                          } else {
                            setProductForm({ ...productForm, category: e.target.value });
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-[#FF758F]"
                      >
                        {availableCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="__add_new__">+ Add New Category...</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Fabric Composition</label>
                    <input
                      type="text"
                      value={productForm.fabric}
                      onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                      placeholder="e.g. 100% GOTS Organic Cotton"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF758F]"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Offer Percentage */}
              <div className="space-y-3 p-4 rounded-2xl bg-rose-50/40 border border-rose-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-rose-600" />
                    <span>2. Pricing & Offer Percentage</span>
                  </h4>
                  {productForm.offerPercentage > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] tracking-wide uppercase">
                      {productForm.offerPercentage}% OFF APPLIED
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">MRP Price (Rs.) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={productForm.mrp}
                      onChange={(e) => handlePriceChange('mrp', Number(e.target.value))}
                      placeholder="e.g. 3500"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-600 bg-white"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Original reference price</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Selling Price (Rs.) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={productForm.sellingPrice}
                      onChange={(e) => handlePriceChange('sellingPrice', Number(e.target.value))}
                      placeholder="e.g. 2990"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs font-black text-rose-600 bg-white"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Price customer will pay</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Offer Discount (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={productForm.offerPercentage}
                      onChange={(e) => handleOfferChange(Number(e.target.value))}
                      placeholder="e.g. 15"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-800 bg-white"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Auto-computed or custom</span>
                  </div>
                </div>

                {productForm.mrp > productForm.sellingPrice && (
                  <div className="p-2.5 rounded-xl bg-white border border-rose-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-600">
                      Customer saving on this item:
                    </span>
                    <strong className="text-emerald-700 font-bold">
                      {formatLKR(productForm.mrp - productForm.sellingPrice)} ({productForm.offerPercentage}% Discount)
                    </strong>
                  </div>
                )}
              </div>

              {/* Product Photo Gallery & Multiple Image Upload */}
              <div className="space-y-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#FF758F]" />
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                      3. Product Photo Gallery (Multiple Photos)
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-[#FF758F] font-black text-[10px]">
                    {productForm.images.length} {productForm.images.length === 1 ? 'Photo' : 'Photos'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Upload multiple angles for this product (Front, Back, Fabric close-up, On-Model). Customers can click or swipe thumbnails on the storefront. The first photo is automatically used as the <strong>Cover Photo</strong>.
                </p>

                {/* Upload & Add Bar */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="cursor-pointer px-4 py-2.5 bg-slate-900 hover:bg-[#FF758F] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs">
                    <UploadCloud className="w-4 h-4" />
                    <span>+ Upload Photos from Device</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newProductImageUrl}
                      onChange={(e) => setNewProductImageUrl(e.target.value)}
                      placeholder="Or paste photo URL (/images/products/...)"
                      className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddProductImageUrl();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddProductImageUrl()}
                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {productForm.images.map((img, idx) => (
                    <div
                      key={`${img}-${idx}`}
                      className={`relative aspect-4/5 rounded-2xl overflow-hidden border-2 bg-white group shadow-2xs ${
                        idx === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Photo angle ${idx + 1}`}
                        className="w-full h-full object-cover object-top"
                      />

                      {/* Cover Badge or Make Cover Button */}
                      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        {idx === 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-white" />
                            <span>COVER</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(idx)}
                            className="px-1.5 py-0.5 rounded-md bg-slate-900/80 hover:bg-emerald-600 text-white font-bold text-[9px] transition-colors shadow-sm"
                            title="Set as Main Cover Photo"
                          >
                            Set Cover
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveProductImage(idx)}
                          className="w-6 h-6 rounded-md bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-sm"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                        Angle #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Variants & Individual Stock Quantities */}
              <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                      4. Sizes & Individual Stock Quantities *
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Set individual stock for each size. Zero stock will show as sold out for that size.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-200 text-slate-800 font-bold text-[11px]">
                    Total: {productForm.variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)} Units
                  </span>
                </div>

                {/* Quick Add Presets */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Add Common Sizes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['0-3M', '3-6M', '6-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '7-8Y', '9-10Y'].map((s) => {
                      const alreadyAdded = productForm.variants.some((v) => v.size === s);
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => handleAddSizeVariant(s)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            alreadyAdded
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-300'
                          }`}
                        >
                          + {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Rows Repeater */}
                <div className="space-y-2 pt-1">
                  {productForm.variants.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="w-1/3">
                        <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Size Name</label>
                        <input
                          type="text"
                          required
                          value={v.size}
                          onChange={(e) => handleUpdateSizeName(idx, e.target.value)}
                          placeholder="e.g. 2-3Y"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold text-xs"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Stock Quantity (Units)</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={v.stock}
                          onChange={(e) => handleUpdateSizeStock(idx, Number(e.target.value))}
                          placeholder="0"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono text-xs font-bold"
                        />
                      </div>

                      <div className="text-right pt-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveSizeVariant(idx)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove Size"
                          disabled={productForm.variants.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddSizeVariant()}
                    className="px-3 py-1.5 rounded-xl bg-white border border-dashed border-slate-300 hover:border-slate-800 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Custom Size</span>
                  </button>
                </div>
              </div>

              {/* Size Chart & Fit Guide */}
              <div className="space-y-3 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                  <span>5. Size Chart & Fit Guide</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Size Chart Template</label>
                    <select
                      value={productForm.sizeChartType}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          sizeChartType: e.target.value as any,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                    >
                      <option value="toddler">Toddler Standard (2 - 6 Years)</option>
                      <option value="baby">Baby Standard (0 - 24 Months)</option>
                      <option value="junior">Junior Standard (6 - 12 Years)</option>
                      <option value="custom">Custom Size Chart (Upload Photo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Upload Size Chart Photo / Screenshot
                    </label>
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 bg-white cursor-pointer hover:border-slate-800 transition-colors">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-700 truncate">
                        {productForm.sizeChartImage ? 'Change Image...' : 'Pick Photo from Device...'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSizeChartUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Uploaded size chart image preview */}
                {productForm.sizeChartImage && (
                  <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={productForm.sizeChartImage}
                        alt="Size chart preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">Custom Size Chart Uploaded</span>
                        <span className="text-[10px] text-emerald-600 font-bold">✓ Ready to display on storefront</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductForm({ ...productForm, sizeChartImage: '', sizeChartType: 'toddler' })}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Fitting Advice for Parents (Optional)
                  </label>
                  <input
                    type="text"
                    value={productForm.sizeNotes}
                    onChange={(e) => setProductForm({ ...productForm, sizeNotes: e.target.value })}
                    placeholder="e.g. Regular fit. For chubby toddlers, recommend ordering one size up."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Product Delivery Fee Option */}
              <div className="space-y-3 p-4 rounded-2xl bg-blue-50/40 border border-blue-200/80">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>6. Delivery & Shipping Rule for this Product</span>
                  </h4>
                  <span className="text-[10px] text-blue-800 font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
                    Per-Product Delivery
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      productForm.deliveryFeeType === 'default'
                        ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryFeeType"
                      checked={productForm.deliveryFeeType === 'default'}
                      onChange={() => setProductForm({ ...productForm, deliveryFeeType: 'default' })}
                      className="sr-only"
                    />
                    <div className="font-bold text-xs text-slate-900">Standard Rates</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Calculated by district (Rs. 350 - 500)</div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      productForm.deliveryFeeType === 'free'
                        ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryFeeType"
                      checked={productForm.deliveryFeeType === 'free'}
                      onChange={() => setProductForm({ ...productForm, deliveryFeeType: 'free' })}
                      className="sr-only"
                    />
                    <div className="font-bold text-xs text-emerald-800">FREE Delivery</div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">Free islandwide shipping for this item</div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      productForm.deliveryFeeType === 'custom'
                        ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryFeeType"
                      checked={productForm.deliveryFeeType === 'custom'}
                      onChange={() => setProductForm({ ...productForm, deliveryFeeType: 'custom' })}
                      className="sr-only"
                    />
                    <div className="font-bold text-xs text-slate-900">Custom Flat Fee</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Set specific delivery price in Rs.</div>
                  </label>
                </div>

                {productForm.deliveryFeeType === 'custom' && (
                  <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center justify-between gap-3">
                    <label className="text-xs font-bold text-slate-700">Custom Delivery Fee (Rs.)</label>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-400">Rs.</span>
                      <input
                        type="number"
                        min={0}
                        value={productForm.customDeliveryFee}
                        onChange={(e) => setProductForm({ ...productForm, customDeliveryFee: Number(e.target.value) })}
                        placeholder="e.g. 250"
                        className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono font-bold text-right text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe fabric softness, features, occasions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-slate-900 hover:bg-[#FF758F] text-white font-extrabold uppercase tracking-wider transition-colors shadow-xs"
                >
                  {editingProduct ? 'Save Product Changes' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
