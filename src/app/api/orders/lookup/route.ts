import { NextRequest, NextResponse } from 'next/server';
import { CheckoutFacade } from '@/infrastructure/patterns/structural/CheckoutFacade';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber');
    const phone = searchParams.get('phone');

    const facade = new CheckoutFacade();

    if (orderNumber) {
      const order = await facade.getOrderByOrderNumber(orderNumber);
      if (!order) {
        return NextResponse.json({ success: false, message: 'No order found with reference #' + orderNumber }, { status: 404 });
      }
      return NextResponse.json({ success: true, orders: [order] });
    }

    if (phone) {
      const orders = await facade.getOrdersByPhone(phone);
      return NextResponse.json({ success: true, orders });
    }

    // Default: return all demo/stored orders
    const all = await facade.getAllOrders();
    return NextResponse.json({ success: true, orders: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber, phone } = body;
    const facade = new CheckoutFacade();

    if (orderNumber) {
      const order = await facade.getOrderByOrderNumber(orderNumber);
      if (order) {
        return NextResponse.json({ success: true, orders: [order] });
      }
    }

    if (phone) {
      const orders = await facade.getOrdersByPhone(phone);
      if (orders.length > 0) {
        return NextResponse.json({ success: true, orders });
      }
    }

    return NextResponse.json({ success: false, message: 'No orders matched your search criteria.' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
