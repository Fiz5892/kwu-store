'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Order } from '@/types';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'confirmed', label: 'Dikonfirmasi', color: 'bg-blue-100 text-blue-700' },
  { value: 'processing', label: 'Diproses', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'shipped', label: 'Dikirim', color: 'bg-purple-100 text-purple-700' },
  { value: 'done', label: 'Selesai', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'Semua' },
  ...STATUS_OPTIONS,
];

export default function AdminPesananPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin-token') : null;

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (filter !== 'all') params.set('status', filter);

      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, [filter]);

  const updateStatus = async (orderId: number, status: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      }
    } catch (error) {
      console.error('Error updating:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusLabel = (status: string | null) => {
    return STATUS_OPTIONS.find((s) => s.value === status)?.label || status || '-';
  };

  const getStatusVariant = (status: string | null): 'default' | 'success' | 'warning' | 'destructive' => {
    switch (status) {
      case 'done': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama / no. pesanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#A1BC99] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#A1BC99] transition-colors"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
            Tidak ada pesanan ditemukan
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0 text-left">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{order.customerName}</p>
                    <p className="text-xs text-gray-500">
                      {order.orderNumber} •{' '}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge variant={getStatusVariant(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                  <span className="font-medium text-gray-700 text-sm hidden sm:inline">
                    {formatPrice(parseFloat(order.total))}
                  </span>
                  {expandedId === order.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Detail */}
              {expandedId === order.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Nama</p>
                      <p className="font-medium text-gray-800">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">No. WhatsApp</p>
                      <a
                        href={`https://wa.me/${order.customerPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#A1BC99] hover:text-[#778873]"
                      >
                        {order.customerPhone}
                      </a>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-500">Alamat</p>
                      <p className="font-medium text-gray-800">{order.customerAddress}</p>
                    </div>
                    {order.customerNote && (
                      <div className="sm:col-span-2">
                        <p className="text-gray-500">Catatan</p>
                        <p className="font-medium text-gray-800 italic">{order.customerNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Item Pesanan</p>
                    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between px-3 py-2 text-sm">
                          <span className="text-gray-700">{item.name} x{item.quantity}</span>
                          <span className="font-medium text-gray-800">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between px-3 py-2 text-sm font-semibold text-gray-800">
                        <span>Total</span>
                        <span>{formatPrice(parseFloat(order.total))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Ubah Status</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((status) => (
                        <button
                          key={status.value}
                          disabled={updatingId === order.id || order.status === status.value}
                          onClick={() => updateStatus(order.id, status.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                            order.status === status.value
                              ? status.color + ' ring-2 ring-offset-1 ring-current'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {updatingId === order.id ? '...' : status.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
