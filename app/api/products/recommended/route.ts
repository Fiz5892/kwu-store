import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { desc, eq, ne, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');
    const exclude = searchParams.get('exclude');

    const conditions = [eq(products.isActive, true)];

    if (exclude) {
      conditions.push(ne(products.id, parseInt(exclude)));
    }

    const recommended = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.orderCount))
      .limit(limit);

    return NextResponse.json({ products: recommended });
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil produk rekomendasi' },
      { status: 500 }
    );
  }
}
