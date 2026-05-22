import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { isAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = db.select().from(orders);
    
    if (status && status !== 'all') {
      query = query.where(sql`${orders.status} = ${status}`) as typeof query;
    }

    const allOrders = await query
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(limit)
      .offset(offset);

    // Count total
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);

    return NextResponse.json({
      orders: allOrders,
      total: Number(countResult[0]?.count ?? 0),
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Gagal mengambil pesanan' }, { status: 500 });
  }
}
