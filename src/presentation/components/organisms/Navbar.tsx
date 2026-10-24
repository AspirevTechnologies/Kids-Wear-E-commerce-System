'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/presentation/context/CartContext';
import { BrandLogo } from '@/presentation/components/atoms/BrandLogo';
import { AnnouncementBar } from '@/presentation/components/molecules/AnnouncementBar';
import { NavSearchModal } from '@/presentation/components/molecules/NavSearchModal';
import {
  ShoppingBag,
  Search,
  Heart,
  Truck,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  User,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { summary } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<string[]>([
    'Dresses & Frocks',
    'Rompers & Onesies',
    'T-Shirts & Tops',
    'Pants & Shorts',
    'Sleepwear & Pyjamas',
    'Festive & Ethnic Wear',
  ]);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (
          isMounted &&
          data?.settings?.categories &&
          Array.isArray(data.settings.categories) &&
          data.settings.categories.length > 0
        ) {
          setCategories(data.settings.categories);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Isolate Seller Admin Portal from customer storefront navigation
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // If on Seller Admin, do not render customer shopping header
  if (isAdmin) {
    return null;
  }

  // Dynamic active states
  const isHome = pathname === '/';
  const isShop = pathname === '/products' || pathname.startsWith('/products/');
  const isNewArrivals = pathname === '/products?filter=new';
  const isSale = pathname === '/products?category=sale';
  const isAbout = pathname === '/about';
  const isContact = pathname === '/contact';

  return (
    <header className="sticky top-0 z-40 bg-white w-full max-w-full transition-shadow duration-300">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation Bar */}
      <div className={`border-b border-slate-100 transition-all ${isScrolled ? 'shadow-sm bg-white/95 backdrop-blur-md' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Artisanal Luxury Boutique Logo */}
          <BrandLogo variant="navbar" />

          {/* Desktop Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[12px] font-bold tracking-[0.08em] uppercase text-slate-700" aria-label="Main Navigation">
            <Link
              href="/"
              className={`relative py-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F] rounded ${
                isHome
                  ? 'text-[#FF758F] border-b-2 border-[#FF758F] font-extrabold'
                  : 'hover:text-[#FF758F] text-slate-700'
              }`}
            >
              HOME
            </Link>

            {/* Shop Dropdown */}
            <div className="relative group cursor-pointer py-1 flex items-center gap-1 hover:text-[#FF758F] transition-colors">
              <Link
                href="/products"
                className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F] rounded ${
                  isShop && !isNewArrivals && !isSale ? 'text-[#FF758F] font-extrabold' : ''
                }`}
              >
                SHOP
              </Link>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#FF758F] transition-transform group-hover:rotate-180" aria-hidden="true" />

              <div className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 -translate-y-1 group-hover:translate-y-0 z-50">
                <Link href="/products?gender=Girls" className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FFF0F3] hover:text-[#FF758F] rounded-xl transition-colors">
                  Girls Collection (2-8Y)
                </Link>
                <Link href="/products?gender=Boys" className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FFF0F3] hover:text-[#FF758F] rounded-xl transition-colors">
                  Boys Collection (2-8Y)
                </Link>
                <Link href="/products?category=Rompers+%26+Onesies" className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FFF0F3] hover:text-[#FF758F] rounded-xl transition-colors">
                  Baby & Infants (0-12M)
                </Link>
                <Link href="/products" className="block px-3 py-2 text-xs font-bold text-[#FF758F] hover:bg-[#FFF0F3] rounded-xl transition-colors border-t border-slate-100 mt-1">
                  View All Outfits →
                </Link>
              </div>
            </div>

            <Link
              href="/products?filter=new"
              className={`hover:text-[#FF758F] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F] rounded ${
                isNewArrivals ? 'text-[#FF758F] border-b-2 border-[#FF758F] font-extrabold' : ''
              }`}
            >
              NEW ARRIVALS
            </Link>

            {/* Dynamic Categories Dropdown */}
            <div className="relative group cursor-pointer py-1 flex items-center gap-1 hover:text-[#FF758F] transition-colors">
              <span>CATEGORIES</span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#FF758F] transition-transform group-hover:rotate-180" aria-hidden="true" />

              <div className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 -translate-y-1 group-hover:translate-y-0 z-50 max-h-80 overflow-y-auto">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FFF0F3] hover:text-[#FF758F] rounded-xl transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
                <Link
                  href="/products"
                  className="block px-3 py-2 text-xs font-bold text-[#FF758F] hover:bg-[#FFF0F3] rounded-xl transition-colors border-t border-slate-100 mt-1"
                >
                  View All Outfits →
                </Link>
              </div>
            </div>

            <Link
              href="/products?category=sale"
              className={`hover:text-[#FF758F] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F] rounded ${
                isSale ? 'text-[#FF758F] border-b-2 border-[#FF758F] font-extrabold' : ''
              }`}
            >
              SALE
            </Link>
            <Link
              href="/about"
              className={`hover:text-[#FF758F] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F] rounded ${
                isAbout ? 'text-[#FF758F] border-b-2 border-[#FF758F] font-extrabold' : ''
              }`}
            >
              ABOUT US
            </Link>
            <Link
              href="/contact"
              className={`hover:text-[#FF758F] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF758F] rounded ${
                isContact ? 'text-[#FF758F] border-b-2 border-[#FF758F] font-extrabold' : ''
              }`}
            >
              CONTACT
            </Link>
          </nav>

          {/* Right Action Icons (Optimized for Mobile Spacing) */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-700 hover:text-[#FF758F] hover:bg-[#FFF0F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F] transition-colors"
              title="Search store"
              aria-label="Search outfits"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={1.7} aria-hidden="true" />
            </button>

            {/* Customer Dashboard / Orders Icon */}
            <Link
              href="/dashboard"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-700 hover:text-[#FF758F] hover:bg-[#FFF0F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F] transition-colors relative"
              title="My Orders & Tracking"
              aria-label="My Orders & Tracking"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={1.7} aria-hidden="true" />
            </Link>

            {/* Wishlist Icon (Visible on sm+ screens to preserve mobile space) */}
            <Link
              href="/products"
              className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center text-slate-700 hover:text-[#FF758F] hover:bg-[#FFF0F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F] transition-colors relative"
              title="Wishlist"
              aria-label="Wishlist (0 items)"
            >
              <Heart className="w-4.5 h-4.5" strokeWidth={1.7} aria-hidden="true" />
            </Link>

            {/* Shopping Bag Icon with counter */}
            <Link
              href="/cart"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-700 hover:text-[#FF758F] hover:bg-[#FFF0F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F] transition-colors relative"
              title="Shopping Bag"
              aria-label={`Shopping bag with ${summary.itemsCount} items`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={1.7} aria-hidden="true" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF758F] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                {summary.itemsCount}
              </span>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F] transition-colors ml-0.5"
              aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5 text-slate-900" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        <NavSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[105px] bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end animate-fadeIn">
          <div className="w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-5 sm:p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 block px-2">
                  Shop Categories
                </span>
                <nav className="flex flex-col space-y-1 text-sm font-bold text-slate-800">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#FFF0F3] text-[#FF758F] flex items-center justify-between"
                  >
                    <span>HOME</span>
                    <span className="text-xs font-bold">→</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-900"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#FF758F]" />
                      <span>MY ORDERS & TRACKING</span>
                    </span>
                    <span className="text-xs text-slate-400">→</span>
                  </Link>
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>SHOP ALL</span>
                    <span className="text-xs text-slate-400">→</span>
                  </Link>
                  <Link
                    href="/products?filter=new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>NEW ARRIVALS</span>
                    <span className="text-xs text-slate-400">→</span>
                  </Link>
                  <Link
                    href="/products?gender=Girls"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>GIRLS COLLECTION</span>
                    <span className="text-xs text-slate-400">→</span>
                  </Link>
                  <Link
                    href="/products?gender=Boys"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>BOYS COLLECTION</span>
                    <span className="text-xs text-slate-400">→</span>
                  </Link>
                  <Link
                    href="/products?category=Rompers+%26+Onesies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>BABY (0-12M)</span>
                    <span className="text-xs text-slate-400">→</span>
                  </Link>
                  <Link
                    href="/products?category=sale"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl hover:bg-[#FFF0F3] text-[#FF758F] flex items-center justify-between font-extrabold"
                  >
                    <span>SPECIAL OFFERS & SALE</span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">30% OFF</span>
                  </Link>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 block px-3.5 pb-1">
                      Browse by Category
                    </span>
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/products?category=${encodeURIComponent(cat)}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3.5 py-1.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs text-slate-600 font-semibold"
                      >
                        <span>{cat}</span>
                        <span className="text-[10px] text-slate-400">→</span>
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>

              {/* Trust Information */}
              <div className="p-4 rounded-2xl bg-[#FAF8F6] border border-slate-200/70 space-y-2 text-xs">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#FF758F]" aria-hidden="true" />
                  <span>Islandwide Sri Lanka Delivery</span>
                </p>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Cash on Delivery (COD) & Direct Bank Transfer available across Colombo, Kandy, Galle, and all 25 districts.
                </p>
              </div>
            </div>

            {/* Bottom Contact inside drawer */}
            <div className="pt-5 border-t border-slate-100 space-y-3">
              <a
                href="https://wa.me/94771234567?text=Hi%20LittleStyles,%20I%20would%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" aria-hidden="true" />
                <span>Order via WhatsApp</span>
              </a>

              <p className="text-center text-[11px] text-slate-400 font-medium">
                Colombo 24h • Islandwide 2-3 Days Fast Dispatch
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
