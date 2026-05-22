'use client';

import { useEffect, useState, useRef } from 'react';
import { Package, ShoppingCart, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';

interface DashboardData {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
  };
  ordersByStatus: { status: string | null; count: number }[];
  salesLast7Days: { date: string; total: number; count: number }[];
  topProducts: { id: number; name: string; orderCount: number | null; price: string; stock: number | null }[];
  recentOrders: {
    id: number;
    orderNumber: string;
    customerName: string;
    total: string;
    status: string | null;
    createdAt: string | null;
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('admin-token');
        const res = await fetch('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Draw chart
  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 70 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Fill last 7 days with 0 if no data
    const today = new Date();
    const days: { date: string; total: number; count: number; label: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const match = data.salesLast7Days.find((s) => s.date === dateStr);
      days.push({
        date: dateStr,
        total: match ? Number(match.total) : 0,
        count: match ? Number(match.count) : 0,
        label: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
      });
    }

    const maxVal = Math.max(...days.map((d) => d.total), 1);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y labels
      const val = maxVal - (maxVal / 4) * i;
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatPrice(val).replace('Rp', 'Rp '), padding.left - 8, y + 4);
    }

    // Bars
    const barWidth = Math.min(chartW / days.length * 0.6, 40);
    const gap = chartW / days.length;

    days.forEach((day, i) => {
      const x = padding.left + gap * i + gap / 2 - barWidth / 2;
      const barH = (day.total / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      // Bar gradient
      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
      gradient.addColorStop(0, '#A1BC99');
      gradient.addColorStop(1, '#D3DC86');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      ctx.fill();

      // X labels
      ctx.fillStyle = '#6B7280';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(day.label, padding.left + gap * i + gap / 2, height - padding.bottom + 18);
    });
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-gray-500">Gagal memuat data dashboard</p>;
  }

  const statCards = [
    {
      label: 'Total Produk',
      value: data.stats.totalProducts.toString(),
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Total Pesanan',
      value: data.stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      label: 'Total Pendapatan',
      value: formatPrice(data.stats.totalRevenue),
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
    },
    {
      label: 'Pesanan Pending',
      value: data.stats.pendingOrders.toString(),
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
      iconBg: 'bg-orange-100',
    },
  ];

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'confirmed': return 'Dikonfirmasi';
      case 'processing': return 'Diproses';
      case 'shipped': return 'Dikirim';
      case 'done': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status || '-';
    }
  };

  const getStatusVariant = (status: string | null): 'default' | 'success' | 'warning' | 'destructive' => {
    switch (status) {
      case 'done': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color.split(' ')[1]}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Penjualan 7 Hari Terakhir</h3>
        <div className="w-full h-64">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Produk Terlaris</h3>
          <div className="space-y-3">
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-gray-400">Belum ada data</p>
            ) : (
              data.topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#D3DC86] text-[#778873] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.orderCount ?? 0} terjual • Stok: {product.stock ?? 0}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-600 flex-shrink-0">
                    {formatPrice(parseFloat(product.price))}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Pesanan Terbaru</h3>
          <div className="space-y-3">
            {data.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400">Belum ada pesanan</p>
            ) : (
              data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.orderNumber} •{' '}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : '-'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <span className="text-sm font-medium text-gray-600">
                      {formatPrice(parseFloat(order.total))}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
