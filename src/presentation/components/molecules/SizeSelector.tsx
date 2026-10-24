import React from 'react';
import { ProductVariant } from '@/core/entities/Product';

interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  variants,
  selectedSize,
  onSelectSize,
}) => {
  return (
    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Available Sizes">
      {variants.map((v) => {
        const isSelected = selectedSize === v.size;
        const isOutOfStock = v.stock <= 0;

        return (
          <button
            key={v.size}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isOutOfStock}
            onClick={() => onSelectSize(v.size)}
            className={`min-h-[44px] min-w-[52px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F] ${
              isSelected
                ? 'border-[#FF758F] bg-[#FFF0F3] text-[#FF758F] ring-2 ring-[#FF758F]/25 shadow-2xs font-extrabold'
                : 'border-slate-200/90 bg-white text-slate-700 hover:border-[#FF758F]/60 hover:text-slate-900'
            } ${isOutOfStock ? 'opacity-40 cursor-not-allowed line-through bg-slate-50' : 'cursor-pointer active:scale-95'}`}
          >
            {v.size}
          </button>
        );
      })}
    </div>
  );
};
