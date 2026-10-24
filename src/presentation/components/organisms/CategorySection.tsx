'use client';

import React, { useEffect, useState } from 'react';
import { CategoryAvatar } from '@/presentation/components/molecules/CategoryAvatar';

interface CategoryItem {
  id?: string;
  name: string;
  image: string;
}

const DEFAULT_CATEGORY_ITEMS: CategoryItem[] = [
  { id: 'cat-dresses', name: 'Dresses & Frocks', image: '/images/categories/girls.jpg' },
  { id: 'cat-rompers', name: 'Rompers & Onesies', image: '/images/categories/baby.jpg' },
  { id: 'cat-tshirts', name: 'T-Shirts & Tops', image: '/images/categories/boys.jpg' },
  { id: 'cat-pants', name: 'Pants & Shorts', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80' },
  { id: 'cat-sleepwear', name: 'Sleepwear & Pyjamas', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80' },
  { id: 'cat-ethnic', name: 'Festive & Ethnic Wear', image: '/images/categories/outfits.jpg' },
  { id: 'cat-accessories', name: 'Accessories & Shoes', image: '/images/categories/accessories.jpg' },
];

export const getCategoryImage = (categoryName: string): string => {
  const lower = categoryName.toLowerCase();
  if (lower.includes('dress') || lower.includes('frock') || lower.includes('girl')) {
    return '/images/categories/girls.jpg';
  }
  if (lower.includes('romper') || lower.includes('onesie') || lower.includes('baby') || lower.includes('infant')) {
    return '/images/categories/baby.jpg';
  }
  if (lower.includes('t-shirt') || lower.includes('top') || lower.includes('shirt') || lower.includes('boy')) {
    return '/images/categories/boys.jpg';
  }
  if (lower.includes('festive') || lower.includes('ethnic') || lower.includes('party') || lower.includes('outfit')) {
    return '/images/categories/outfits.jpg';
  }
  if (lower.includes('shoe') || lower.includes('footwear') || lower.includes('boot') || lower.includes('sandal')) {
    return '/images/categories/footwear.jpg';
  }
  if (lower.includes('access') || lower.includes('hat') || lower.includes('cap') || lower.includes('bag')) {
    return '/images/categories/accessories.jpg';
  }
  if (lower.includes('pant') || lower.includes('short') || lower.includes('jean') || lower.includes('trouser')) {
    return 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80';
  }
  if (lower.includes('sleep') || lower.includes('pyjama') || lower.includes('night')) {
    return 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&auto=format&fit=crop&q=80';
};

export const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORY_ITEMS);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted) return;
        if (data?.settings?.categoryDetails && Array.isArray(data.settings.categoryDetails) && data.settings.categoryDetails.length > 0) {
          setCategories(data.settings.categoryDetails);
        } else if (data?.settings?.categories && Array.isArray(data.settings.categories) && data.settings.categories.length > 0) {
          setCategories(
            data.settings.categories.map((name: string) => ({
              name,
              image: getCategoryImage(name),
            }))
          );
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

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

      {/* Dynamic Category Circular Avatars - Adaptive layout based on admin categories */}
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8">
        {categories.map((cat) => (
          <div key={cat.name} className="w-[100px] sm:w-[120px] md:w-[130px] flex justify-center">
            <CategoryAvatar
              title={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              image={cat.image || getCategoryImage(cat.name)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
