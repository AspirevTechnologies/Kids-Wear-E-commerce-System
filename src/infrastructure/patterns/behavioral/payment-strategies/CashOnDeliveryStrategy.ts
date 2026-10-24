import { IPaymentStrategy, PaymentExecutionResult } from './IPaymentStrategy';
import { CartItem } from '@/core/entities/Cart';
import { Address } from '@/shared/types/common';
import { ValidateCodEligibilityUseCase } from '@/core/use-cases/ValidateCodEligibilityUseCase';

/**
 * SADP Pattern: Strategy Implementation for Cash on Delivery (COD)
 * Handles customer phone verification requirement, COD surcharge, and fraud safeguards.
 */
export class CashOnDeliveryStrategy implements IPaymentStrategy {
  public async processPayment(
    amount: number,
    items: CartItem[],
    shippingAddress: Address
  ): Promise<PaymentExecutionResult> {
    // 1. Evaluate domain COD rules
    const validation = ValidateCodEligibilityUseCase.execute(items, amount, shippingAddress.pincode);

    if (!validation.isEligible) {
      return {
        success: false,
        transactionReference: '',
        message: validation.reason || 'Cash on Delivery is not available for this cart.',
        requiresOtpVerification: false,
        convenienceFee: 0,
      };
    }

    // 2. Validate Sri Lankan phone number format for COD delivery verification
    const cleanPhone = shippingAddress.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 12) {
      return {
        success: false,
        transactionReference: '',
        message: 'A valid Sri Lankan mobile number (e.g. 077 123 4567) is required for delivery driver coordination.',
        requiresOtpVerification: false,
        convenienceFee: 0,
      };
    }

    // 3. Generate COD Token Reference
    const codRef = 'COD-' + Date.now().toString(36).toUpperCase();

    return {
      success: true,
      transactionReference: codRef,
      message: 'Cash on Delivery selected. Hand exact cash in Sri Lankan Rupees (LKR) to the courier executive upon doorstep delivery.',
      requiresOtpVerification: false,
      convenienceFee: validation.codFee,
    };
  }
}
