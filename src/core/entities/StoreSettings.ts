import { BankAccountDetails } from '@/shared/types/common';

export interface DistrictDeliveryRate {
  id: string;
  name: string; // Group / Zone / District name (e.g. "Colombo 01-15", "Greater Kandy & Central", "Jaffna Peninsula")
  districts: string[]; // List of district names covered, or ["*"] for all other
  fee: number; // Delivery fee in LKR
  estimatedDays: string; // e.g. "Same-Day / 1 Day", "1-2 Business Days", "2-3 Business Days"
}

export interface StoreDeliverySettings {
  colomboFee: number;
  westernProvinceFee: number;
  outstationFee: number;
  freeShippingThreshold: number;
  codMinOrder: number;
  codMaxOrder: number;
  districtRates?: DistrictDeliveryRate[]; // Admin customizable list of district/zone rates
}

export interface StoreContactSettings {
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  workingHours: string;
}

export interface StoreCategoryItem {
  id: string;
  name: string;
  image: string;
}

export interface StoreSettings {
  bankAccounts: BankAccountDetails[];
  delivery: StoreDeliverySettings;
  contact: StoreContactSettings;
  categories?: string[]; // Custom store product categories (names)
  categoryDetails?: StoreCategoryItem[]; // Custom store categories with images
  updatedAt: string;
}
