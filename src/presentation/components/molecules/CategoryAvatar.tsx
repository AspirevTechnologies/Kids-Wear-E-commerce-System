import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryAvatarProps {
  title: string;
  href: string;
  image: string;
}

/**
 * CategoryAvatar Molecule
 * Studio circular portrait avatar with soft pastel framing and smooth hover zoom,
 * matching the reference design.
 */
export const CategoryAvatar: React.FC<CategoryAvatarProps> = ({ title, href, image }) => {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center text-center space-y-2 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF758F] rounded-2xl p-1"
    >
      {/* Studio Circular Mask Container with soft pastel tint */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden p-1 bg-white border border-rose-100 group-hover:border-[#FF758F] shadow-xs group-hover:shadow-md transition-all duration-300">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
          className="object-cover object-top rounded-full p-1 group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <div>
        <h3 className="font-extrabold text-[11px] sm:text-xs text-slate-900 tracking-wider uppercase group-hover:text-[#FF758F] transition-colors">
          {title}
        </h3>
        <span className="text-[10px] sm:text-[11px] text-slate-500 group-hover:text-[#FF758F] font-medium inline-block mt-0.5 transition-colors">
          Shop Now →
        </span>
      </div>
    </Link>
  );
};
