'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  formattedTotalPrice: () => string;
  // Untuk trigger animasi badge
  _cartVersion: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      _cartVersion: 0,

      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                : i
            ),
            _cartVersion: get()._cartVersion + 1,
          });
        } else {
          set({
            items: [
              ...get().items,
              { ...item, id: `cart-${item.productId}-${Date.now()}`, quantity: 1 },
            ],
            _cartVersion: get()._cartVersion + 1,
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id), _cartVersion: get()._cartVersion + 1 });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id), _cartVersion: get()._cartVersion + 1 });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
          _cartVersion: get()._cartVersion + 1,
        });
      },

      clearCart: () => set({ items: [], _cartVersion: get()._cartVersion + 1 }),

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      formattedTotalPrice: () => {
        const total = get().totalPrice();
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(total);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
