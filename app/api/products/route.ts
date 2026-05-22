import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories } from '@/lib/db/schema';
import { eq, ilike, desc, asc, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'terbaru';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const conditions = [eq(products.isActive, true)];

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }

    if (category) {
      const cat = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1);
      if (cat.length > 0) {
        conditions.push(eq(products.categoryId, cat[0].id));
      }
    }

    let orderBy;
    switch (sort) {
      case 'terlaris':
        orderBy = desc(products.orderCount);
        break;
      case 'harga_naik':
        orderBy = asc(products.price);
        break;
      case 'harga_turun':
        orderBy = desc(products.price);
        break;
      case 'terbaru':
      default:
        orderBy = desc(products.createdAt);
        break;
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    const productList = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);

    return NextResponse.json({
      products: productList,
      total: Number(countResult[0].count),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil produk' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProduct = await db.insert(products).values(body).returning();
    return NextResponse.json({ product: newProduct[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Gagal membuat produk' },
      { status: 500 }
    );
  }
}
