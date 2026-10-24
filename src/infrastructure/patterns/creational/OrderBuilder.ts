import { CartItem } from '@/core/entities/Cart';
import { Order } from '@/core/entities/Order';
import { Address, OrderStatus, PaymentMethod, PaymentStatus } from '@/shared/types/common';
import { CalculateOrderSummaryUseCase } from '@/core/use-cases/CalculateOrderSummaryUseCase';

/**
 * SADP Pattern: Builder (Creational)
 * Constructs a complex Kids Wear Order step-by-step with validation at each stage.
 * Enforces authoritative financial snapshots and decoupled payment/fulfillment states.
 */
export class OrderBuilder {
  private id: string = '';
  private orderNumber: string = '';
  private items: CartItem[] = [];
  private shippingAddress?: Address;
  private paymentMethod: PaymentMethod = PaymentMethod.COD;
  private paymentStatus: PaymentStatus = PaymentStatus.COD_PENDING;
  private status: OrderStatus = OrderStatus.PENDING_CONFIRMATION;
  private isCodVerified: boolean = false;
  private bankReference?: string;
  private slipUrl?: string;
  private verificationNotes?: string;

  constructor() {
    this.id = 'ord_' + Math.random().toString(36).substring(2, 9);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `LS-2026-${randomSuffix}`;
  }

  public setItems(items: CartItem[]): this {
    if (!items || items.length === 0) {
      throw new Error('An order must contain at least one item');
    }
    this.items = items;
    return this;
  }

  public setShippingAddress(address: Address): this {
    if (!address.fullName || !address.phone || !address.addressLine1) {
      throw new Error('Invalid shipping address: Name, Phone, and Address are required');
    }
    this.shippingAddress = address;
    return this;
  }

  public setPaymentMethod(method: PaymentMethod): this {
    this.paymentMethod = method;
    if (method === PaymentMethod.COD) {
      this.status = OrderStatus.PENDING_CONFIRMATION;
      this.paymentStatus = PaymentStatus.COD_PENDING;
      this.isCodVerified = false;
    } else if (method === PaymentMethod.BANK_TRANSFER) {
      this.status = OrderStatus.PENDING_CONFIRMATION;
      this.paymentStatus = PaymentStatus.AWAITING_TRANSFER;
      this.isCodVerified = true;
    } else {
      this.status = OrderStatus.CONFIRMED;
      this.paymentStatus = PaymentStatus.PAID;
      this.isCodVerified = true;
    }
    return this;
  }

  public setBankReference(reference: string): this {
    this.bankReference = reference;
    return this;
  }

  public setSlipUrl(url: string): this {
    this.slipUrl = url;
    if (url) {
      this.paymentStatus = PaymentStatus.VERIFICATION_PENDING;
    }
    return this;
  }

  public setCodVerification(isVerified: boolean, notes?: string): this {
    this.isCodVerified = isVerified;
    this.verificationNotes = notes;
    return this;
  }

  public build(): Order {
    if (!this.shippingAddress) {
      throw new Error('Shipping address is required to build an Order');
    }
    if (this.items.length === 0) {
      throw new Error('Cannot build an order with 0 items');
    }

    const summary = CalculateOrderSummaryUseCase.execute(
      this.items,
      this.paymentMethod,
      this.shippingAddress.district
    );

    // Calculate delivery date (2 to 4 business days)
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 3);

    return {
      id: this.id,
      orderNumber: this.orderNumber,
      items: this.items,
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      status: this.status,
      subtotal: summary.subtotal,
      discount: summary.discount,
      shippingFee: summary.shippingFee,
      codFee: summary.codFee,
      grandTotal: summary.grandTotal,
      isCodVerified: this.isCodVerified,
      bankReference: this.bankReference,
      slipUrl: this.slipUrl,
      verificationNotes: this.verificationNotes,
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: delivery.toDateString(),
    };
  }
}
