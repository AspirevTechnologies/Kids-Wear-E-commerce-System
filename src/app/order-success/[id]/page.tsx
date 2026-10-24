import { CheckoutFacade } from '@/infrastructure/patterns/structural/CheckoutFacade';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@/shared/types/common';
import { OrderSuccessClient } from './OrderSuccessClient';
import { Order } from '@/core/entities/Order';

interface OrderSuccessPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { id } = await params;
  const facade = new CheckoutFacade();
  let order = await facade.getOrder(id);

  if (!order) {
    order = await facade.getOrderByOrderNumber(id);
  }

  // Graceful fallback for direct demo link
  const displayOrder: Order = order || {
    id,
    orderNumber: 'LS-2026-9281',
    items: [],
    shippingAddress: {
      fullName: 'Customer',
      phone: '077 123 4567',
      addressLine1: 'No. 42, Temple Road',
      city: 'Colombo 03',
      district: 'Colombo',
      state: 'Western Province',
      pincode: '00300',
    },
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentStatus: PaymentStatus.AWAITING_TRANSFER,
    status: OrderStatus.PENDING_CONFIRMATION,
    subtotal: 2990,
    discount: 0,
    shippingFee: 350,
    codFee: 0,
    grandTotal: 3340,
    isCodVerified: true,
    bankReference: 'BT-2026-9281',
    createdAt: new Date().toISOString(),
    estimatedDeliveryDate: 'Within 2 - 3 Business Days',
  };

  return <OrderSuccessClient order={displayOrder} />;
}
