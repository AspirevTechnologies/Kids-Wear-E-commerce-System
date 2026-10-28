import { NextResponse } from 'next/server';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

/**
 * Public Settings API
 * Used by Customer Dashboard, Checkout Form, and Delivery Pages to retrieve dynamic store settings.
 */
export async function GET() {
  try {
    const settingsRepo = new SettingsRepository();
    const settings = await settingsRepo.getSettings();
    return NextResponse.json(
      { success: true, settings },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch settings' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
