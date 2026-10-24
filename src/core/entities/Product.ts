import { AgeGroup, ClothingCategory, Gender } from '@/shared/types/common';

/**
 * SADP - Product Entity
 * Represents a kidswear garment with fabric specifications, size variants, colors, and pricing.
 */
export interface ProductVariant {
  size: string; // e.g. "0-3M", "2-3Y", "4-5Y"
  sku: string;
  stock: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ClothingCategory | string;
  ageGroup: AgeGroup;
  gender: Gender;
  fabric: string; // e.g., "100% Organic Cotton", "Soft Muslin", "Breathable Linen"
  mrp: number; // Maximum Retail Price in LKR
  sellingPrice: number; // Discounted Price in LKR
  images: string[];
  variants: ProductVariant[];
  colors?: ProductColor[]; // Color variant swatches (as seen in the reference)
  rating: number;
  reviewCount: number;
  isCodAvailable: boolean; // Flag to indicate COD eligibility for this product
  washCare: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  offerPercentage?: number; // Discount percentage (e.g. 15 for 15% OFF)
  sizeChartType?: 'baby' | 'toddler' | 'junior' | 'custom';
  sizeChartImage?: string; // Optional custom size chart photo
  sizeNotes?: string; // Sizing advice for parents
  deliveryFeeType?: 'default' | 'free' | 'custom'; // Custom delivery fee rule per product
  customDeliveryFee?: number; // Specific delivery fee in LKR if 'custom'
}
