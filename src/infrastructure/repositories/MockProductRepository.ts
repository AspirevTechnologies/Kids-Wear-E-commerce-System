import { IProductRepository, ProductFilterOptions } from './IProductRepository';
import { Product } from '@/core/entities/Product';
import { AgeGroup, ClothingCategory, Gender } from '@/shared/types/common';
import { DatabaseClient } from '../database/DatabaseClient';

/**
 * Mock Product Repository (SADP Repository Pattern)
 * 12 Curated Commercial Studio Products for Sri Lankan Kids Wear Boutique.
 * 100% Studio Consistency: Row 1 & Row 2 feature identical warm-cream studio lighting,
 * joyful smiling children, and boutique-grade pastel styling.
 */
export class MockProductRepository implements IProductRepository {
  private static readonly STORAGE_KEY = 'products_store';
  private db: DatabaseClient;

  private static readonly INITIAL_PRODUCTS: Product[] = [
    // ----------------- ROW 1: STUDIO BOUTIQUE ESSENTIALS -----------------
    {
      id: 'ls-01',
      title: 'Floral Cotton Summer Dress',
      slug: 'floral-cotton-summer-dress',
      description: 'Charming sleeveless summer dress with delicate pastel floral prints, crafted from 100% GOTS certified breathable organic cotton.',
      category: ClothingCategory.DRESSES,
      ageGroup: AgeGroup.LITTLE_KIDS,
      gender: Gender.GIRLS,
      fabric: '100% GOTS Organic Cotton',
      mrp: 3500,
      sellingPrice: 2990,
      images: [
        '/images/products/floral-dress.jpg',
        '/images/products/curly-girl-dress.jpg',
        '/images/products/sundress-girl.jpg',
        '/images/products/party-frock.jpg',
      ],
      variants: [
        { size: '2-3Y', sku: 'DRS-FLR-23Y', stock: 12 },
        { size: '3-4Y', sku: 'DRS-FLR-34Y', stock: 15 },
        { size: '4-5Y', sku: 'DRS-FLR-45Y', stock: 8 },
      ],
      colors: [
        { name: 'Dusty Coral', hex: '#F97066' },
        { name: 'Sage Green', hex: '#A6E3C0' },
        { name: 'Sky Blue', hex: '#94C6EE' },
      ],
      rating: 4.9,
      reviewCount: 48,
      isCodAvailable: true,
      washCare: 'Machine wash cold gentle. Flat dry in shade.',
      isNewArrival: true,
    },
    {
      id: 'ls-02',
      title: 'Hooded Bomber Utility Jacket',
      slug: 'hooded-bomber-utility-jacket',
      description: 'Trendy olive zip jacket with comfortable ribbed cuffs and soft cotton jersey lining. Ideal for cool evenings and travel.',
      category: ClothingCategory.PANTS,
      ageGroup: AgeGroup.LITTLE_KIDS,
      gender: Gender.BOYS,
      fabric: 'Cotton Twill with Jersey Lining',
      mrp: 4800,
      sellingPrice: 3990,
      images: [
        '/images/products/bomber-jacket.jpg',
        '/images/products/vika_boy_crop.jpg',
        '/images/products/corduroy_overshirt_kid.jpg',
        '/images/products/tweed-cap-boy.jpg',
      ],
      variants: [
        { size: '3-4Y', sku: 'JKT-BMB-34Y', stock: 10 },
        { size: '4-5Y', sku: 'JKT-BMB-45Y', stock: 14 },
        { size: '5-6Y', sku: 'JKT-BMB-56Y', stock: 7 },
      ],
      colors: [
        { name: 'Olive Green', hex: '#658864' },
        { name: 'Mustard Gold', hex: '#E5BA73' },
        { name: 'Classic Navy', hex: '#2B4865' },
      ],
      rating: 4.8,
      reviewCount: 36,
      isCodAvailable: true,
      washCare: 'Cold wash. Do not bleach.',
      isNewArrival: true,
    },
    {
      id: 'ls-03',
      title: 'Heart Print Cozy Sweatshirt',
      slug: 'heart-print-cozy-sweatshirt',
      description: 'Sweet blush pink fleece-lined sweatshirt with a soft heart graphic. Super cozy, tagless, and gentle on sensitive skin.',
      category: ClothingCategory.TSHIRTS,
      ageGroup: AgeGroup.TODDLER,
      gender: Gender.GIRLS,
      fabric: 'Ultra-Soft French Terry Cotton',
      mrp: 2950,
      sellingPrice: 2490,
      images: [
        '/images/products/heart-sweatshirt.jpg',
        '/images/products/rainbow-sweater-girl.jpg',
        '/images/products/rika-girl.jpg',
        '/images/products/vika_studio_girl_standing.jpg',
      ],
      variants: [
        { size: '1-2Y', sku: 'SWT-HRT-12Y', stock: 8 },
        { size: '2-3Y', sku: 'SWT-HRT-23Y', stock: 12 },
        { size: '3-4Y', sku: 'SWT-HRT-34Y', stock: 9 },
      ],
      colors: [
        { name: 'Blush Pink', hex: '#F48FB1' },
        { name: 'Soft Lilac', hex: '#CE93D8' },
        { name: 'Vanilla Cream', hex: '#FFF59D' },
      ],
      rating: 5.0,
      reviewCount: 29,
      isCodAvailable: true,
      washCare: 'Gentle wash inside out.',
      isNewArrival: true,
    },
    {
      id: 'ls-04',
      title: 'Nautical Striped Cotton Tee',
      slug: 'nautical-striped-cotton-tee',
      description: 'Classic nautical striped tee with snap buttons on the shoulder for quick dressing. Made with 100% combed bio-washed cotton.',
      category: ClothingCategory.TSHIRTS,
      ageGroup: AgeGroup.TODDLER,
      gender: Gender.BOYS,
      fabric: '100% Combed Bio-Washed Cotton',
      mrp: 2400,
      sellingPrice: 1990,
      images: [
        '/images/products/striped-tee.jpg',
        '/images/products/striped_sailor_tracksuit_boy.jpg',
        '/images/products/vika_studio_sailor_girl.jpg',
      ],
      variants: [
        { size: '1-2Y', sku: 'TEE-STP-12Y', stock: 20 },
        { size: '2-3Y', sku: 'TEE-STP-23Y', stock: 18 },
        { size: '3-4Y', sku: 'TEE-STP-34Y', stock: 15 },
      ],
      colors: [
        { name: 'Navy White', hex: '#1E3A8A' },
        { name: 'Sage White', hex: '#86EFAC' },
        { name: 'Heather Grey', hex: '#9CA3AF' },
      ],
      rating: 4.7,
      reviewCount: 52,
      isCodAvailable: true,
      washCare: 'Machine wash warm with like colors.',
      isNewArrival: true,
    },
    {
      id: 'ls-05',
      title: 'Ruffle Flutter Sleeve Romper',
      slug: 'ruffle-flutter-sleeve-romper',
      description: 'Sunny honey-yellow flutter sleeve romper with bottom snap fasteners for effortless diaper changes. Pure muslin breathability.',
      category: ClothingCategory.ROMPERS,
      ageGroup: AgeGroup.INFANT,
      gender: Gender.GIRLS,
      fabric: '100% GOTS Organic Muslin',
      mrp: 3200,
      sellingPrice: 2790,
      images: [
        '/images/products/ruffle-romper.jpg',
        '/images/products/baby-knit-romper.jpg',
        '/images/products/knit-sweater-baby.jpg',
      ],
      variants: [
        { size: '0-3M', sku: 'RMP-RFL-03M', stock: 10 },
        { size: '3-6M', sku: 'RMP-RFL-36M', stock: 14 },
        { size: '6-12M', sku: 'RMP-RFL-612M', stock: 11 },
      ],
      colors: [
        { name: 'Honey Yellow', hex: '#FCD34D' },
        { name: 'Warm Coral', hex: '#FCA5A5' },
        { name: 'Natural Sand', hex: '#E7E5E4' },
      ],
      rating: 4.9,
      reviewCount: 31,
      isCodAvailable: true,
      washCare: 'Hand wash or gentle cycle.',
      isNewArrival: true,
    },
    {
      id: 'ls-06',
      title: 'Little Explorer Dino Play Set',
      slug: 'little-explorer-dino-play-set',
      description: 'Two-piece matching summer set featuring an adorable illustrated dinosaur tee and comfy drawstring shorts with deep pockets.',
      category: ClothingCategory.PANTS,
      ageGroup: AgeGroup.TODDLER,
      gender: Gender.BOYS,
      fabric: '100% Breathable Cotton Slub',
      mrp: 3100,
      sellingPrice: 2690,
      images: [
        '/images/products/dino-set.jpg',
        '/images/products/celebration_lounge_set_boy.jpg',
        '/images/products/vika_studio_tracksuit_boy.jpg',
      ],
      variants: [
        { size: '2-3Y', sku: 'SET-DNO-23Y', stock: 15 },
        { size: '3-4Y', sku: 'SET-DNO-34Y', stock: 12 },
        { size: '4-5Y', sku: 'SET-DNO-45Y', stock: 9 },
      ],
      colors: [
        { name: 'Sage Mint', hex: '#86EFAC' },
        { name: 'Sky Blue', hex: '#93C5FD' },
        { name: 'Clay Sand', hex: '#FDE047' },
      ],
      rating: 4.8,
      reviewCount: 44,
      isCodAvailable: true,
      washCare: 'Machine wash cold.',
      isNewArrival: true,
    },

    // ----------------- ROW 2: IDENTICAL STUDIO BOUTIQUE HARMONY -----------------
    {
      id: 'ls-07',
      title: 'Vintage Floral Ruffle Sundress',
      slug: 'vintage-floral-ruffle-sundress',
      description: 'Sweet pastel floral frock with layered flutter collar, tailored in breathable lightweight cotton poplin for summer outings.',
      category: ClothingCategory.DRESSES,
      ageGroup: AgeGroup.LITTLE_KIDS,
      gender: Gender.GIRLS,
      fabric: '100% Breathable Cotton Poplin',
      mrp: 3700,
      sellingPrice: 3190,
      images: [
        '/images/products/sundress-girl.jpg',
        '/images/products/floral-dress.jpg',
        '/images/products/party-frock.jpg',
      ],
      variants: [
        { size: '3-4Y', sku: 'DRS-VNT-34Y', stock: 11 },
        { size: '4-5Y', sku: 'DRS-VNT-45Y', stock: 14 },
        { size: '5-6Y', sku: 'DRS-VNT-56Y', stock: 8 },
      ],
      colors: [
        { name: 'Blossom Pink', hex: '#FBCFE8' },
        { name: 'Vanilla Cream', hex: '#FEF3C7' },
        { name: 'Dusty Coral', hex: '#FDA4AF' },
      ],
      rating: 4.9,
      reviewCount: 37,
      isCodAvailable: true,
      washCare: 'Machine wash cold gentle.',
      isNewArrival: true,
    },
    {
      id: 'ls-08',
      title: 'Pastel Rainbow Knit Pullover',
      slug: 'pastel-rainbow-knit-pullover',
      description: 'Cozy dusty-pink ribbed knit sweater with delicate rainbow embroidery. Buttery soft cotton gentle on sensitive toddler skin.',
      category: ClothingCategory.TSHIRTS,
      ageGroup: AgeGroup.LITTLE_KIDS,
      gender: Gender.GIRLS,
      fabric: '100% Combed Organic Cotton Knit',
      mrp: 3500,
      sellingPrice: 2890,
      images: [
        '/images/products/rainbow-sweater-girl.jpg',
        '/images/products/heart-sweatshirt.jpg',
        '/images/products/curly-girl-dress.jpg',
      ],
      variants: [
        { size: '2-3Y', sku: 'SWT-RNB-23Y', stock: 12 },
        { size: '3-4Y', sku: 'SWT-RNB-34Y', stock: 15 },
        { size: '4-5Y', sku: 'SWT-RNB-45Y', stock: 10 },
      ],
      colors: [
        { name: 'Blush Rose', hex: '#F48FB1' },
        { name: 'Pastel Mint', hex: '#A7F3D0' },
        { name: 'Warm Cream', hex: '#FEF3C7' },
      ],
      rating: 5.0,
      reviewCount: 46,
      isCodAvailable: true,
      washCare: 'Gentle wash inside out. Dry flat.',
      isNewArrival: true,
    },
    {
      id: 'ls-09',
      title: 'Chic Belted Denim Tiered Dress',
      slug: 'chic-belted-denim-tiered-dress',
      description: 'Trendy dark wash belted denim dress with bell sleeves, crafted in soft breathable lightweight chambray for stylish daytime parties.',
      category: ClothingCategory.DRESSES,
      ageGroup: AgeGroup.LITTLE_KIDS,
      gender: Gender.GIRLS,
      fabric: '100% Breathable Soft Chambray Denim',
      mrp: 3600,
      sellingPrice: 2990,
      images: [
        '/images/products/denim_dress_girl.jpg',
        '/images/products/denim_dungarees_girl.jpg',
        '/images/products/party-frock.jpg',
      ],
      variants: [
        { size: '3-4Y', sku: 'DRS-DNM-34Y', stock: 12 },
        { size: '4-5Y', sku: 'DRS-DNM-45Y', stock: 15 },
        { size: '5-6Y', sku: 'DRS-DNM-56Y', stock: 9 },
      ],
      colors: [
        { name: 'Indigo Denim', hex: '#254E70' },
        { name: 'Pastel Blush', hex: '#F9A8D4' },
        { name: 'Natural Sand', hex: '#E2E8F0' },
      ],
      rating: 4.9,
      reviewCount: 35,
      isCodAvailable: true,
      washCare: 'Machine wash warm with like colors.',
      isNewArrival: true,
    },
    {
      id: 'ls-10',
      title: 'Stone-Washed Denim Dungarees',
      slug: 'stone-washed-denim-dungarees',
      description: 'Timeless vintage denim overalls with brass hardware and adjustable shoulder suspenders. Paired with a striped soft cotton crew tee.',
      category: ClothingCategory.PANTS,
      ageGroup: AgeGroup.TODDLER,
      gender: Gender.UNISEX,
      fabric: '100% Washed Soft Cotton Denim',
      mrp: 4200,
      sellingPrice: 3490,
      images: [
        '/images/products/denim_dungarees_girl.jpg',
        '/images/products/denim_dress_girl.jpg',
        '/images/products/striped-tee.jpg',
      ],
      variants: [
        { size: '1-2Y', sku: 'DNG-VNT-12Y', stock: 10 },
        { size: '2-3Y', sku: 'DNG-VNT-23Y', stock: 15 },
        { size: '3-4Y', sku: 'DNG-VNT-34Y', stock: 11 },
      ],
      colors: [
        { name: 'Classic Indigo', hex: '#2563EB' },
        { name: 'Bubblegum Pink', hex: '#F472B6' },
        { name: 'Natural Sand', hex: '#E2E8F0' },
      ],
      rating: 4.8,
      reviewCount: 28,
      isCodAvailable: true,
      washCare: 'Machine wash cold inside out.',
      isNewArrival: true,
    },
    {
      id: 'ls-11',
      title: 'Celebration Star Lounge Set',
      slug: 'celebration-star-lounge-set',
      description: 'Joyful two-piece festive celebration set with an ivory long-sleeve crew sweater and vibrant lounge joggers in buttery soft organic cotton.',
      category: ClothingCategory.PANTS,
      ageGroup: AgeGroup.LITTLE_KIDS,
      gender: Gender.BOYS,
      fabric: '100% GOTS Pure Organic Cotton Slub',
      mrp: 3800,
      sellingPrice: 3190,
      images: [
        '/images/products/celebration_lounge_set_boy.jpg',
        '/images/products/dino-set.jpg',
        '/images/products/striped_sailor_tracksuit_boy.jpg',
      ],
      variants: [
        { size: '3-4Y', sku: 'SET-STR-34Y', stock: 12 },
        { size: '4-5Y', sku: 'SET-STR-45Y', stock: 16 },
        { size: '5-6Y', sku: 'SET-STR-56Y', stock: 10 },
      ],
      colors: [
        { name: 'Tangerine Sun', hex: '#FB923C' },
        { name: 'Ivory White', hex: '#FAF5FF' },
        { name: 'Golden Glow', hex: '#FDE047' },
      ],
      rating: 5.0,
      reviewCount: 42,
      isCodAvailable: true,
      washCare: 'Hand wash or gentle cycle. Dry flat.',
      isNewArrival: true,
    },
    {
      id: 'ls-12',
      title: 'Mustard Linen Tailored Blazer Set',
      slug: 'mustard-linen-tailored-blazer-set',
      description: 'Sophisticated single-breasted European flax linen blazer with horn buttons, paired with a white tee and washed denim.',
      category: ClothingCategory.ETHNIC,
      ageGroup: AgeGroup.LITTLE_KIDS,
      gender: Gender.BOYS,
      fabric: '100% Pure Washed European Linen',
      mrp: 4900,
      sellingPrice: 3990,
      images: [
        '/images/products/mustard-blazer-boy.jpg',
        '/images/products/tweed-cap-boy.jpg',
        '/images/products/bomber-jacket.jpg',
      ],
      variants: [
        { size: '3-4Y', sku: 'BLZ-MST-34Y', stock: 8 },
        { size: '4-5Y', sku: 'BLZ-MST-45Y', stock: 12 },
        { size: '5-6Y', sku: 'BLZ-MST-56Y', stock: 9 },
      ],
      colors: [
        { name: 'Mustard Gold', hex: '#E5BA73' },
        { name: 'Classic Navy', hex: '#1E3A8A' },
        { name: 'Natural Sand', hex: '#E2E8F0' },
      ],
      rating: 4.9,
      reviewCount: 39,
      isCodAvailable: true,
      washCare: 'Dry clean or gentle cold wash. Iron damp.',
      isNewArrival: true,
    },
  ];

  constructor() {
    this.db = DatabaseClient.getInstance();
    if (!this.db.has(MockProductRepository.STORAGE_KEY)) {
      this.db.set(MockProductRepository.STORAGE_KEY, [...MockProductRepository.INITIAL_PRODUCTS]);
    }
  }

  private getStore(): Product[] {
    if (!this.db.has(MockProductRepository.STORAGE_KEY)) {
      this.db.set(MockProductRepository.STORAGE_KEY, [...MockProductRepository.INITIAL_PRODUCTS]);
    }
    const stored = this.db.get<Product[]>(MockProductRepository.STORAGE_KEY)!;
    // Synchronize multi-image gallery if products have single image
    let hasChanges = false;
    for (const p of stored) {
      if (!p.images || p.images.length <= 1) {
        const initial = MockProductRepository.INITIAL_PRODUCTS.find((init) => init.id === p.id);
        if (initial && initial.images && initial.images.length > 1) {
          p.images = initial.images;
          hasChanges = true;
        }
      }
    }
    if (hasChanges) {
      this.db.set(MockProductRepository.STORAGE_KEY, stored);
    }
    return stored;
  }

  public async getAllProducts(): Promise<Product[]> {
    return this.getStore();
  }

  public async getProductById(id: string): Promise<Product | null> {
    const products = this.getStore();
    const product = products.find((p) => p.id === id);
    return product || null;
  }

  public async getProductBySlug(slug: string): Promise<Product | null> {
    const products = this.getStore();
    const product = products.find((p) => p.slug === slug);
    return product || null;
  }

  public async filterProducts(options: ProductFilterOptions): Promise<Product[]> {
    const products = this.getStore();
    let filtered = products.filter((product) => {
      // Special Sale filter
      if (options.category === 'sale' || options.onSaleOnly) {
        const hasDiscount = product.mrp > product.sellingPrice || (typeof product.offerPercentage === 'number' && product.offerPercentage > 0);
        if (!hasDiscount) return false;
      } else if (options.category === 'Nightwear') {
        if (product.category !== 'Sleepwear & Pyjamas' && product.category !== 'Nightwear') return false;
      } else if (options.category && product.category !== options.category) {
        return false;
      }

      if (options.isNewArrival && !product.isNewArrival) return false;

      if (options.ageGroup) {
        const optionAge = String(options.ageGroup).toLowerCase();
        const productAge = String(product.ageGroup || '').toLowerCase();
        const matchesExact = productAge === optionAge;
        const matchesBaby =
          optionAge.includes('baby') &&
          (productAge.includes('baby') || productAge.includes('infant') || product.category.toLowerCase().includes('romper'));
        const matchesToddler = optionAge.includes('toddler') && productAge.includes('toddler');
        const matchesKids =
          (optionAge.includes('little') || optionAge.includes('kid')) &&
          (productAge.includes('little') || productAge.includes('kid'));
        if (!matchesExact && !matchesBaby && !matchesToddler && !matchesKids) return false;
      }

      if (options.gender) {
        const optionGender = String(options.gender).toLowerCase();
        const productGender = String(product.gender || '').toLowerCase();
        if (productGender !== 'unisex' && !productGender.includes(optionGender)) return false;
      }

      if (options.maxPrice && product.sellingPrice > options.maxPrice) return false;
      if (options.codOnly && !product.isCodAvailable) return false;

      if (options.searchQuery && options.searchQuery.trim()) {
        const q = options.searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesFabric = product.fabric.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesFabric && !matchesDesc) return false;
      }

      return true;
    });

    if (options.sortBy) {
      if (options.sortBy === 'price-low') {
        filtered = [...filtered].sort((a, b) => a.sellingPrice - b.sellingPrice);
      } else if (options.sortBy === 'price-high') {
        filtered = [...filtered].sort((a, b) => b.sellingPrice - a.sellingPrice);
      } else if (options.sortBy === 'rating') {
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
      }
    }

    return filtered;
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = this.getStore();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) return null;

    products[productIndex] = {
      ...products[productIndex],
      ...updates,
    };
    this.db.set(MockProductRepository.STORAGE_KEY, products);
    return products[productIndex];
  }

  public async toggleStock(id: string, inStock: boolean): Promise<Product | null> {
    const products = this.getStore();
    const product = products.find((p) => p.id === id);
    if (!product) return null;

    product.variants.forEach((v) => {
      v.stock = inStock ? (v.stock > 0 ? v.stock : 10) : 0;
    });

    this.db.set(MockProductRepository.STORAGE_KEY, products);
    return product;
  }

  public async createProduct(newProduct: Product): Promise<Product> {
    const products = this.getStore();
    products.unshift(newProduct);
    this.db.set(MockProductRepository.STORAGE_KEY, products);
    return newProduct;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const products = this.getStore();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length !== products.length) {
      this.db.set(MockProductRepository.STORAGE_KEY, filtered);
      return true;
    }
    return false;
  }

  /**
   * Validates and deducts stock for purchased cart items
   */
  public async deductStock(
    items: { product: { id: string; title: string }; selectedVariant?: { size: string }; quantity: number }[]
  ): Promise<{ success: boolean; message?: string }> {
    const products = this.getStore();

    // 1. Validation phase
    for (const item of items) {
      const prod = products.find((p) => p.id === item.product.id);
      if (!prod) {
        return { success: false, message: `Product "${item.product.title}" is no longer available.` };
      }

      const reqSize = item.selectedVariant?.size;
      if (reqSize) {
        const variant = prod.variants.find((v) => v.size === reqSize);
        if (!variant || variant.stock < item.quantity) {
          const avail = variant?.stock ?? 0;
          return {
            success: false,
            message: `Only ${avail} item(s) left in stock for "${prod.title}" (Size: ${reqSize}).`,
          };
        }
      } else {
        const totalStock = prod.variants.reduce((s, v) => s + v.stock, 0);
        if (totalStock < item.quantity) {
          return {
            success: false,
            message: `Insufficient stock for "${prod.title}". Only ${totalStock} available.`,
          };
        }
      }
    }

    // 2. Deduction phase
    for (const item of items) {
      const prod = products.find((p) => p.id === item.product.id);
      if (prod) {
        const reqSize = item.selectedVariant?.size;
        if (reqSize) {
          const variant = prod.variants.find((v) => v.size === reqSize);
          if (variant) {
            variant.stock = Math.max(0, variant.stock - item.quantity);
          }
        } else if (prod.variants.length > 0) {
          prod.variants[0].stock = Math.max(0, prod.variants[0].stock - item.quantity);
        }
      }
    }

    this.db.set(MockProductRepository.STORAGE_KEY, products);
    return { success: true };
  }

  /**
   * Restores stock when an order is cancelled
   */
  public async restoreStock(
    items: { product: { id: string }; selectedVariant?: { size: string }; quantity: number }[]
  ): Promise<void> {
    const products = this.getStore();
    for (const item of items) {
      const prod = products.find((p) => p.id === item.product.id);
      if (prod) {
        const reqSize = item.selectedVariant?.size;
        if (reqSize) {
          const variant = prod.variants.find((v) => v.size === reqSize);
          if (variant) {
            variant.stock += item.quantity;
          }
        } else if (prod.variants.length > 0) {
          prod.variants[0].stock += item.quantity;
        }
      }
    }
    this.db.set(MockProductRepository.STORAGE_KEY, products);
  }
}
