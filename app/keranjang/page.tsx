'use client';

import { useEffect, useState } from 'react';
import CartItemComponent from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyState from '@/components/ui/EmptyState';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';

export default function KeranjangPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-[#778873] font-heading mb-6">Keranjang</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-[#D3DC86]/20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-[#778873] font-heading mb-6">Keranjang</h1>

        {items.length === 0 ? (
          <EmptyState
            title="Keranjang Kosong"
            description="Belum ada produk di keranjang kamu. Yuk mulai belanja!"
            actionLabel="Mulai Belanja"
            actionHref="/produk"
            icon={<ShoppingCart className="w-10 h-10 text-[#A1BC99]" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-3">
              {items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </div>

            {/* Summary */}
            <div className="md:col-span-1">
              <div className="md:sticky md:top-20">
                <CartSummary />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
