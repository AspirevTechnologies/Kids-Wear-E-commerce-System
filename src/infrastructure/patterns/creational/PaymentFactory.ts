import { PaymentMethod } from '@/shared/types/common';
import { IPaymentStrategy } from '@/infrastructure/patterns/behavioral/payment-strategies/IPaymentStrategy';
import { CashOnDeliveryStrategy } from '@/infrastructure/patterns/behavioral/payment-strategies/CashOnDeliveryStrategy';
import { BankTransferStrategy } from '@/infrastructure/patterns/behavioral/payment-strategies/BankTransferStrategy';
import { OnlinePaymentStrategy } from '@/infrastructure/patterns/behavioral/payment-strategies/OnlinePaymentStrategy';

/**
 * SADP Pattern: Factory (Creational)
 * Decouples client checkout code from the concrete payment strategy instantiation.
 */
export class PaymentFactory {
  public static create(method: PaymentMethod): IPaymentStrategy {
    switch (method) {
      case PaymentMethod.COD:
        return new CashOnDeliveryStrategy();

      case PaymentMethod.BANK_TRANSFER:
        return new BankTransferStrategy();

      case PaymentMethod.ONLINE:
        return new OnlinePaymentStrategy();

      default:
        return new BankTransferStrategy();
    }
  }
}
