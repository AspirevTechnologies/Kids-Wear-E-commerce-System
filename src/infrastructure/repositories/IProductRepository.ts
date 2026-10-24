import { Product } from '@/core/entities/Product';
import { AgeGroup, ClothingCategory, Gender } from '@/shared/types/common';

/**
 * SADP Pattern: Repository (Structural / Architectural)
 * Decouples domain logic from the underlying database or headless e-commerce API.
 */
export interface ProductFilterOptions {
  category?: ClothingCategory | string;
  ageGroup?: AgeGroup;
  gender?: Gender;
  maxPrice?: number;
  codOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'newest';
  onSaleOnly?: boolean;
  isNewArrival?: boolean;
}

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  filterProducts(options: ProductFilterOptions): Promise<Product[]>;
}
