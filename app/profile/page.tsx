'use client';

import { useEffect, useState } from 'react';
import { Save, ChevronDown, ChevronUp, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useProfileStore } from '@/store/profileStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import type { LocalOrder } from '@/types';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const profile = useProfileStore();
  const clearCart = useCartStore((s) => s.clearCart);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    setMounted(true);
    const savedOrders = JSON.parse(localStorage.getItem('order-history') || '[]');
    setOrders(savedOrders);
  }, []);

  useEffect(() => {
    if (mounted) {
      setForm({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });
    }
  }, [mounted, profile.name, profile.phone, profile.address]);

  const handleSave = () => {
    profile.setProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };



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
            <div className="h-20 w-20 rounded-full bg-[#D3DC86]/30 mx-auto" />
            <div className="h-8 bg-[#D3DC86]/30 rounded w-1/3 mx-auto" />
            <div className="h-48 bg-[#D3DC86]/30 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#D3DC86] flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-[#778873]">
              {profile.avatarInitials}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#778873] font-heading">
            {profile.name || 'Pengguna Baru'}
          </h1>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4 space-y-4">
          <h2 className="font-semibold text-[#778873] font-heading">Profil Saya</h2>

          <Input
            id="profileName"
            label="Nama Lengkap"
            placeholder="Masukkan nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            id="profilePhone"
            label="Nomor WhatsApp"
            placeholder="628xxxxxxxxxx"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <div className="w-full">
            <label htmlFor="profileAddress" className="block text-sm font-medium text-[#778873] mb-1.5">
              Alamat
            </label>
            <textarea
              id="profileAddress"
              placeholder="Masukkan alamat"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-[#D3DC86] bg-white text-[#778873] placeholder:text-[#A1BC99]/60 focus:outline-none focus:border-[#A1BC99] transition-colors duration-200 resize-none"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            {saved ? (
              <><Save className="w-4 h-4 mr-2" /> Tersimpan!</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Simpan Profil</>
            )}
          </Button>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4">
          <h2 className="font-semibold text-[#778873] font-heading mb-3 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Riwayat Pesanan
          </h2>

          {orders.length === 0 ? (
            <p className="text-sm text-[#A1BC99] text-center py-4">
              Belum ada pesanan
            </p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 3).map((order) => (
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
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-[#EFF3E0] transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-[#A1BC99]">
                          {order.orderNumber}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-[#778873]">
                        <span>{order.items.length} item</span>
                        <span className="font-medium">{formatPrice(order.total)}</span>
                      </div>
                      <p className="text-xs text-[#A1BC99] mt-0.5">
                        {new Date(order.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {expandedOrder === order.orderNumber ? (
                      <ChevronUp className="w-4 h-4 text-[#A1BC99] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#A1BC99] flex-shrink-0" />
                    )}
                  </button>

                  {expandedOrder === order.orderNumber && (
                    <div className="border-t border-[#D3DC86] p-3 bg-[#EFF3E0]/50">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm text-[#778873] py-1"
                        >
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {orders.length > 3 && (
                <Link
                  href="/profile/pesanan"
                  className="mt-4 flex items-center justify-center w-full py-2.5 text-sm font-medium text-[#778873] bg-[#EFF3E0] hover:bg-[#D3DC86] rounded-lg transition-colors duration-200"
                >
                  Lihat Semua Pesanan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
