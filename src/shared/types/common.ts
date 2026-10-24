/**
 * SADP - Shared Domain Types & Enums
 * Defines the core vocabulary for the Kids Wear E-commerce platform.
 */

export enum AgeGroup {
  INFANT = '0-12 Months',
  TODDLER = '1-3 Years',
  LITTLE_KIDS = '4-7 Years',
  BIG_KIDS = '8-14 Years',
}

export enum Gender {
  BOYS = 'Boys',
  GIRLS = 'Girls',
  UNISEX = 'Unisex',
}

export enum ClothingCategory {
  ROMPERS = 'Rompers & Onesies',
  DRESSES = 'Dresses & Frocks',
  TSHIRTS = 'T-Shirts & Tops',
  PANTS = 'Pants & Shorts',
  NIGHTWEAR = 'Sleepwear & Pyjamas',
  ETHNIC = 'Festive & Ethnic Wear',
}

export enum PaymentMethod {
  COD = 'CASH_ON_DELIVERY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE_PREPAID', // Legacy alias for backward compatibility
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  AWAITING_TRANSFER = 'AWAITING_TRANSFER',
  VERIFICATION_PENDING = 'VERIFICATION_PENDING',
  PAID = 'PAID',
  COD_PENDING = 'COD_PENDING',
  COD_COLLECTED = 'COD_COLLECTED',
}

export enum OrderStatus {
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
  PENDING_COD_VERIFICATION = 'PENDING_COD_VERIFICATION',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface BankAccountDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  branchCode?: string;
  swiftCode?: string;
}

export interface Address {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
}

export interface ServiceabilityResult {
  pincode: string;
  city: string;
  state: string;
  isServiceable: boolean;
  isCodAvailable: boolean;
  estimatedDeliveryDays: number;
  codMessage?: string;
}
