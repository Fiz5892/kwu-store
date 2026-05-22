'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  showOrderCount?: boolean;
}

export default function ProductCard({ product, showOrderCount = false }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const price = parseFloat(product.price);
  const comparePrice = product.comparePrice ? parseFloat(product.comparePrice) : null;
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://picsum.photos/seed/' + product.id + '/400/400';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      name: product.name,
      price,
      image: mainImage,
      slug: product.slug,
      stock: product.stock ?? 0,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-[#D3DC86] overflow-hidden transition-all duration-200 hover:border-[#A1BC99] h-full flex flex-col group relative">
      <Link href={`/produk/${product.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">Lihat {product.name}</span>
      </Link>
      
      {/* Image */}
      <div className="relative aspect-square overflow-hidden z-10 pointer-events-none">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className={`object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? 'grayscale' : ''}`}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {showOrderCount && (product.orderCount ?? 0) > 0 && (
          <div className="absolute top-2 right-2">
            <Badge>{product.orderCount} terjual</Badge>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-3 py-1">Habis</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 z-10">
        <h3 className="text-sm font-medium text-[#778873] line-clamp-2 mb-1 flex-1 pointer-events-none">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3 pointer-events-none">
          <span className="text-[#778873] font-semibold text-sm">
            {formatPrice(price)}
          </span>
          {comparePrice && comparePrice > price && (
            <span className="text-gray-400 line-through text-xs">
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer relative z-20 ${
            added
              ? 'bg-[#D3DC86] text-[#778873]'
              : isOutOfStock
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#A1BC99] text-white hover:bg-[#778873]'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              Ditambahkan!
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              Tambah
            </>
          )}
        </button>
      </div>
    </div>
  );
}
