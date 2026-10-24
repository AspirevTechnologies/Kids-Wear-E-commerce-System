'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/core/entities/Product';
import { formatLKR } from '@/shared/utils/currency';
import { useCart } from '@/presentation/context/CartContext';
import { Heart, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard Molecule
 * Clean, borderless boutique presentation matching the reference design:
 * seamless studio framing (no dark borders/outlines), delicate wishlist heart,
 * price typography, and color swatches.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize] = useState<string>(product.variants[0]?.size || '2-3Y');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.hex || '');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const calculatedDiscount = product.mrp > product.sellingPrice ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) : 0;
  const discountPercent = typeof product.offerPercentage === 'number' && product.offerPercentage > 0 ? product.offerPercentage : calculatedDiscount;

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border-0 border-transparent shadow-none hover:shadow-md transition-all duration-300 select-none">
      {/* 1. Studio Product Image Frame (Unified 4:5 Aspect Ratio, completely borderless) */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-4/5 rounded-2xl overflow-hidden bg-[#FAF6F3] border-0 block group-hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F]"
        aria-label={`View details for ${product.title}`}
      >
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Offer Percentage Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs tracking-wider uppercase">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Outline Heart Button matching Reference Image */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          className="absolute top-2.5 right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[#FF758F] hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.6] ${
              isWishlisted ? 'fill-[#FF758F] text-[#FF758F]' : 'text-[#FF758F]/80 hover:text-[#FF758F]'
            }`}
          />
        </button>

        {/* Quick Add Floating Pill on Hover */}
        <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2 px-3 rounded-xl font-bold text-[11px] shadow-sm transition-all flex items-center justify-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-white/95 backdrop-blur-sm text-slate-800 hover:bg-[#FF758F] hover:text-white active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* 2. Card Info Details */}
      <div className="pt-2.5 pb-1 flex-1 flex flex-col justify-between space-y-1">
        <div>
          {/* Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-xs sm:text-[13px] text-slate-800 leading-snug line-clamp-1 hover:text-[#FF758F] transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Clean Price */}
          <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
            <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
              {formatLKR(product.sellingPrice)}
            </span>
            {discountPercent > 0 && product.mrp > product.sellingPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                {formatLKR(product.mrp)}
              </span>
            )}
          </div>
        </div>

        {/* 3 Circular Color Swatch Dots matching Reference Image */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5" role="radiogroup" aria-label="Available Colors">
            {product.colors.map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => setSelectedColor(color.hex)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-slate-200/80 transition-all ${
                  selectedColor === color.hex
                    ? 'ring-1.5 ring-[#FF758F] ring-offset-1 scale-110'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={color.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
