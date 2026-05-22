'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import type { LocalOrder } from '@/types';

export default function OrderHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedOrders = JSON.parse(localStorage.getItem('order-history') || '[]');
    setOrders(savedOrders);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge variant="success">Dikonfirmasi</Badge>;
      case 'done': return <Badge variant="success">Selesai</Badge>;
      default: return <Badge variant="warning">Menunggu</Badge>;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-[#D3DC86]/30 rounded w-1/3" />
            <div className="h-48 bg-[#D3DC86]/30 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#778873] border-2 border-[#D3DC86] hover:bg-[#EFF3E0] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-[#778873] font-heading flex items-center gap-2">
            <Package className="w-6 h-6" />
            Semua Riwayat Pesanan
          </h1>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-[#D3DC86] mx-auto mb-4" />
              <p className="text-[#778873] font-medium">Belum ada pesanan</p>
              <p className="text-sm text-[#A1BC99] mt-1">
                Ayo mulai belanja sekarang!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="border-2 border-[#D3DC86] rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.orderNumber ? null : order.orderNumber
                      )
                    }
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[#EFF3E0] transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="font-mono font-medium text-[#778873]">
                          {order.orderNumber}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#778873]">
                        <div className="flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-[#A1BC99]" />
                          <span>{order.items.length} item</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D3DC86]" />
                        <span className="font-bold">{formatPrice(order.total)}</span>
                      </div>
                      <p className="text-xs text-[#A1BC99] mt-2">
                        {new Date(order.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {expandedOrder === order.orderNumber ? (
                      <ChevronUp className="w-5 h-5 text-[#A1BC99] flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#A1BC99] flex-shrink-0 ml-4" />
                    )}
                  </button>

                  {expandedOrder === order.orderNumber && (
                    <div className="border-t-2 border-[#D3DC86] p-4 bg-[#EFF3E0]/30">
                      <h4 className="text-sm font-semibold text-[#778873] mb-3">
                        Detail Item
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-start gap-4 text-sm"
                          >
                            <div className="flex-1">
                              <p className="text-[#778873] font-medium leading-tight">
                                {item.name}
                              </p>
                              <p className="text-[#A1BC99] text-xs mt-0.5">
                                {item.quantity} x {formatPrice(item.price)}
                              </p>
                            </div>
                            <span className="font-semibold text-[#778873]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-[#D3DC86]/50 flex justify-between items-center">
                        <span className="text-sm font-semibold text-[#778873]">
                          Total Belanja
                        </span>
                        <span className="text-lg font-bold text-[#778873]">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
