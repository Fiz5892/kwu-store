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
  const selectedItemIds = useCartStore((s) => s.selectedItemIds);
  const selectAllItems = useCartStore((s) => s.selectAllItems);
  
  const allSelected = items.length > 0 && selectedItemIds.length === items.length;

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
              <div className="bg-white rounded-xl border-2 border-gray-200 p-3 mb-2 flex items-center gap-3">
                <div 
                  onClick={() => selectAllItems(!allSelected)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                    allSelected 
                      ? 'bg-[#D3DC86] border-[#D3DC86] text-[#778873]' 
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {allSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span className="text-sm font-semibold text-[#778873] cursor-pointer select-none" onClick={() => selectAllItems(!allSelected)}>
                  Pilih Semua
                </span>
              </div>
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
