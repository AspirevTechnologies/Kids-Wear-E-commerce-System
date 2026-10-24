import { MockProductRepository } from '@/infrastructure/repositories/MockProductRepository';
import { HeroSection } from '@/presentation/components/organisms/HeroSection';
import { CategorySection } from '@/presentation/components/organisms/CategorySection';
import { NewArrivalsSection } from '@/presentation/components/organisms/NewArrivalsSection';
import { PromoBannersSection } from '@/presentation/components/organisms/PromoBannersSection';
import { TrustFeaturesSection } from '@/presentation/components/organisms/TrustFeaturesSection';
import { WhatsAppButton } from '@/presentation/components/atoms/WhatsAppButton';

/**
 * HomePage - Modular SADP Presentation Layer
 * Composed of clean single-responsibility components under 100 lines each.
 */
export default async function HomePage() {
  const repository = new MockProductRepository();
  const products = await repository.getAllProducts();

  return (
    <div className="space-y-14 sm:space-y-20 pb-20 bg-white">
      {/* 1. Full-Length Seamless Studio Hero */}
      <HeroSection />

      {/* 2. Shop By Category (6 Studio Avatars) */}
      <CategorySection />

      {/* 3. New Arrivals (12 Products with Tabs & Carousel Controls) */}
      <NewArrivalsSection products={products} />

      {/* 4. Bento Promotional Banners (Spring Sale, New Collection, 10% Off) */}
      <PromoBannersSection />

      {/* 5. Why Parents Love Us (5 Trust Badges) */}
      <TrustFeaturesSection />

      {/* 6. Islandwide WhatsApp Floating Support Button */}
      <WhatsAppButton />
    </div>
  );
}
