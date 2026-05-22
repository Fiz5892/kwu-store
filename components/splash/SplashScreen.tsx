'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Cek apakah sudah pernah visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      router.replace('/beranda');
      return;
    }

    // Set visited flag
    localStorage.setItem('hasVisited', 'true');

    // Auto redirect setelah 2.5 detik
    const timer = setTimeout(() => {
      setShow(false);
      router.replace('/beranda');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#EFF3E0] flex flex-col items-center justify-center">
      {/* Logo / Store Name */}
      <div className="animate-splash-in">
        <h1 className="text-5xl md:text-6xl font-bold text-[#778873] font-heading tracking-tight">
          Toko Hijau
        </h1>
      </div>

      {/* Tagline */}
      <p className="mt-3 text-lg text-[#A1BC99] font-body animate-splash-fade">
        Belanja mudah dan nyaman
      </p>

      {/* Loading dots */}
      <div className="mt-12 flex gap-2">
        <span className="w-2.5 h-2.5 bg-[#A1BC99] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2.5 h-2.5 bg-[#A1BC99] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2.5 h-2.5 bg-[#A1BC99] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
