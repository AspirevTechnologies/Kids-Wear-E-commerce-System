import { IPaymentStrategy, PaymentExecutionResult } from './IPaymentStrategy';
import { CartItem } from '@/core/entities/Cart';
import { Address } from '@/shared/types/common';

/**
 * SADP Pattern: Strategy (Behavioral)
 * Concrete Strategy for Direct Manual Bank Transfer (No Payment Gateway required).
 * Complies with the AspireV Discovery Brief Section 04:
 * 1. Customer receives client-approved bank account details and unique transfer reference.
 * 2. Transfers funds outside website via Online Banking / CDM / Over-the-counter deposit.
 * 3. Order is marked as AWAITING_TRANSFER until verified by seller.
 */
export class BankTransferStrategy implements IPaymentStrategy {
  public async processPayment(
    amount: number,
    items: CartItem[],
    shippingAddress: Address
  ): Promise<PaymentExecutionResult> {
    if (amount <= 0) {
      return {
        success: false,
        transactionReference: '',
        message: 'Invalid order amount for bank transfer.',
        requiresOtpVerification: false,
        convenienceFee: 0,
      };
    }

    // Generate authoritative unique transfer reference
    const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const transferRef = `BT-${timestamp}-${randomSuffix}`;

    return {
      success: true,
      transactionReference: transferRef,
      message: 'Bank transfer order initiated. Please transfer funds to the designated account.',
      requiresOtpVerification: false,
      convenienceFee: 0,
    };
  }
}
