'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const selectedItemIds = useCartStore((s) => s.selectedItemIds);
  const toggleSelectItem = useCartStore((s) => s.toggleSelectItem);
  const isSelected = selectedItemIds.includes(item.id);

  return (
    <div className={`flex gap-3 bg-white rounded-xl border-2 p-3 transition-colors ${isSelected ? 'border-[#D3DC86] bg-[#EFF3E0]/20' : 'border-gray-200'}`}>
      {/* Checkbox */}
      <div className="flex items-center justify-center pt-8">
        <div 
          onClick={() => toggleSelectItem(item.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-[#D3DC86] border-[#D3DC86] text-[#778873]' 
              : 'border-gray-300 bg-white'
          }`}
        >
          {isSelected && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-[#778873] line-clamp-2 mb-1">
          {item.name}
        </h3>
        <p className="text-sm font-semibold text-[#778873]">
          {formatPrice(item.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 rounded-lg border-2 border-[#D3DC86] flex items-center justify-center text-[#778873] hover:bg-[#EFF3E0] transition-colors duration-200 cursor-pointer"
              aria-label="Kurangi"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-medium text-[#778873] min-w-[24px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-7 h-7 rounded-lg border-2 border-[#D3DC86] flex items-center justify-center text-[#778873] hover:bg-[#EFF3E0] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Tambah"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
