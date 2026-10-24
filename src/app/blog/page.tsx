import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen, Heart } from 'lucide-react';

export const metadata = {
  title: 'The LittleStyles Journal | Parenting, Organic Fabrics & Kids Fashion Sri Lanka',
  description: 'Care guides, tropical styling tips, and parenting insights from LittleStyles Sri Lanka.',
};

export default function BlogIndexPage() {
  const articles = [
    {
      slug: 'why-pure-organic-cotton-matters',
      title: 'Why 100% Pure Organic Cotton is Essential for Tropical Baby Skin',
      excerpt: 'Discover why breathable, chemical-free GOTS organic cotton keeps infants and toddlers rash-free and cool under Sri Lankan tropical humidity.',
      date: 'October 20, 2026',
      readTime: '4 min read',
      tag: 'FABRIC SCIENCE',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      image: '/images/products/floral-dress.jpg',
    },
    {
      slug: 'how-to-choose-the-right-size-for-toddlers',
      title: 'Sizing Your Little One: The Sri Lankan Parents Guide to Perfect Fit',
      excerpt: 'Kids grow fast! Learn our practical tips for measuring chest, torso, and inseam to choose outfits with plenty of room for play.',
      date: 'October 16, 2026',
      readTime: '3 min read',
      tag: 'FIT & SIZING',
      tagColor: 'bg-[#FFF0F3] text-[#FF758F] border-rose-200/80',
      image: '/images/products/bomber-jacket.jpg',
    },
    {
      slug: 'doorstep-cod-guide-across-all-25-districts',
      title: 'How Cash on Delivery (COD) Works Across Sri Lanka',
      excerpt: 'Step-by-step walkthrough of doorstep courier verification, package handover, and hassle-free 30-day size swaps.',
      date: 'October 12, 2026',
      readTime: '5 min read',
      tag: 'SHOPPING GUIDE',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
      image: '/images/products/baby-knit-romper.jpg',
    },
    {
      slug: 'festive-pastels-kids-occasion-wear',
      title: 'Pastel Perfection: Styling Kids for Birthdays, Weddings & Family Milestones',
      excerpt: 'Soft dusky corals, sage greens, and honey golds that keep your child comfortable and photogenic from morning celebrations to bedtime.',
      date: 'October 08, 2026',
      readTime: '4 min read',
      tag: 'STYLE & INSPIRATION',
      tagColor: 'bg-blue-50 text-blue-800 border-blue-200',
      image: '/images/products/heart-sweatshirt.jpg',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF758F] bg-[#FFF0F3] px-3.5 py-1 rounded-full border border-rose-100 inline-block">
          THE LITTLESTYLES JOURNAL
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
          Parenting & Style Stories
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Expert care tips, fabric insights, and thoughtful advice for dressing happy, confident little adventurers in Sri Lanka.
        </p>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((art) => (
          <article
            key={art.slug}
            className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
          >
            <div>
              {/* Image Frame */}
              <div className="relative aspect-16/9 bg-[#FAF6F3] overflow-hidden">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top group-hover:scale-104 transition-transform duration-500 ease-out"
                />
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${art.tagColor}`}>
                  {art.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-7 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{art.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif leading-snug group-hover:text-[#FF758F] transition-colors">
                  {art.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {art.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/products"
                className="text-xs font-extrabold uppercase tracking-wider text-[#FF758F] hover:text-[#E0486D] flex items-center gap-1.5 transition-colors"
              >
                <span>Explore Related Outfits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[11px] text-slate-400 font-medium">LittleStyles Atelier</span>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter Banner */}
      <div className="rounded-3xl bg-[#FAF6F3] p-8 sm:p-12 border border-slate-200/80 text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-white text-[#FF758F] flex items-center justify-center mx-auto shadow-2xs">
          <Heart className="w-6 h-6 stroke-[1.8]" />
        </div>
        <h3 className="font-serif font-black text-2xl text-slate-900">Join the LittleStyles Parenting Circle</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Be the first to receive secret seasonal drops, organic care guides, and exclusive discount codes right in your inbox.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
          >
            <span>Explore All Outfits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
