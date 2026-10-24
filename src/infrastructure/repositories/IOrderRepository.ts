import { Order } from '@/core/entities/Order';

/**
 * SADP - Order Repository Interface
 * Defines persistent storage operations for customer and seller operations.
 */
export interface IOrderRepository {
  save(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  findById(orderId: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  findByPhone(phone: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
}
