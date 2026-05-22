'use client';

import { useEffect, useState } from 'react';
import ProductCarousel from './ProductCarousel';
import { ProductGridSkeleton } from '@/components/ui/LoadingSpinner';
import type { Product } from '@/types';

interface RecommendedSectionProps {
  title?: string;
  limit?: number;
  excludeId?: number;
}

export default function RecommendedSection({
  title = '🔥 Terlaris',
  limit = 8,
  excludeId,
}: RecommendedSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (excludeId) params.set('exclude', excludeId.toString());
        const res = await fetch(`/api/products/recommended?${params}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching recommended:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [limit, excludeId]);

  if (loading) {
    return (
      <section className="py-6">
        <h2 className="text-xl font-bold text-[#778873] mb-4 font-heading">{title}</h2>
        <ProductGridSkeleton count={4} />
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-6">
      <h2 className="text-xl font-bold text-[#778873] mb-4 font-heading">{title}</h2>
      <ProductCarousel products={products} showOrderCount />
    </section>
  );
}
