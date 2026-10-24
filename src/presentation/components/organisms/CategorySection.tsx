import React from 'react';
import { CategoryAvatar } from '@/presentation/components/molecules/CategoryAvatar';

export const CategorySection: React.FC = () => {
  const categoryCircles = [
    {
      title: 'GIRLS',
      href: '/products?gender=Girls',
      image: '/images/categories/girls.jpg',
    },
    {
      title: 'BOYS',
      href: '/products?gender=Boys',
      image: '/images/categories/boys.jpg',
    },
    {
      title: 'BABY',
      href: '/products?category=Rompers+%26+Onesies',
      image: '/images/categories/baby.jpg',
    },
    {
      title: 'OUTFITS',
      href: '/products?category=Festive+%26+Ethnic+Wear',
      image: '/images/categories/outfits.jpg',
    },
    {
      title: 'FOOTWEAR',
      href: '/products',
      image: '/images/categories/footwear.jpg',
    },
    {
      title: 'ACCESSORIES',
      href: '/products',
      image: '/images/categories/accessories.jpg',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8" aria-label="Shop by category">
      <div className="text-center space-y-1">
        <h2 className="text-sm sm:text-base font-bold tracking-[0.2em] uppercase text-slate-800 flex items-center justify-center gap-2.5">
          <span className="text-[#FF758F] text-base leading-none">♡</span>
          <span>SHOP BY CATEGORY</span>
          <span className="text-[#FF758F] text-base leading-none">♡</span>
        </h2>
        <div className="flex justify-center">
          <span className="text-[#FF758F] text-[10px] leading-none opacity-80">♡</span>
        </div>
      </div>

      {/* 6 Category Circular Avatars - 3x2 grid on mobile, 6x1 on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3.5 sm:gap-6 lg:gap-8">
        {categoryCircles.map((cat) => (
          <CategoryAvatar
            key={cat.title}
            title={cat.title}
            href={cat.href}
            image={cat.image}
          />
        ))}
      </div>
    </section>
  );
};
