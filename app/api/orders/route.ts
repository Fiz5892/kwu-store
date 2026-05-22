import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, products } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerAddress, customerNote, items, subtotal, total } = body;

    if (!customerName || !customerPhone || !customerAddress || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Data pesanan tidak lengkap' },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    const newOrder = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName,
        customerPhone,
        customerAddress,
        customerNote: customerNote || null,
        items,
        subtotal: subtotal.toString(),
        total: total.toString(),
        status: 'pending',
      })
      .returning();

    // Increment order_count for each product
    for (const item of items) {
      await db
        .update(products)
        .set({
          orderCount: sql`${products.orderCount} + ${item.quantity}`,
        })
        .where(eq(products.id, item.productId));
    }

    return NextResponse.json(
      { order: newOrder[0], orderNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Gagal membuat pesanan' },
      { status: 500 }
    );
  }
}
