import React from 'react';
import { PromoBannerCard } from '@/presentation/components/molecules/PromoBannerCard';

export const PromoBannersSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Promotions and seasonal offers">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Banner 1: Spring Sale (Girl on the left, text on the right matching Image 1) */}
        <PromoBannerCard
          tag="SPRING SALE"
          tagColor="text-[#FF758F]"
          title={<>Up to 30% Off <br />On Selected Items</>}
          btnText="SHOP THE SALE"
          btnHref="/products?category=sale"
          btnBg="bg-[#1E293B]"
          btnHoverBg="hover:bg-slate-800"
          bgColor="bg-[#FFE8EC]"
          image="/images/banners/spring-sale-girl.jpg"
          imageAlt="Spring Sale Girl with Sunglasses"
          imagePosition="left"
        />

        {/* Banner 2: New Collection (Text on left, folded clothes on right matching Image 1) */}
        <PromoBannerCard
          tag="NEW COLLECTION"
          tagColor="text-emerald-700"
          title={<>Bright Styles for <br />Sunny Days</>}
          btnText="EXPLORE NOW"
          btnHref="/products?filter=new"
          btnBg="bg-[#1E293B]"
          btnHoverBg="hover:bg-slate-800"
          bgColor="bg-[#E2F4EB]"
          image="/images/banners/new-collection.jpg"
          imageAlt="Editorial Kids Collection"
          imagePosition="right"
        />

        {/* Banner 3: Extra 10% Off (Text on left, boy in tweed cap on right matching Image 1) */}
        <PromoBannerCard
          tag="EXTRA 10% OFF"
          tagColor="text-amber-800"
          title={<>On First Order</>}
          badge="Use Code: WELCOME10"
          btnText="SHOP NOW"
          btnHref="/products"
          btnBg="bg-[#1E293B]"
          btnHoverBg="hover:bg-slate-800"
          bgColor="bg-[#FFF3D6]"
          image="/images/banners/welcome-boy.jpg"
          imageAlt="Boutique Boy in Tweed Cap"
          imagePosition="right"
        />
      </div>
    </section>
  );
};
