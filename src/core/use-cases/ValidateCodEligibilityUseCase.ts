import { CartItem } from '../entities/Cart';
import { COD_RULES } from '../constants/CodRules';
import { DatabaseClient } from '@/infrastructure/database/DatabaseClient';
import { StoreSettings } from '../entities/StoreSettings';

export interface CodValidationResult {
  isEligible: boolean;
  reason?: string;
  minAmount?: number;
  maxAmount?: number;
  codFee: number;
}

/**
 * SADP - Use Case: Validate COD Eligibility
 * Domain rule checker to prevent COD fraud & verify logistical constraints in Sri Lanka.
 * Reads dynamic thresholds configured by Seller Admin in StoreSettings.
 */
export class ValidateCodEligibilityUseCase {
  public static execute(
    cartItems: CartItem[],
    subtotal: number,
    pincode?: string
  ): CodValidationResult {
    if (!cartItems || cartItems.length === 0) {
      return {
        isEligible: false,
        reason: 'Your shopping cart is empty.',
        codFee: 0,
      };
    }

    // 1. Check dynamic store settings
    const db = DatabaseClient.getInstance();
    const settings = db.get<StoreSettings>('store_settings');
    const minOrder = settings?.delivery?.codMinOrder ?? COD_RULES.MIN_ORDER_AMOUNT;
    const maxOrder = settings?.delivery?.codMaxOrder ?? COD_RULES.MAX_ORDER_AMOUNT;

    // 2. Check if any item in cart has COD disabled
    const nonCodItem = cartItems.find((item) => !item.product.isCodAvailable);
    if (nonCodItem) {
      return {
        isEligible: false,
        reason: `Item "${nonCodItem.product.title}" does not support Cash on Delivery.`,
        codFee: 0,
      };
    }

    // 3. Check Minimum Order Amount
    if (subtotal < minOrder) {
      return {
        isEligible: false,
        reason: `Cash on Delivery is available for orders above Rs. ${minOrder.toLocaleString()}. Please add Rs. ${(minOrder - subtotal).toLocaleString()} more to qualify.`,
        minAmount: minOrder,
        codFee: 0,
      };
    }

    // 4. Check Maximum Order Amount (Fraud & RTO control)
    if (subtotal > maxOrder) {
      return {
        isEligible: false,
        reason: `Orders above Rs. ${maxOrder.toLocaleString()} require direct bank transfer deposit for delivery security.`,
        maxAmount: maxOrder,
        codFee: 0,
      };
    }

    // 5. Check Blocked Pincodes
    if (pincode && COD_RULES.BLOCKED_PINCODES.includes(pincode.trim())) {
      return {
        isEligible: false,
        reason: `Cash on Delivery is temporarily unavailable for postal code ${pincode}. Please select Direct Bank Transfer.`,
        codFee: 0,
      };
    }

    // Calculate applicable COD fee
    const codFee = subtotal >= COD_RULES.FREE_COD_THRESHOLD ? 0 : COD_RULES.COD_HANDLING_FEE;

    return {
      isEligible: true,
      codFee,
    };
  }
}
