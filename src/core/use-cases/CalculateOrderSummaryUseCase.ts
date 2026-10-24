import { CartItem, CartSummary } from '../entities/Cart';
import { COD_RULES } from '../constants/CodRules';
import { PaymentMethod } from '@/shared/types/common';
import { DatabaseClient } from '@/infrastructure/database/DatabaseClient';
import { StoreSettings } from '../entities/StoreSettings';

/**
 * SADP - Use Case: Calculate Order Summary (Sri Lanka LKR)
 * Encapsulates pricing calculation logic, discounts, and COD fee calculation.
 * Respects dynamic store delivery fees and thresholds configured by Seller Admin.
 */
export class CalculateOrderSummaryUseCase {
  private static readonly DEFAULT_FREE_SHIPPING_THRESHOLD = 5000; // Free delivery over Rs. 5,000
  private static readonly DEFAULT_SHIPPING_FEE = 450;             // Standard Islandwide courier fee Rs. 450

  public static execute(
    items: CartItem[],
    paymentMethod: PaymentMethod = PaymentMethod.ONLINE,
    district?: string
  ): CartSummary {
    const db = DatabaseClient.getInstance();
    const settings = db.get<StoreSettings>('store_settings');

    const freeShippingThreshold = settings?.delivery?.freeShippingThreshold ?? this.DEFAULT_FREE_SHIPPING_THRESHOLD;
    
    let standardShippingFee = this.DEFAULT_SHIPPING_FEE;
    if (settings?.delivery) {
      // Check custom district rates configured by admin
      if (settings.delivery.districtRates && settings.delivery.districtRates.length > 0 && district) {
        const exactMatch = settings.delivery.districtRates.find((r) => r.districts.includes(district));
        const wildcardMatch = settings.delivery.districtRates.find((r) => r.districts.includes('*'));
        if (exactMatch) {
          standardShippingFee = exactMatch.fee;
        } else if (wildcardMatch) {
          standardShippingFee = wildcardMatch.fee;
        } else if (district === 'Colombo') {
          standardShippingFee = settings.delivery.colomboFee;
        } else if (district === 'Gampaha' || district === 'Kalutara') {
          standardShippingFee = settings.delivery.westernProvinceFee;
        } else {
          standardShippingFee = settings.delivery.outstationFee;
        }
      } else if (district === 'Colombo') {
        standardShippingFee = settings.delivery.colomboFee;
      } else if (district === 'Gampaha' || district === 'Kalutara') {
        standardShippingFee = settings.delivery.westernProvinceFee;
      } else {
        standardShippingFee = settings.delivery.outstationFee;
      }
    }

    // Check if any product has custom product-specific delivery fee or free shipping
    const hasCustomProductFee = items.some((item) => item.product.deliveryFeeType === 'custom');
    const allProductsFreeShipping = items.length > 0 && items.every((item) => item.product.deliveryFeeType === 'free');

    if (hasCustomProductFee) {
      // Use the maximum custom product delivery fee among items
      const maxProductFee = Math.max(
        ...items
          .filter((item) => item.product.deliveryFeeType === 'custom' && typeof item.product.customDeliveryFee === 'number')
          .map((item) => item.product.customDeliveryFee as number)
      );
      if (maxProductFee > 0) {
        standardShippingFee = maxProductFee;
      }
    }

    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = items.reduce((sum, item) => {
      return sum + item.product.sellingPrice * item.quantity;
    }, 0);

    // Free shipping above threshold or all items marked free delivery
    const isEligibleForFreeShipping = subtotal >= freeShippingThreshold || allProductsFreeShipping || items.length === 0;
    const shippingFee = items.length === 0 ? 0 : isEligibleForFreeShipping ? 0 : standardShippingFee;
    const freeShippingGap = Math.max(0, freeShippingThreshold - subtotal);

    // COD Fee logic (SADP Business Rule)
    let codFee = 0;
    if (paymentMethod === PaymentMethod.COD && items.length > 0) {
      // Free COD if subtotal >= FREE_COD_THRESHOLD
      codFee = subtotal >= COD_RULES.FREE_COD_THRESHOLD ? 0 : COD_RULES.COD_HANDLING_FEE;
    }

    const discount = items.reduce((sum, item) => {
      const mrpDiff = Math.max(0, item.product.mrp - item.product.sellingPrice);
      return sum + mrpDiff * item.quantity;
    }, 0);

    const grandTotal = subtotal + shippingFee + codFee;

    return {
      itemsCount,
      subtotal,
      discount,
      shippingFee,
      codFee,
      grandTotal,
      isEligibleForFreeShipping,
      freeShippingGap,
    };
  }
}
