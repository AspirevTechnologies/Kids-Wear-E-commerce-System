import { Address, OrderStatus, PaymentMethod, PaymentStatus } from '@/shared/types/common';
import { CartItem } from './Cart';

/**
 * SADP - Order Entity
 * Encapsulates the entire lifecycle of a kids wear purchase including COD and manual bank transfer conditions.
 * Implements separate fulfillment status and payment status per AspireV Discovery Architecture.
 */
export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shippingFee: number;
  codFee: number;
  grandTotal: number;
  isCodVerified: boolean; // True once OTP or phone confirmation is completed
  bankReference?: string;
  slipUrl?: string;
  verificationNotes?: string;
  createdAt: string;
  estimatedDeliveryDate: string;
}
