import { NextRequest, NextResponse } from 'next/server';
import { PincodeServiceAdapter } from '@/infrastructure/patterns/structural/PincodeServiceAdapter';

/**
 * Next.js Route Handler for Logistics Pincode Check
 * Uses PincodeServiceAdapter (Adapter Pattern)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get('pincode');

  if (!pincode || pincode.trim().length !== 6) {
    return NextResponse.json(
      { isServiceable: false, message: 'Valid 6-digit pincode is required' },
      { status: 400 }
    );
  }

  const result = await PincodeServiceAdapter.checkServiceability(pincode);
  return NextResponse.json(result);
}
