'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useProfileStore } from '@/store/profileStore';
import { formatPrice, generateWAMessage, generateOrderNumber } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { LocalOrder } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allItems = useCartStore((s) => s.items);
  const selectedItemIds = useCartStore((s) => s.selectedItemIds);
  const items = allItems.filter(item => selectedItemIds.includes(item.id));
  const totalPrice = useCartStore((s) => s.selectedTotalPrice);
  const clearSelectedItems = useCartStore((s) => s.clearSelectedItems);

  const profile = useProfileStore();

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerNote: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill dari profile store
  useEffect(() => {
    if (mounted && profile.name) {
      setForm((prev) => ({
        ...prev,
        customerName: prev.customerName || profile.name,
        customerPhone: prev.customerPhone || profile.phone,
        customerAddress: prev.customerAddress || profile.address,
      }));
    }
  }, [mounted, profile.name, profile.phone, profile.address]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Nama harus diisi';
    if (!form.customerPhone.trim()) newErrors.customerPhone = 'Nomor WA harus diisi';
    if (!form.customerAddress.trim()) newErrors.customerAddress = 'Alamat harus diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || items.length === 0) return;

    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const subtotal = totalPrice();
      const orderNumber = generateOrderNumber();

      // POST ke API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerAddress: form.customerAddress,
          customerNote: form.customerNote || undefined,
          items: orderItems,
          subtotal,
          total: subtotal,
        }),
      });

      const data = await res.json();
      const finalOrderNumber = data.orderNumber || orderNumber;

      // Simpan ke localStorage order history
      const existingOrders = JSON.parse(localStorage.getItem('order-history') || '[]') as LocalOrder[];
      const newOrder: LocalOrder = {
        orderNumber: finalOrderNumber,
        date: new Date().toISOString(),
        items: orderItems,
        total: subtotal,
        status: 'pending',
        customerName: form.customerName,
      };
      localStorage.setItem('order-history', JSON.stringify([newOrder, ...existingOrders]));

      // Simpan profil
      profile.setProfile({
        name: form.customerName,
        phone: form.customerPhone,
        address: form.customerAddress,
      });

      // Generate WA message
      const waMessage = generateWAMessage({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerAddress: form.customerAddress,
        customerNote: form.customerNote,
        items: orderItems,
        subtotal,
        orderNumber: finalOrderNumber,
      });

      // Ambil WA number dari config, prioritas utama dari env
      let waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
      
      if (!waNumber) {
        try {
          const configRes = await fetch('/api/site-config');
          const configData = await configRes.json();
          if (configData.config?.whatsappNumber) {
            waNumber = configData.config.whatsappNumber;
          } else {
            waNumber = '628000000000';
          }
        } catch {
          // Pakai default
          waNumber = '628000000000';
        }
      }

      // Buka WhatsApp
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');

      // Clear selected items from cart
      clearSelectedItems();

      // Redirect ke beranda
      router.push('/beranda');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <EmptyState
            title="Tidak ada item"
            description="Keranjang kamu kosong. Tambahkan produk terlebih dahulu."
            actionLabel="Lihat Produk"
            actionHref="/produk"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-[#778873] font-heading mb-6">Detail Pesanan</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4 space-y-4">
            <h2 className="font-semibold text-[#778873] font-heading">Data Pengiriman</h2>

            <Input
              id="customerName"
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              error={errors.customerName}
            />

            <Input
              id="customerPhone"
              label="Nomor WhatsApp"
              placeholder="628xxxxxxxxxx"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              error={errors.customerPhone}
            />

            <div className="w-full">
              <label htmlFor="customerAddress" className="block text-sm font-medium text-[#778873] mb-1.5">
                Alamat Pengiriman
              </label>
              <textarea
                id="customerAddress"
                placeholder="Masukkan alamat lengkap"
                value={form.customerAddress}
                onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2.5 rounded-lg border-2 bg-white text-[#778873] placeholder:text-[#A1BC99]/60 focus:outline-none transition-colors duration-200 resize-none ${
                  errors.customerAddress ? 'border-red-400 focus:border-red-500' : 'border-[#D3DC86] focus:border-[#A1BC99]'
                }`}
              />
              {errors.customerAddress && <p className="mt-1 text-xs text-red-500">{errors.customerAddress}</p>}
            </div>

            <div className="w-full">
              <label htmlFor="customerNote" className="block text-sm font-medium text-[#778873] mb-1.5">
                Catatan untuk Toko <span className="text-[#A1BC99]">(opsional)</span>
              </label>
              <textarea
                id="customerNote"
                placeholder="Catatan tambahan..."
                value={form.customerNote}
                onChange={(e) => setForm({ ...form, customerNote: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-[#D3DC86] bg-white text-[#778873] placeholder:text-[#A1BC99]/60 focus:outline-none focus:border-[#A1BC99] transition-colors duration-200 resize-none"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4">
            <h2 className="font-semibold text-[#778873] font-heading mb-3">Ringkasan Pesanan</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-[#778873]">
                  <span className="truncate flex-1 mr-2">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-[#D3DC86] pt-2 mt-2 flex justify-between font-semibold text-[#778873]">
                <span>Total</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? (
              <><LoadingSpinner size="sm" className="mr-2" /> Memproses...</>
            ) : (
              <><Send className="w-4 h-4 mr-2" /> Pesan via WhatsApp</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
