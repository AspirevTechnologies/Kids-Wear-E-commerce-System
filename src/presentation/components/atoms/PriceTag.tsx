import React from 'react';
import { formatLKR } from '@/shared/utils/currency';

interface PriceTagProps {
  sellingPrice: number;
  mrp: number;
  offerPercentage?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceTag: React.FC<PriceTagProps> = ({ sellingPrice, mrp, offerPercentage, size = 'md' }) => {
  const calculatedDiscount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const discountPercent = typeof offerPercentage === 'number' && offerPercentage > 0 ? offerPercentage : calculatedDiscount;
  const hasDiscount = discountPercent > 0 || mrp > sellingPrice;

  const sizeClasses = {
    sm: { price: 'text-sm font-extrabold', mrp: 'text-xs', badge: 'text-[10px] px-2 py-0.5' },
    md: { price: 'text-base sm:text-lg font-extrabold', mrp: 'text-xs sm:text-sm', badge: 'text-xs px-2 py-0.5' },
    lg: { price: 'text-2xl sm:text-3xl font-black', mrp: 'text-base', badge: 'text-xs px-2.5 py-1' },
  }[size];

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`${sizeClasses.price} text-slate-900 tracking-tight`}>
        {formatLKR(sellingPrice)}
      </span>
      {hasDiscount && (
        <>
          <span className={`${sizeClasses.mrp} text-slate-400 line-through font-normal`}>
            {formatLKR(mrp)}
          </span>
          <span className={`${sizeClasses.badge} font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-200/70 inline-flex items-center`}>
            {discountPercent}% OFF
          </span>
        </>
      )}
    </div>
  );
};
