import { pgTable, serial, text, integer, decimal, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import type { OrderItem } from '@/types';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  comparePrice: decimal('compare_price', { precision: 12, scale: 2 }),
  categoryId: integer('category_id').references(() => categories.id),
  images: jsonb('images').$type<string[]>().default([]),
  stock: integer('stock').default(0),
  orderCount: integer('order_count').default(0),
  isActive: boolean('is_active').default(true),
  weight: integer('weight'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerAddress: text('customer_address').notNull(),
  customerNote: text('customer_note'),
  items: jsonb('items').$type<OrderItem[]>().notNull(),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const siteConfig = pgTable('site_config', {
  id: serial('id').primaryKey(),
  storeName: text('store_name').notNull().default('Toko Kami'),
  storeTagline: text('store_tagline'),
  logoUrl: text('logo_url'),
  whatsappNumber: text('whatsapp_number').notNull(),
  aboutTitle: text('about_title'),
  aboutText: text('about_text'),
  aboutImageUrl: text('about_image_url'),
  address: text('address'),
  email: text('email'),
  instagram: text('instagram'),
  facebook: text('facebook'),
  operationalHours: text('operational_hours'),
  createdAt: timestamp('created_at').defaultNow(),
});
