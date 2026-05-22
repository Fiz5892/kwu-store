'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, ShoppingCart, User, Info } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/beranda', icon: Home, label: 'Beranda' },
  { href: '/produk', icon: Grid3X3, label: 'Produk' },
  { href: '/keranjang', icon: ShoppingCart, label: 'Keranjang', showBadge: true },
  { href: '/profile', icon: User, label: 'Profil' },
  { href: '/about', icon: Info, label: 'Tentang' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const items = useCartStore((s) => s.items);
  const cartVersion = useCartStore((s) => s._cartVersion);
  const prevVersionRef = useRef(cartVersion);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Sembunyikan di splash screen dan halaman admin
  if (pathname === '/' || pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#778873] md:hidden border-t border-[#A1BC99]/30">
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-full py-1 rounded-lg transition-colors duration-200 relative',
                isActive
                  ? 'bg-[#D3DC86] text-[#778873]'
                  : 'text-white/70 hover:text-white'
              )}
            >
              <div className={`relative ${tab.showBadge && bouncing ? 'animate-cart-bounce' : ''}`}>
                <Icon className="w-5 h-5" />
                {tab.showBadge && mounted && itemCount > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5 transition-transform duration-300 ${bouncing ? 'scale-125' : 'scale-100'}`}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
