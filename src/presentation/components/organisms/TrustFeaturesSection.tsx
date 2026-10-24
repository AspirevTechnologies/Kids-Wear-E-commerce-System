import React from 'react';
import { TrustBadgeItem } from '@/presentation/components/molecules/TrustBadgeItem';
import { Award, RotateCcw, Lock, Headphones, Heart } from 'lucide-react';

export const TrustFeaturesSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 pt-4" aria-label="Why parents love us">
      <div className="text-center space-y-1">
        <h2 className="text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-slate-800 flex items-center justify-center gap-2.5">
          <span className="text-[#FF758F] text-base leading-none">♡</span>
          <span>WHY PARENTS LOVE US</span>
          <span className="text-[#FF758F] text-base leading-none">♡</span>
        </h2>
        <div className="flex justify-center">
          <span className="text-[#FF758F] text-[10px] leading-none opacity-80">♡</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 text-center">
        {/* Feature 1: Premium Quality */}
        <TrustBadgeItem
          icon={<Award className="w-6 h-6 text-slate-700 stroke-[1.5]" />}
          title="Premium Quality"
          description="Best materials for your little ones"
        />

        {/* Feature 2: Easy Returns */}
        <TrustBadgeItem
          icon={<RotateCcw className="w-6 h-6 text-slate-700 stroke-[1.5]" />}
          title="Easy Returns"
          description="30 days hassle-free returns"
        />

        {/* Feature 3: Secure Payments */}
        <TrustBadgeItem
          icon={<Lock className="w-6 h-6 text-slate-700 stroke-[1.5]" />}
          title="Secure Payments"
          description="100% safe & secure checkout"
        />

        {/* Feature 4: Customer Support */}
        <TrustBadgeItem
          icon={<Headphones className="w-6 h-6 text-slate-700 stroke-[1.5]" />}
          title="Customer Support"
          description="We're here to help you anytime"
        />

        {/* Feature 5: Loved by Parents */}
        <TrustBadgeItem
          icon={<Heart className="w-6 h-6 text-slate-700 stroke-[1.5]" />}
          title="Loved by Parents"
          description="Thousands of happy families"
          colSpan="col-span-2 md:col-span-1"
        />
      </div>
    </section>
  );
};
