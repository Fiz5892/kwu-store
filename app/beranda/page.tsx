'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductGrid from '@/components/product/ProductGrid';
import RecommendedSection from '@/components/product/RecommendedSection';
import { ProductGridSkeleton } from '@/components/ui/LoadingSpinner';
import type { Product, Category } from '@/types';

export default function BerandaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products?limit=12&sort=terbaru'),
          fetch('/api/categories'),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData.products || []);
        setCategories(catData.categories || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#778873] text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
          <div className="max-w-lg">
            <h1 className="text-3xl md:text-5xl font-bold font-heading mb-3 tracking-tight">
              KWU STORE
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-6">
              Belanja mudah dan nyaman. Temukan produk berkualitas dengan harga terbaik.
            </p>
            <Link href="/produk">
              <Button className="bg-[#D3DC86] text-[#778873] hover:bg-[#EFF3E0] font-semibold" size="lg">
                Lihat Produk
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        {/* Kategori Strip */}
        {categories.length > 0 && (
          <section className="py-6">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              <Link
                href="/produk"
                className="flex-shrink-0 px-4 py-2 rounded-full bg-[#D3DC86] text-[#778873] text-sm font-medium border-2 border-[#D3DC86] hover:bg-[#A1BC99] hover:text-white hover:border-[#A1BC99] transition-colors duration-200"
              >
                Semua
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produk?category=${cat.slug}`}
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-white text-[#778873] text-sm font-medium border-2 border-[#D3DC86] hover:bg-[#D3DC86] transition-colors duration-200"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Produk Terlaris */}
        <RecommendedSection title="TERLARIS" limit={8} />

        {/* Semua Produk */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#778873] font-heading">Semua Produk</h2>
            <Link
              href="/produk"
              className="text-sm text-[#A1BC99] hover:text-[#778873] flex items-center gap-1 transition-colors duration-200"
            >
              Lihat Semua
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <ProductGrid products={products.slice(0, 12)} />
          )}
        </section>
      </div>
    </div>
  );
}
