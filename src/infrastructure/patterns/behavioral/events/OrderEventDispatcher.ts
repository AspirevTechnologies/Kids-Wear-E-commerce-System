import { Order } from '@/core/entities/Order';
import { PaymentMethod } from '@/shared/types/common';

export type OrderEventListener = (order: Order) => Promise<void> | void;

/**
 * SADP Pattern: Observer / Event Dispatcher (Behavioral)
 * Emits events upon order placement (e.g. sending WhatsApp confirmation / SMS OTP for COD).
 */
export class OrderEventDispatcher {
  private static listeners: Map<string, OrderEventListener[]> = new Map();

  public static subscribe(event: string, listener: OrderEventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  public static async dispatch(event: string, order: Order): Promise<void> {
    const list = this.listeners.get(event);
    if (!list || list.length === 0) return;

    for (const listener of list) {
      try {
        await listener(order);
      } catch (err) {
        console.error(`[OrderEventDispatcher] Error executing listener for event ${event}:`, err);
      }
    }
  }
}

// Auto-register built-in notification listeners for COD Orders
OrderEventDispatcher.subscribe('ORDER_PLACED', async (order: Order) => {
  if (order.paymentMethod === PaymentMethod.COD) {
    console.log(
      `[COD Notification Observer] Order #${order.orderNumber} placed via Cash on Delivery. Dispatching verification SMS to ${order.shippingAddress.phone}.`
    );
  } else {
    console.log(
      `[Bank Transfer Observer] Order #${order.orderNumber} placed via Bank Transfer. Awaiting transfer slip verification by seller.`
    );
  }
});
