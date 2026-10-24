import { notFound } from 'next/navigation';
import { MockProductRepository } from '@/infrastructure/repositories/MockProductRepository';
import { PriceTag } from '@/presentation/components/atoms/PriceTag';
import { CodBadge } from '@/presentation/components/atoms/CodBadge';
import { ProductGallery } from '@/presentation/components/molecules/ProductGallery';
import { ProductDetailClient } from './ProductDetailClient';
import { ShieldCheck, Truck, RotateCcw, Check, Heart, Building2 } from 'lucide-react';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const repository = new MockProductRepository();
  const product = await repository.getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-[#FF758F] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#FF758F] transition-colors">Products</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Interactive Product Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Right Column: Details & Purchasing Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/70">
                {product.ageGroup}
              </span>
              <CodBadge available={product.isCodAvailable} />
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200/60 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-blue-600" />
                <span>Bank Transfer Accepted</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight font-serif tracking-tight">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {product.description}
            </p>

            <p className="text-xs text-slate-500 font-medium">
              Category: <span className="text-slate-900 font-semibold">{product.category}</span> • Gender: <span className="text-slate-900 font-semibold">{product.gender}</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/80">
            <PriceTag
              sellingPrice={product.sellingPrice}
              mrp={product.mrp}
              offerPercentage={product.offerPercentage}
              size="lg"
            />
          </div>

          {/* Interactive Client Component for Size Selection & Add to Cart */}
          <ProductDetailClient product={product} />

          {/* Garment Specifications */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3 text-xs">
            <h2 className="font-serif font-black text-slate-900 text-sm">Boutique Specifications</h2>
            <div className="space-y-2 text-slate-600">
              <p><strong className="text-slate-800">Fabric Composition:</strong> {product.fabric}</p>
              <p><strong className="text-slate-800">Wash & Care Instructions:</strong> {product.washCare}</p>
              <p><strong className="text-slate-800">Safety & Certification:</strong> 100% Hypoallergenic, nickel-free snaps & non-toxic child-safe certified dyes.</p>
              <p><strong className="text-slate-800">Origin:</strong> Handcrafted with love in Sri Lanka.</p>
            </div>
          </div>

          {/* Value Props Row */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[11px] text-slate-600 font-medium">
            <div className="p-3 rounded-2xl bg-[#FAF6F3] border border-slate-200/70 space-y-1">
              <Truck className="w-4 h-4 mx-auto text-[#FF758F]" />
              <span>Islandwide Delivery</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF6F3] border border-slate-200/70 space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto text-[#FF758F]" />
              <span>30-Day Exchanges</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF6F3] border border-slate-200/70 space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-emerald-600" />
              <span>Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
