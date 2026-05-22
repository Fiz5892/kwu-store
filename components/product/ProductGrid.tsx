import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  showOrderCount?: boolean;
}

export default function ProductGrid({ products, showOrderCount = false }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showOrderCount={showOrderCount}
        />
      ))}
    </div>
  );
}
