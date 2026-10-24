import { MockProductRepository } from '@/infrastructure/repositories/MockProductRepository';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';
import { ProductCard } from '@/presentation/components/molecules/ProductCard';
import { ClothingCategory, AgeGroup, Gender } from '@/shared/types/common';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown, X, Tag, Sparkles } from 'lucide-react';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    ageGroup?: string;
    gender?: string;
    q?: string;
    filter?: string;
    sort?: 'price-low' | 'price-high' | 'rating' | 'newest';
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const repository = new MockProductRepository();

  const isNewArrival = resolvedParams.filter === 'new';
  const isOnSale = resolvedParams.filter === 'sale' || resolvedParams.category === 'sale';

  const products = await repository.filterProducts({
    category: isOnSale ? undefined : (resolvedParams.category as ClothingCategory),
    ageGroup: resolvedParams.ageGroup as AgeGroup,
    gender: resolvedParams.gender as Gender,
    searchQuery: resolvedParams.q,
    sortBy: resolvedParams.sort,
    isNewArrival,
    onSaleOnly: isOnSale,
  });

  const isAllActive = !resolvedParams.category && !resolvedParams.ageGroup && !resolvedParams.gender && !resolvedParams.q && !resolvedParams.filter;
  
  const allStoreProducts = await repository.getAllProducts();
  const settings = await new SettingsRepository().getSettings();
  const categories = Array.from(
    new Set([
      ...Object.values(ClothingCategory),
      ...(settings.categories || []),
      ...allStoreProducts.map((p) => p.category).filter(Boolean)
    ])
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div className="space-y-2">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#FF758F] block">
            HANDCRAFTED ATELIER CATALOG
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight">
            Kids Wear Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Showing <strong className="text-slate-900 font-bold">{products.length}</strong> outfits crafted from 100% hypoallergenic organic cotton tailored for Sri Lankan toddlers & kids. Islandwide Cash on Delivery (COD) & Direct Bank Transfer available.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Link
              href={`/products?${new URLSearchParams({ ...resolvedParams, sort: 'newest' }).toString()}`}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                !resolvedParams.sort || resolvedParams.sort === 'newest'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Featured
            </Link>
            <Link
              href={`/products?${new URLSearchParams({ ...resolvedParams, sort: 'price-low' }).toString()}`}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                resolvedParams.sort === 'price-low'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Price: Low → High
            </Link>
            <Link
              href={`/products?${new URLSearchParams({ ...resolvedParams, sort: 'rating' }).toString()}`}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                resolvedParams.sort === 'rating'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Top Rated
            </Link>
          </div>
        </div>
      </div>

      {/* Active Search Notification */}
      {resolvedParams.q && (
        <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-rose-100 flex items-center justify-between text-xs text-slate-800 shadow-2xs">
          <span>Search results for: <strong className="font-bold font-serif text-sm text-slate-900">&ldquo;{resolvedParams.q}&rdquo;</strong></span>
          <Link
            href="/products"
            className="text-xs font-extrabold text-[#FF758F] hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Search</span>
          </Link>
        </div>
      )}

      {/* Filter Chips Bar */}
      <div className="space-y-3.5 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
        {/* Category Row */}
        <div className="flex flex-wrap items-center gap-2" role="navigation" aria-label="Category filters">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
              isAllActive
                ? 'bg-[#FF758F] text-white border-[#FF758F] shadow-xs'
                : 'bg-[#FAF8F5] text-slate-700 border-slate-200/80 hover:border-slate-300 hover:bg-white'
            }`}
          >
            All Outfits ({products.length})
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                resolvedParams.category === cat
                  ? 'bg-[#FF758F] text-white border-[#FF758F] shadow-xs'
                  : 'bg-[#FAF8F5] text-slate-700 border-slate-200/80 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Age & Gender Sub-Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Refine By:</span>
          {Object.values(AgeGroup).map((age) => (
            <Link
              key={age}
              href={`/products?ageGroup=${encodeURIComponent(age)}`}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                resolvedParams.ageGroup === age
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {age}
            </Link>
          ))}

          <Link
            href="/products?gender=Girls"
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all border ${
              resolvedParams.gender === 'Girls'
                ? 'bg-[#FF758F] text-white border-[#FF758F]'
                : 'bg-[#FFF0F3] text-[#FF758F] border-rose-200/80 hover:bg-[#FFE5EB]'
            }`}
          >
            Girls Outfits
          </Link>

          <Link
            href="/products?gender=Boys"
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all border ${
              resolvedParams.gender === 'Boys'
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100'
            }`}
          >
            Boys Outfits
          </Link>
        </div>
      </div>

      {/* Product Listing */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-2xs space-y-3 max-w-lg mx-auto">
          <p className="text-slate-800 font-bold text-sm">No items found for the selected filter.</p>
          <p className="text-xs text-slate-500">Try adjusting your filters or explore all outfits in our collection.</p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-block px-5 py-2.5 bg-[#FF758F] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F0627D] transition-colors shadow-xs"
            >
              Clear all filters
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {products.map((p) => (
            <div key={p.id} className="min-w-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
