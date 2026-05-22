import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, products } from '@/lib/db/schema';
import { isAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';
import { sql, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return unauthorizedResponse();

  try {
    // Total produk aktif
    const productCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.isActive, true));

    // Total pesanan
    const orderCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);

    // Total pendapatan (hanya dari pesanan yang sudah dikonfirmasi ke atas)
    const totalRevenue = await db
      .select({ total: sql<number>`COALESCE(sum(${orders.total}::numeric), 0)` })
      .from(orders)
      .where(sql`${orders.status} NOT IN ('pending', 'cancelled')`);

    // Pesanan pending
    const pendingOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, 'pending'));

    // Pesanan per status
    const ordersByStatus = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .groupBy(orders.status);

    // Penjualan 7 hari terakhir (untuk grafik, abaikan pending dan cancelled)
    const salesLast7Days = await db
      .select({
        date: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
        total: sql<number>`COALESCE(sum(${orders.total}::numeric), 0)`,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(sql`${orders.createdAt} >= NOW() - INTERVAL '7 days' AND ${orders.status} NOT IN ('pending', 'cancelled')`)
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`);

    // Produk terlaris (top 5)
    const topProducts = await db
      .select({
        id: products.id,
        name: products.name,
        orderCount: products.orderCount,
        price: products.price,
        stock: products.stock,
      })
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(sql`${products.orderCount} DESC`)
      .limit(5);

    // Pesanan terbaru (5 terakhir)
    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(5);

    return NextResponse.json({
      stats: {
        totalProducts: Number(productCount[0]?.count ?? 0),
        totalOrders: Number(orderCount[0]?.count ?? 0),
        totalRevenue: Number(totalRevenue[0]?.total ?? 0),
        pendingOrders: Number(pendingOrders[0]?.count ?? 0),
      },
      ordersByStatus,
      salesLast7Days,
      topProducts,
      recentOrders,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data dashboard' }, { status: 500 });
  }
}
