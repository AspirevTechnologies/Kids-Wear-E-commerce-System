import { CartItem } from '@/core/entities/Cart';
import { Order } from '@/core/entities/Order';
import { Address, PaymentMethod, PaymentStatus } from '@/shared/types/common';
import { PaymentFactory } from '../creational/PaymentFactory';
import { OrderBuilder } from '../creational/OrderBuilder';
import { MockOrderRepository } from '../../repositories/MockOrderRepository';
import { MockProductRepository } from '../../repositories/MockProductRepository';
import { PincodeServiceAdapter } from './PincodeServiceAdapter';
import { OrderEventDispatcher } from '../behavioral/events/OrderEventDispatcher';
import { CalculateOrderSummaryUseCase } from '@/core/use-cases/CalculateOrderSummaryUseCase';

export interface CheckoutRequest {
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  isCodOtpConfirmed?: boolean;
}

export interface CheckoutResponse {
  success: boolean;
  order?: Order;
  message: string;
  requiresOtpVerification?: boolean;
}

/**
 * SADP Pattern: Facade (Structural)
 * Provides a unified orchestrator for the entire checkout and order lifecycle:
 * 1. Checks delivery serviceability across Sri Lankan districts
 * 2. Runs authoritative Payment Strategy (COD vs Manual Bank Transfer)
 * 3. Builds Order with snapshot pricing and separate payment/fulfillment statuses
 * 4. Persists to Repository
 * 5. Dispatches Order Placed event
 */
export class CheckoutFacade {
  private orderRepository: MockOrderRepository;

  constructor() {
    this.orderRepository = new MockOrderRepository();
  }

  public async executeCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
    try {
      const { items, shippingAddress, paymentMethod, isCodOtpConfirmed } = request;

      if (!items || items.length === 0) {
        return { success: false, message: 'Shopping bag is empty.' };
      }

      // Step 1: Logistics & Pincode serviceability check
      const serviceability = await PincodeServiceAdapter.checkServiceability(shippingAddress.pincode || '00300');
      if (!serviceability.isServiceable) {
        return {
          success: false,
          message: `Delivery is currently not available to pincode ${shippingAddress.pincode}.`,
        };
      }

      // Step 2: Payment Strategy execution via PaymentFactory
      const summary = CalculateOrderSummaryUseCase.execute(items, paymentMethod, shippingAddress.district);
      const paymentStrategy = PaymentFactory.create(paymentMethod);
      const paymentResult = await paymentStrategy.processPayment(summary.subtotal, items, shippingAddress);

      if (!paymentResult.success) {
        return {
          success: false,
          message: paymentResult.message,
          requiresOtpVerification: paymentResult.requiresOtpVerification,
        };
      }

      // Step 2.5: Authoritative inventory stock validation & deduction
      const productRepo = new MockProductRepository();
      const stockResult = await productRepo.deductStock(items);
      if (!stockResult.success) {
        return {
          success: false,
          message: stockResult.message || 'One or more items in your cart are currently out of stock.',
        };
      }

      // Step 3: Build Order using Builder Pattern
      const builder = new OrderBuilder()
        .setItems(items)
        .setShippingAddress(shippingAddress)
        .setPaymentMethod(paymentMethod);

      if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
        builder.setBankReference(paymentResult.transactionReference);
      }

      builder.setCodVerification(
        Boolean(isCodOtpConfirmed),
        paymentMethod === PaymentMethod.COD
          ? `COD Doorstep • Ref: ${paymentResult.transactionReference}`
          : `Bank Transfer • Ref: ${paymentResult.transactionReference}`
      );

      const order = builder.build();

      // Step 4: Persist in Order Repository
      await this.orderRepository.save(order);

      // Step 5: Dispatch Observer Event
      await OrderEventDispatcher.dispatch('ORDER_PLACED', order);

      return {
        success: true,
        order,
        message: paymentMethod === PaymentMethod.COD
          ? 'COD Order placed successfully! You can pay cash upon delivery.'
          : 'Order placed successfully! Please transfer the amount to our bank account.',
        requiresOtpVerification: paymentMethod === PaymentMethod.COD && !isCodOtpConfirmed,
      };
    } catch (error: any) {
      console.error('[CheckoutFacade Error]:', error);
      return {
        success: false,
        message: error.message || 'An error occurred while placing the order.',
      };
    }
  }

  public async getOrder(orderId: string): Promise<Order | null> {
    return this.orderRepository.findById(orderId);
  }

  public async getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
    return this.orderRepository.findByOrderNumber(orderNumber);
  }

  public async getOrdersByPhone(phone: string): Promise<Order[]> {
    return this.orderRepository.findByPhone(phone);
  }

  public async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  public async updateBankTransferReceipt(orderId: string, referenceOrSlipUrl: string): Promise<Order | null> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) return null;

    order.slipUrl = referenceOrSlipUrl;
    order.paymentStatus = PaymentStatus.VERIFICATION_PENDING;
    order.verificationNotes = `Customer submitted slip/reference: ${referenceOrSlipUrl} on ${new Date().toLocaleString()}`;
    await this.orderRepository.update(order);
    return order;
  }
}
