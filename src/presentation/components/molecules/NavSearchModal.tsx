'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface NavSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * NavSearchModal Molecule
 * Accessible expandable search bar with instant filter chips, navigation, and keyboard escape handling.
 */
export const NavSearchModal: React.FC<NavSearchModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
}) => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickTags = ['Summer Dress', 'Rompers', 'Organic Cotton', 'Boys Jacket', 'Party Frock'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    onClose();
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/products?q=${encodeURIComponent(tag)}`);
    onClose();
  };

  return (
    <div
      role="search"
      aria-label="Store search"
      className="border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-md animate-fadeIn"
    >
      <div className="max-w-3xl mx-auto space-y-2.5">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
          <button type="submit" aria-label="Submit search">
            <Search className="w-4 h-4 text-rose-600 shrink-0" strokeWidth={2} aria-hidden="true" />
          </button>
          <input
            type="search"
            autoFocus
            placeholder="Search dresses, rompers, baby essentials, fabrics or sizes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
            aria-label="Search outfits and collections"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Clear search text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-0.5 rounded-md hover:bg-slate-200/60 transition-colors"
            aria-label="Close search"
          >
            Esc
          </button>
        </form>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-2 pt-0.5 overflow-x-auto text-[11px] font-medium text-slate-500">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] shrink-0">Popular:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/50 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
