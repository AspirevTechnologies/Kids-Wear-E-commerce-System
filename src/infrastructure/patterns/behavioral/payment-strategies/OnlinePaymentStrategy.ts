import { IPaymentStrategy, PaymentExecutionResult } from './IPaymentStrategy';
import { CartItem } from '@/core/entities/Cart';
import { Address } from '@/shared/types/common';

/**
 * SADP Pattern: Strategy Implementation for Online Prepaid Payment (UPI / Cards / NetBanking)
 */
export class OnlinePaymentStrategy implements IPaymentStrategy {
  public async processPayment(
    amount: number,
    items: CartItem[],
    shippingAddress: Address
  ): Promise<PaymentExecutionResult> {
    // Simulates an immediate tokenized online payment execution (e.g. Razorpay/Stripe)
    const txId = 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    return {
      success: true,
      transactionReference: txId,
      message: 'Prepaid payment authorized successfully.',
      requiresOtpVerification: false,
      convenienceFee: 0,
    };
  }
}
