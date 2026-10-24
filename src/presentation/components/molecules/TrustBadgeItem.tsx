import React from 'react';

interface TrustBadgeItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colSpan?: string;
}

/**
 * TrustBadgeItem Molecule
 * Features clean circular minimalist line icon with high-contrast copy,
 * exactly as styled in the reference design.
 */
export const TrustBadgeItem: React.FC<TrustBadgeItemProps> = ({
  icon,
  title,
  description,
  colSpan = '',
}) => {
  return (
    <div className={`flex flex-col items-center space-y-2 text-center group select-none ${colSpan}`}>
      <div
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border border-slate-300/80 bg-white flex items-center justify-center text-slate-700 shadow-2xs group-hover:border-[#FF758F] group-hover:scale-105 transition-all duration-300"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
        {title}
      </h3>
      <p className="text-[11px] text-slate-500 max-w-[170px] leading-relaxed">
        {description}
      </p>
    </div>
  );
};
