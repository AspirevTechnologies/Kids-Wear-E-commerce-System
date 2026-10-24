'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/presentation/components/atoms/BrandLogo';
import { Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  // Isolate Seller Admin from customer storefront footer
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Social */}
          <div className="lg:col-span-3 space-y-4">
            <BrandLogo variant="footer" />

            <p className="text-xs text-slate-500 leading-relaxed font-normal max-w-xs">
              Adorable fashion for every little moment. Stylish, comfortable & made with love.
            </p>

            {/* Standard Social Media Icons matching Reference Image */}
            <div className="flex items-center gap-3 pt-1" aria-label="Follow us on social media">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-[#FF758F] transition-colors"
                title="Facebook"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-[#FF758F] transition-colors"
                title="Instagram"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-[#FF758F] transition-colors"
                title="Pinterest"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.402.155-1.499-.696-2.435-2.883-2.435-4.643 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-[#FF758F] transition-colors"
                title="TikTok"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/94771234567?text=Hello%20LittleStyles!%20I%20would%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-[#25D366] transition-colors"
                title="WhatsApp"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: SHOP */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-xs tracking-[0.14em] uppercase text-slate-900">SHOP</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><Link href="/products" className="hover:text-[#FF758F] transition-colors">All Products</Link></li>
              <li><Link href="/products?filter=new" className="hover:text-[#FF758F] transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?gender=Girls" className="hover:text-[#FF758F] transition-colors">Girls</Link></li>
              <li><Link href="/products?gender=Boys" className="hover:text-[#FF758F] transition-colors">Boys</Link></li>
              <li><Link href="/products?category=Rompers+%26+Onesies" className="hover:text-[#FF758F] transition-colors">Baby</Link></li>
              <li><Link href="/products" className="hover:text-[#FF758F] transition-colors">Accessories</Link></li>
              <li><Link href="/products?category=sale" className="hover:text-[#FF758F] transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Column 3: CUSTOMER SERVICE */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-xs tracking-[0.14em] uppercase text-slate-900">CUSTOMER SERVICE</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><Link href="/contact" className="hover:text-[#FF758F] transition-colors">Contact Us</Link></li>
              <li><Link href="/delivery" className="hover:text-[#FF758F] transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-[#FF758F] transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/size-guide" className="hover:text-[#FF758F] transition-colors">Size Guide</Link></li>
              <li><Link href="/faq" className="hover:text-[#FF758F] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 4: ABOUT US */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-xs tracking-[0.14em] uppercase text-slate-900">ABOUT US</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><Link href="/about" className="hover:text-[#FF758F] transition-colors">Our Story</Link></li>
              <li><Link href="/about#craft" className="hover:text-[#FF758F] transition-colors">GOTS Sustainability</Link></li>
              <li><Link href="/contact" className="hover:text-[#FF758F] transition-colors">Store Locator</Link></li>
              <li><Link href="/admin" className="hover:text-[#FF758F] transition-colors font-semibold text-slate-600">Seller Admin</Link></li>
            </ul>
          </div>

          {/* Column 5: NEWSLETTER */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs tracking-[0.14em] uppercase text-slate-900">NEWSLETTER</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Subscribe to get special offers, new arrivals & more.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2 pt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Newsletter email address"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#FF758F] focus:ring-1 focus:ring-[#FF758F] font-medium text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-md bg-[#FF758F] hover:bg-[#F0627D] text-white font-extrabold text-xs uppercase tracking-wider shadow-xs transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F]"
              >
                {subscribed ? <Check className="w-4 h-4 text-white" /> : 'SUBSCRIBE'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 mt-12 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Littlestyles. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <span className="text-slate-200">|</span>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
