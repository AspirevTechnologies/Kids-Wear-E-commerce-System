import { NextRequest, NextResponse } from 'next/server';
import { MockProductRepository } from '@/infrastructure/repositories/MockProductRepository';
import { Product } from '@/core/entities/Product';

/**
 * Seller Admin Product Management Route Handler
 * Full CRUD for Products: list, add new, edit details/price/stock, and remove.
 */
export async function GET() {
  try {
    const productRepo = new MockProductRepository();
    const products = await productRepo.getAllProducts();
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      category,
      fabric,
      mrp,
      sellingPrice,
      description,
      images,
      ageGroup,
      gender,
      stock,
      variants,
      offerPercentage,
      sizeChartType,
      sizeChartImage,
      sizeNotes,
      deliveryFeeType,
      customDeliveryFee,
    } = body;

    if (!title || !category || !sellingPrice) {
      return NextResponse.json(
        { success: false, message: 'Title, category, and selling price are required.' },
        { status: 400 }
      );
    }

    const productRepo = new MockProductRepository();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const newId = `ls-${Date.now().toString(36)}`;

    const numSellingPrice = Number(sellingPrice);
    const numMrp = Number(mrp) || numSellingPrice;

    // Calculate or accept offer percentage
    const computedDiscount =
      numMrp > numSellingPrice ? Math.round(((numMrp - numSellingPrice) / numMrp) * 100) : 0;
    const finalOfferPercentage =
      typeof offerPercentage === 'number' ? offerPercentage : computedDiscount;

    // Variants with individual size quantities
    let productVariants = variants && Array.isArray(variants) && variants.length > 0
      ? variants.map((v: any) => ({
          size: v.size,
          sku: `${slug.substring(0, 5).toUpperCase()}-${v.size.replace(/[^a-zA-Z0-9]/g, '')}`,
          stock: Number(v.stock) || 0,
        }))
      : [
          { size: '2-3Y', sku: `${slug.substring(0, 5).toUpperCase()}-23Y`, stock: Number(stock) || 10 },
          { size: '3-4Y', sku: `${slug.substring(0, 5).toUpperCase()}-34Y`, stock: Number(stock) || 12 },
          { size: '4-5Y', sku: `${slug.substring(0, 5).toUpperCase()}-45Y`, stock: Number(stock) || 8 },
        ];

    const newProduct: Product = {
      id: newId,
      title,
      slug,
      description: description || `${title} crafted for kids wear boutique.`,
      category,
      ageGroup: ageGroup || ('4-7 Years' as any),
      gender: gender || ('Unisex' as any),
      fabric: fabric || '100% GOTS Organic Cotton',
      mrp: numMrp,
      sellingPrice: numSellingPrice,
      offerPercentage: finalOfferPercentage,
      sizeChartType: sizeChartType || 'toddler',
      sizeChartImage: sizeChartImage || undefined,
      sizeNotes: sizeNotes || undefined,
      deliveryFeeType: deliveryFeeType || 'default',
      customDeliveryFee: typeof customDeliveryFee === 'number' ? customDeliveryFee : undefined,
      images: images && images.length > 0 ? images : ['/images/products/floral-dress.jpg'],
      variants: productVariants,
      rating: 5.0,
      reviewCount: 1,
      isCodAvailable: true,
      washCare: 'Gentle cold wash. Line dry in shade.',
      isNewArrival: true,
    };

    const created = await productRepo.createProduct(newProduct);

    return NextResponse.json({
      success: true,
      product: created,
      message: 'Product created successfully with sizes & offer percentage',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, inStock, ...updates } = body;

    if (!productId) {
      return NextResponse.json({ success: false, message: 'productId is required' }, { status: 400 });
    }

    const productRepo = new MockProductRepository();

    if (typeof inStock === 'boolean') {
      const updated = await productRepo.toggleStock(productId, inStock);
      return NextResponse.json({ success: true, product: updated, message: 'Stock updated' });
    }

    const cleanUpdates: any = {};
    if (typeof updates.sellingPrice === 'number' || typeof updates.sellingPrice === 'string') {
      cleanUpdates.sellingPrice = Number(updates.sellingPrice);
    }
    if (typeof updates.mrp === 'number' || typeof updates.mrp === 'string') {
      cleanUpdates.mrp = Number(updates.mrp);
    }
    if (cleanUpdates.mrp && cleanUpdates.sellingPrice) {
      cleanUpdates.offerPercentage =
        cleanUpdates.mrp > cleanUpdates.sellingPrice
          ? Math.round(((cleanUpdates.mrp - cleanUpdates.sellingPrice) / cleanUpdates.mrp) * 100)
          : 0;
    }
    if (typeof updates.offerPercentage === 'number') {
      cleanUpdates.offerPercentage = updates.offerPercentage;
    }
    if (updates.title) cleanUpdates.title = updates.title;
    if (updates.fabric) cleanUpdates.fabric = updates.fabric;
    if (updates.description) cleanUpdates.description = updates.description;
    if (updates.category) cleanUpdates.category = updates.category;
    if (updates.images && Array.isArray(updates.images)) cleanUpdates.images = updates.images;
    if (updates.variants && Array.isArray(updates.variants)) {
      cleanUpdates.variants = updates.variants;
    }
    if (updates.sizeChartType) cleanUpdates.sizeChartType = updates.sizeChartType;
    if (updates.sizeChartImage !== undefined) cleanUpdates.sizeChartImage = updates.sizeChartImage;
    if (updates.sizeNotes !== undefined) cleanUpdates.sizeNotes = updates.sizeNotes;
    if (updates.deliveryFeeType) cleanUpdates.deliveryFeeType = updates.deliveryFeeType;
    if (updates.customDeliveryFee !== undefined) cleanUpdates.customDeliveryFee = Number(updates.customDeliveryFee);

    const updated = await productRepo.updateProduct(productId, cleanUpdates);

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated, message: 'Product updated successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, message: 'productId is required' }, { status: 400 });
    }

    const productRepo = new MockProductRepository();
    const deleted = await productRepo.deleteProduct(productId);

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
