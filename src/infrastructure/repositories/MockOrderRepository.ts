import { IOrderRepository } from './IOrderRepository';
import { Order } from '@/core/entities/Order';
import { DatabaseClient } from '../database/DatabaseClient';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/shared/types/common';

/**
 * SADP - Mock Order Repository
 * Persists orders into the central DatabaseClient singleton for demo and local execution.
 * Pre-populates realistic Sri Lankan boutique demo orders for the Customer Dashboard.
 */
export class MockOrderRepository implements IOrderRepository {
  private static readonly STORAGE_KEY = 'orders_store';
  private db: DatabaseClient;

  constructor() {
    this.db = DatabaseClient.getInstance();
    if (!this.db.has(MockOrderRepository.STORAGE_KEY)) {
      const initialMap = new Map<string, Order>();
      
      // Seed Demo Order 1: Delivered COD Order
      const seedOrder1: Order = {
        id: 'ord_demo_01',
        orderNumber: 'LS-2026-4821',
        items: [
          {
            product: {
              id: 'ls-01',
              title: 'Floral Cotton Summer Dress',
              slug: 'floral-cotton-summer-dress',
              description: 'Charming summer dress in breathable cotton.',
              category: 'Dresses & Frocks' as any,
              ageGroup: '4-7 Years' as any,
              gender: 'Girls' as any,
              fabric: '100% GOTS Organic Cotton',
              mrp: 3500,
              sellingPrice: 2990,
              images: ['/images/products/floral-dress.jpg'],
              variants: [{ size: '3-4Y', sku: 'DRS-FLR-34Y', stock: 15 }],
              rating: 4.9,
              reviewCount: 48,
              isCodAvailable: true,
              washCare: 'Gentle wash',
              isNewArrival: true,
            },
            quantity: 1,
            selectedSize: '3-4Y',
          },
        ],
        shippingAddress: {
          fullName: 'Dilani Perera',
          phone: '0771234567',
          addressLine1: 'No. 28, Flower Road',
          addressLine2: 'Apt 4B, Green Court',
          city: 'Colombo 07',
          district: 'Colombo',
          state: 'Western Province',
          pincode: '00700',
        },
        paymentMethod: PaymentMethod.COD,
        paymentStatus: PaymentStatus.COD_COLLECTED,
        status: OrderStatus.DELIVERED,
        subtotal: 2990,
        discount: 0,
        shippingFee: 350,
        codFee: 0,
        grandTotal: 3340,
        isCodVerified: true,
        verificationNotes: 'Delivered by Prompt Xpress. Cash collected Rs. 3,340.',
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        estimatedDeliveryDate: new Date(Date.now() - 2 * 86400000).toDateString(),
      };

      // Seed Demo Order 2: Bank Transfer Awaiting Transfer
      const seedOrder2: Order = {
        id: 'ord_demo_02',
        orderNumber: 'LS-2026-7294',
        items: [
          {
            product: {
              id: 'ls-02',
              title: 'Hooded Bomber Utility Jacket',
              slug: 'hooded-bomber-utility-jacket',
              description: 'Trendy olive zip jacket.',
              category: 'Pants & Shorts' as any,
              ageGroup: '4-7 Years' as any,
              gender: 'Boys' as any,
              fabric: 'Cotton Twill with Jersey Lining',
              mrp: 4800,
              sellingPrice: 3990,
              images: ['/images/products/bomber-jacket.jpg'],
              variants: [{ size: '4-5Y', sku: 'JKT-BMB-45Y', stock: 14 }],
              rating: 4.8,
              reviewCount: 36,
              isCodAvailable: true,
              washCare: 'Cold wash',
              isNewArrival: true,
            },
            quantity: 1,
            selectedSize: '4-5Y',
          },
        ],
        shippingAddress: {
          fullName: 'Kavindu Senanayake',
          phone: '0719876543',
          addressLine1: 'No. 15/A, Kandy Road',
          city: 'Kandy',
          district: 'Kandy',
          state: 'Central Province',
          pincode: '20000',
        },
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentStatus: PaymentStatus.AWAITING_TRANSFER,
        status: OrderStatus.PENDING_CONFIRMATION,
        subtotal: 3990,
        discount: 0,
        shippingFee: 450,
        codFee: 0,
        grandTotal: 4440,
        isCodVerified: true,
        bankReference: 'BT-2026-8921',
        verificationNotes: 'Awaiting customer deposit to COMBANK account.',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        estimatedDeliveryDate: new Date(Date.now() + 2 * 86400000).toDateString(),
      };

      initialMap.set(seedOrder1.id, seedOrder1);
      initialMap.set(seedOrder2.id, seedOrder2);

      this.db.set(MockOrderRepository.STORAGE_KEY, initialMap);
    }
  }

  private getStore(): Map<string, Order> {
    return this.db.get<Map<string, Order>>(MockOrderRepository.STORAGE_KEY)!;
  }

  public async save(order: Order): Promise<Order> {
    const store = this.getStore();
    store.set(order.id, order);
    return order;
  }

  public async update(order: Order): Promise<Order> {
    const store = this.getStore();
    store.set(order.id, order);
    return order;
  }

  public async findById(orderId: string): Promise<Order | null> {
    const store = this.getStore();
    return store.get(orderId) || null;
  }

  public async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const store = this.getStore();
    const cleanQuery = orderNumber.trim().toUpperCase().replace('#', '');
    for (const order of store.values()) {
      if (order.orderNumber.toUpperCase() === cleanQuery || order.id.toUpperCase() === cleanQuery) {
        return order;
      }
    }
    return null;
  }

  public async findByPhone(phone: string): Promise<Order[]> {
    const store = this.getStore();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const results: Order[] = [];
    for (const order of store.values()) {
      const orderPhone = order.shippingAddress.phone.replace(/[^0-9]/g, '');
      if (orderPhone.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone)) {
        results.push(order);
      }
    }
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async findAll(): Promise<Order[]> {
    const store = this.getStore();
    return Array.from(store.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
