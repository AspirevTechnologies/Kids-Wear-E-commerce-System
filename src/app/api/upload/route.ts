import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/infrastructure/database/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'products';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided in the request.' },
        { status: 400 }
      );
    }

    // Limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds maximum allowed 10MB limit.' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Clean file extension and name
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_')
      .replace(/_+/g, '_');
    const filePath = `${timestamp}-${randomSuffix}-${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('[Supabase Storage Upload Error]:', error);
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to upload to Supabase storage.' },
        { status: 500 }
      );
    }

    if (bucket === 'products') {
      const { data: publicData } = supabase.storage
        .from('products')
        .getPublicUrl(data.path);

      return NextResponse.json({
        success: true,
        url: publicData.publicUrl,
        path: data.path,
        message: 'Product image uploaded to Supabase Storage successfully.',
      });
    } else {
      // Private bucket for receipts/slips: generate signed URL valid for 7 days
      const { data: signedData } = await supabase.storage
        .from(bucket)
        .createSignedUrl(data.path, 60 * 60 * 24 * 7);

      return NextResponse.json({
        success: true,
        url: signedData?.signedUrl || data.path,
        path: data.path,
        message: 'Deposit slip uploaded securely to Supabase Storage.',
      });
    }
  } catch (err: any) {
    console.error('[Upload API Exception]:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error during upload.' },
      { status: 500 }
    );
  }
}
