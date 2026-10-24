import React from 'react';
import { Banknote } from 'lucide-react';

interface CodBadgeProps {
  available?: boolean;
  className?: string;
}

export const CodBadge: React.FC<CodBadgeProps> = ({ available = true, className = '' }) => {
  if (!available) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 ${className}`}>
        Prepaid Only
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs ${className}`}
      title="Cash on Delivery Available"
    >
      <Banknote className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
      <span>Pay on Delivery (COD)</span>
    </span>
  );
};
