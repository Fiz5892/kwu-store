'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { ShoppingBag } from 'lucide-react';

export default function CartSummary() {
  const totalPrice = useCartStore((s) => s.totalPrice);
  const totalItems = useCartStore((s) => s.totalItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4 space-y-3 animate-pulse">
        <div className="h-6 bg-[#D3DC86]/30 rounded w-1/2"></div>
        <div className="h-20 bg-[#D3DC86]/30 rounded w-full"></div>
        <div className="h-10 bg-[#D3DC86]/30 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4 space-y-3">
      <h3 className="font-semibold text-[#778873] font-heading">Ringkasan Pesanan</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-[#778873]">
          <span>Subtotal ({totalItems()} item)</span>
          <span className="font-medium">{formatPrice(totalPrice())}</span>
        </div>
        <div className="border-t border-[#D3DC86] pt-2">
          <p className="text-xs text-[#A1BC99] italic">
            * Ongkos kirim akan dikonfirmasi via WhatsApp
          </p>
        </div>
        <div className="flex justify-between text-[#778873] font-semibold text-base border-t border-[#D3DC86] pt-2">
          <span>Total</span>
          <span>{formatPrice(totalPrice())}</span>
        </div>
      </div>

      <Link href="/checkout" className="block">
        <Button className="w-full" size="lg">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Lanjut ke Checkout
        </Button>
      </Link>
    </div>
  );
}
