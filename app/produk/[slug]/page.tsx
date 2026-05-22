'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart, ShoppingBag, Check, Share2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import RecommendedSection from '@/components/product/RecommendedSection';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) {
          router.push('/produk');
          return;
        }
        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/produk');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) return null;

  const price = parseFloat(product.price);
  const comparePrice = product.comparePrice ? parseFloat(product.comparePrice) : null;
  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const images = product.images && product.images.length > 0
    ? product.images
    : [`https://picsum.photos/seed/${product.id}/600/600`];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price,
        image: images[0],
        slug: product.slug,
        stock,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => router.push('/keranjang'), 300);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Cek ${product.name} di KWU Store!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Tautan disalin ke clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#D3DC86] bg-white">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">Stok Habis</Badge>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-200 cursor-pointer ${
                      selectedImage === idx ? 'border-[#A1BC99]' : 'border-[#D3DC86]'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <Badge className="mb-2">{product.orderCount ?? 0} terjual</Badge>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold text-[#778873] font-heading leading-tight">
                {product.name}
              </h1>
              <button
                onClick={handleShare}
                className="p-2 text-[#A1BC99] hover:bg-[#EFF3E0] hover:text-[#778873] rounded-full transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Bagikan Produk"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-[#778873]">
                {formatPrice(price)}
              </span>
              {comparePrice && comparePrice > price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-[#A1BC99]'}`}>
                {isOutOfStock ? 'Stok habis' : `Stok: ${stock}`}
              </span>
              {product.weight && (
                <span className="text-sm text-[#A1BC99]">• {product.weight}g</span>
              )}
            </div>



            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-[#778873]">Jumlah:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg border-2 border-[#D3DC86] flex items-center justify-center text-[#778873] hover:bg-[#EFF3E0] transition-colors duration-200 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="min-w-[32px] text-center font-medium text-[#778873]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={quantity >= stock}
                    className="w-8 h-8 rounded-lg border-2 border-[#D3DC86] flex items-center justify-center text-[#778873] hover:bg-[#EFF3E0] transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {added ? (
                  <><Check className="w-4 h-4 mr-2" />Ditambahkan!</>
                ) : (
                  <><ShoppingCart className="w-4 h-4 mr-2" />Tambah ke Keranjang</>
                )}
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Beli Sekarang
              </Button>
            </div>
          </div>
        </div>

        {/* Description Section (Full Width Below) */}
        <div className="mt-10 bg-white rounded-xl border-2 border-[#D3DC86] p-6">
          <h3 className="text-lg font-bold text-[#778873] font-heading mb-4">
            Deskripsi Produk
          </h3>
          <p className="text-[15px] text-[#778873]/90 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <RecommendedSection
            title="Produk Lainnya yang Populer"
            limit={6}
            excludeId={product.id}
          />
        </div>
      </div>
    </div>
  );
}
