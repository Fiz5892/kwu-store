import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OrderItem } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderNumber(): string {
  return `ORD-${Date.now()}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

interface WAOrderData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote?: string;
  items: OrderItem[];
  subtotal: number;
  orderNumber: string;
}

export function generateWAMessage(order: WAOrderData): string {
  const itemLines = order.items
    .map(
      (item) =>
        `${item.name} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    )
    .join('\n');

  let message = `Halo, saya ingin memesan:\n\n${itemLines}\n\nSubtotal: ${formatPrice(order.subtotal)}\n\nData Pengiriman:\nNama: ${order.customerName}\nWA: ${order.customerPhone}\nAlamat: ${order.customerAddress}`;

  if (order.customerNote) {
    message += `\n\nCatatan: ${order.customerNote}`;
  }

  message += `\n\nNomor Order: ${order.orderNumber}`;

  return message;
}
