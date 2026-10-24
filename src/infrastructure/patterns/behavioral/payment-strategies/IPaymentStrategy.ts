import { CartItem } from '@/core/entities/Cart';
import { Address } from '@/shared/types/common';

export interface PaymentExecutionResult {
  success: boolean;
  transactionReference: string;
  message: string;
  requiresOtpVerification: boolean;
  convenienceFee: number;
}

/**
 * SADP Pattern: Strategy (Behavioral)
 * Defines the interface for all payment mechanisms (Cash on Delivery vs Online Gateway).
 */
export interface IPaymentStrategy {
  processPayment(
    amount: number,
    items: CartItem[],
    shippingAddress: Address
  ): Promise<PaymentExecutionResult>;
}
