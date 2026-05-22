'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const items = useCartStore((s) => s.items);
  const cartVersion = useCartStore((s) => s._cartVersion);
  const prevVersionRef = useRef(cartVersion);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hitung total items secara derived (reaktif)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Animasi bounce saat cartVersion berubah
  useEffect(() => {
    if (mounted && cartVersion > prevVersionRef.current) {
      setBouncing(true);
      const timer = setTimeout(() => setBouncing(false), 500);
      prevVersionRef.current = cartVersion;
      return () => clearTimeout(timer);
    }
    prevVersionRef.current = cartVersion;
  }, [cartVersion, mounted]);

  // Sembunyikan di halaman admin
  if (pathname.startsWith('/admin')) return null;

  const showBack = pathname !== '/beranda' && pathname !== '/';
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'KWU STORE';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#778873] text-white h-14">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => window.history.back()}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-200 md:hidden cursor-pointer"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Link href="/beranda" className="flex items-center gap-2">
            <span className="text-lg font-bold font-heading tracking-tight">
              {storeName}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/beranda" 
            className={`text-sm font-medium transition-colors duration-200 hover:text-[#D3DC86] ${pathname === '/beranda' ? 'text-[#D3DC86]' : 'text-white/80'}`}
          >
            Beranda
          </Link>
          <Link 
            href="/produk" 
            className={`text-sm font-medium transition-colors duration-200 hover:text-[#D3DC86] ${pathname === '/produk' || pathname.startsWith('/produk/') ? 'text-[#D3DC86]' : 'text-white/80'}`}
          >
            Produk
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-medium transition-colors duration-200 hover:text-[#D3DC86] ${pathname === '/about' ? 'text-[#D3DC86]' : 'text-white/80'}`}
          >
            Tentang
          </Link>
          <Link 
            href="/profile" 
            className={`text-sm font-medium transition-colors duration-200 hover:text-[#D3DC86] ${pathname === '/profile' ? 'text-[#D3DC86]' : 'text-white/80'}`}
          >
            Profil
          </Link>
        </div>

        <Link
          href="/keranjang"
          className={`relative p-2 hover:bg-white/10 rounded-lg transition-all duration-200 ${bouncing ? 'animate-cart-bounce' : ''}`}
          aria-label="Keranjang"
        >
          <ShoppingCart className="w-5 h-5" />
          {mounted && itemCount > 0 && (
            <span
              className={`absolute -top-0.5 -right-0.5 bg-[#D3DC86] text-[#778873] text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 transition-transform duration-300 ${bouncing ? 'scale-125' : 'scale-100'}`}
            >
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
