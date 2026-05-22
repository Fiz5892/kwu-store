'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductCarouselProps {
  products: Product[];
  showOrderCount?: boolean;
}

export default function ProductCarousel({ products, showOrderCount = true }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 260;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative group">
      {/* Scroll Buttons - Desktop */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 bg-white border-2 border-[#D3DC86] rounded-full items-center justify-center text-[#778873] hover:bg-[#EFF3E0] transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Scroll kiri"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 bg-white border-2 border-[#D3DC86] rounded-full items-center justify-center text-[#778873] hover:bg-[#EFF3E0] transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Scroll kanan"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[160px] md:w-[220px] snap-start"
          >
            <ProductCard product={product} showOrderCount={showOrderCount} />
          </div>
        ))}
      </div>
    </div>
  );
}
