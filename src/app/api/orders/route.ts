import { NextRequest, NextResponse } from 'next/server';
import { CheckoutFacade } from '@/infrastructure/patterns/structural/CheckoutFacade';

/**
 * Next.js Route Handler for Orders (runs serverless on Vercel)
 * Uses the CheckoutFacade (Facade Pattern) to process order creation.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const checkoutFacade = new CheckoutFacade();
    const result = await checkoutFacade.executeCheckout(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
