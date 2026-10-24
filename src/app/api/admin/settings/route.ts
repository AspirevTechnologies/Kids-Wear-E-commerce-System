import { NextRequest, NextResponse } from 'next/server';
import { SettingsRepository } from '@/infrastructure/repositories/SettingsRepository';

/**
 * Seller Admin Settings Management API
 * Allows the store administrator to update corporate bank accounts, delivery fees, and contact details.
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { bankAccounts, delivery, contact, categories, categoryDetails } = body;

    const settingsRepo = new SettingsRepository();
    const updated = await settingsRepo.updateSettings({
      bankAccounts,
      delivery,
      contact,
      categories,
      categoryDetails,
    });

    return NextResponse.json({
      success: true,
      settings: updated,
      message: 'Store settings updated successfully',
    });
  } catch (error: any) {
    console.error('[Settings PATCH Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update store settings', error: String(error) },
      { status: 500 }
    );
  }
}
