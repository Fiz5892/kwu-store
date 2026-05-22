'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import EmptyState from '@/components/ui/EmptyState';
import { ProductGridSkeleton } from '@/components/ui/LoadingSpinner';
import type { Product, Category } from '@/types';

const sortOptions = [
  { value: 'terlaris', label: 'Terlaris' },
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'harga_naik', label: 'Harga Naik' },
  { value: 'harga_turun', label: 'Harga Turun' },
];

function ProdukContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sort, setSort] = useState('terlaris');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (activeCategory) params.set('category', activeCategory);
      if (sort) params.set('sort', sort);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [search, activeCategory, sort]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [fetchProducts]);

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-[#778873] font-heading mb-6">Produk Kami</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#A1BC99]" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-[#D3DC86] bg-white text-[#778873] placeholder:text-[#A1BC99]/60 focus:outline-none focus:border-[#A1BC99] transition-colors duration-200"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
          <button
            onClick={() => setActiveCategory('')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors duration-200 cursor-pointer ${
              activeCategory === ''
                ? 'bg-[#D3DC86] border-[#D3DC86] text-[#778873]'
                : 'bg-white border-[#D3DC86] text-[#778873] hover:bg-[#D3DC86]'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors duration-200 cursor-pointer ${
                activeCategory === cat.slug
                  ? 'bg-[#D3DC86] border-[#D3DC86] text-[#778873]'
                  : 'bg-white border-[#D3DC86] text-[#778873] hover:bg-[#D3DC86]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal className="w-4 h-4 text-[#A1BC99]" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border-2 border-[#D3DC86] rounded-lg px-3 py-1.5 bg-white text-[#778873] focus:outline-none focus:border-[#A1BC99] cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <EmptyState
            title="Produk tidak ditemukan"
            description="Coba ubah kata kunci pencarian atau filter kategori"
            actionLabel="Reset Filter"
            actionHref="/produk"
          />
        ) : (
          <ProductGrid products={products} showOrderCount />
        )}
      </div>
    </div>
  );
}

export default function ProdukPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-6"><ProductGridSkeleton count={8} /></div>}>
      <ProdukContent />
    </Suspense>
  );
}
