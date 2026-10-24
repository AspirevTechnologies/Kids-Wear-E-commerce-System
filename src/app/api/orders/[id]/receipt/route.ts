import { NextRequest, NextResponse } from 'next/server';
import { CheckoutFacade } from '@/infrastructure/patterns/structural/CheckoutFacade';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { referenceOrSlip } = body;

    if (!referenceOrSlip) {
      return NextResponse.json(
        { success: false, message: 'Reference or slip URL is required' },
        { status: 400 }
      );
    }

    const facade = new CheckoutFacade();
    const updated = await facade.updateBankTransferReceipt(id, referenceOrSlip);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update slip' },
      { status: 500 }
    );
  }
}
