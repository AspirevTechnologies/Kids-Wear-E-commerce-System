import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PromoBannerCardProps {
  tag: string;
  tagColor: string;
  title: React.ReactNode;
  btnText: string;
  btnHref: string;
  btnBg: string;
  btnHoverBg: string;
  bgColor: string;
  borderColor?: string;
  image: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  badge?: string;
}

/**
 * PromoBannerCard Molecule
 * Matches the reference design with studio photography cutout,
 * custom image position (left or right), and delicate boutique colors.
 */
export const PromoBannerCard: React.FC<PromoBannerCardProps> = ({
  tag,
  tagColor,
  title,
  btnText,
  btnHref,
  btnBg,
  btnHoverBg,
  bgColor,
  image,
  imageAlt,
  imagePosition = 'right',
  badge,
}) => {
  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4 overflow-hidden relative group transition-all duration-300 hover:shadow-md ${bgColor} ${
        imagePosition === 'left' ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Text Content */}
      <div className={`space-y-2.5 z-10 flex-1 ${imagePosition === 'left' ? 'text-left pl-2' : 'text-left'}`}>
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] block ${tagColor}`}>
          {tag}
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight font-serif">
          {title}
        </h3>
        {badge && (
          <p className="text-[11px] font-semibold text-amber-900">
            {badge}
          </p>
        )}
        <div className="pt-1">
          <Link
            href={btnHref}
            className={`inline-block px-4 py-2 text-white font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider rounded-lg transition-all shadow-xs active:scale-98 ${btnBg} ${btnHoverBg}`}
          >
            {btnText}
          </Link>
        </div>
      </div>

      {/* Photography Cutout Frame */}
      <div className="relative w-24 sm:w-28 md:w-32 aspect-3/4 rounded-xl overflow-hidden shrink-0 shadow-xs border-2 border-white">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
          className="object-cover object-top group-hover:scale-104 transition-transform duration-500"
          loading="lazy"
        />
      </div>
    </div>
  );
};
