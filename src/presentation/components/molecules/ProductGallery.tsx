'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, Eye } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const safeImages = images && images.length > 0 ? images : ['/images/products/floral-dress.jpg'];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  const currentImage = safeImages[selectedIndex] || safeImages[0];

  return (
    <div className="space-y-4">
      {/* Main 4:5 Aspect Studio Photo Frame */}
      <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-[#FAF6F3] border border-slate-200/80 shadow-2xs group select-none">
        <Image
          src={currentImage}
          alt={`${title} - View ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-top transition-all duration-300 group-hover:scale-103"
        />

        {/* Counter Badge */}
        {safeImages.length > 1 && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-xs text-white text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm z-10">
            <Eye className="w-3.5 h-3.5 text-[#FF758F]" />
            <span>{selectedIndex + 1} / {safeImages.length}</span>
          </div>
        )}

        {/* Previous & Next Arrow Controls */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 focus:opacity-100 z-10"
              title="Previous photo"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 focus:opacity-100 z-10"
              title="Next photo"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Interactive Angle Thumbnails Strip */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3">
          {safeImages.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-white transition-all p-0.5 group ${
                selectedIndex === idx
                  ? 'border-[#FF758F] ring-3 ring-[#FF758F]/20 shadow-xs scale-102'
                  : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
              title={`View photo ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${title} angle ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover object-top rounded-xl"
              />
              <span className="absolute bottom-1 right-1 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-black/60 text-white font-mono">
                #{idx + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
