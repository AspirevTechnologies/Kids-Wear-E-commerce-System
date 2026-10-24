import { NextResponse } from 'next/server';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';

/**
 * Public Settings API
 * Used by Customer Dashboard, Checkout Form, and Delivery Pages to retrieve dynamic store settings.
 */
export async function GET() {
  try {
    const settingsRepo = new SettingsRepository();
    const settings = await settingsRepo.getSettings();
    return NextResponse.json({ success: true, settings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
