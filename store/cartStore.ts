'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  selectedItemIds: string[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleSelectItem: (id: string) => void;
  selectAllItems: (selectAll: boolean) => void;
  clearCart: () => void;
  clearSelectedItems: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  selectedTotalItems: () => number;
  selectedTotalPrice: () => number;
  formattedTotalPrice: () => string;
  // Untuk trigger animasi badge
  _cartVersion: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItemIds: [],
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
            selectedItemIds: !get().selectedItemIds.includes(existing.id) 
              ? [...get().selectedItemIds, existing.id] 
              : get().selectedItemIds,
            _cartVersion: get()._cartVersion + 1,
          });
        } else {
          const newId = `cart-${item.productId}-${Date.now()}`;
          set({
            items: [
              ...get().items,
              { ...item, id: newId, quantity: 1 },
            ],
            selectedItemIds: [...get().selectedItemIds, newId],
            _cartVersion: get()._cartVersion + 1,
          });
        }
      },

      removeItem: (id) => {
        set({ 
          items: get().items.filter((i) => i.id !== id), 
          selectedItemIds: get().selectedItemIds.filter((selectedId) => selectedId !== id),
          _cartVersion: get()._cartVersion + 1 
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ 
            items: get().items.filter((i) => i.id !== id), 
            selectedItemIds: get().selectedItemIds.filter((selectedId) => selectedId !== id),
            _cartVersion: get()._cartVersion + 1 
          });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
          _cartVersion: get()._cartVersion + 1,
        });
      },

      toggleSelectItem: (id) => {
        set({
          selectedItemIds: get().selectedItemIds.includes(id)
            ? get().selectedItemIds.filter((selectedId) => selectedId !== id)
            : [...get().selectedItemIds, id],
        });
      },

      selectAllItems: (selectAll) => {
        set({
          selectedItemIds: selectAll ? get().items.map((i) => i.id) : [],
        });
      },

      clearCart: () => set({ items: [], selectedItemIds: [], _cartVersion: get()._cartVersion + 1 }),

      clearSelectedItems: () => {
        const remainingItems = get().items.filter((i) => !get().selectedItemIds.includes(i.id));
        set({ items: remainingItems, selectedItemIds: [], _cartVersion: get()._cartVersion + 1 });
      },

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      selectedTotalItems: () => {
        return get().items
          .filter((i) => get().selectedItemIds.includes(i.id))
          .reduce((sum, item) => sum + item.quantity, 0);
      },

      selectedTotalPrice: () => {
        return get().items
          .filter((i) => get().selectedItemIds.includes(i.id))
          .reduce((sum, item) => sum + item.price * item.quantity, 0);
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
