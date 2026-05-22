'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const pathname = usePathname();

  // Sembunyikan di halaman admin dan splash screen
  if (pathname === '/' || pathname.startsWith('/admin')) return null;

  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'KWU STORE';
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '628000000000';

  return (
    <footer className="bg-[#778873] text-white/90 pt-16 pb-24 md:pb-8 border-t-[8px] border-[#D3DC86]">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
        
        {/* Brand & About (Span 4) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#D3DC86] rounded-xl flex items-center justify-center rotate-3 shadow-lg">
              <span className="text-[#778873] font-bold text-xl font-heading">K</span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-white tracking-tight">
              {storeName}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-white/80 max-w-sm">
            Menyediakan produk kualitas terbaik untuk kebutuhan Anda sehari-hari. 
            Belanja lebih mudah, nyaman, dan aman dengan pembayaran langsung melalui WhatsApp.
          </p>
          <div className="pt-4 flex gap-3">
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D3DC86] hover:text-[#778873] transition-all duration-300 hover:-translate-y-1">
              <FontAwesomeIcon icon={faFacebookF} className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D3DC86] hover:text-[#778873] transition-all duration-300 hover:-translate-y-1">
              <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D3DC86] hover:text-[#778873] transition-all duration-300 hover:-translate-y-1">
              <FontAwesomeIcon icon={faYoutube} className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D3DC86] hover:text-[#778873] transition-all duration-300 hover:-translate-y-1">
              <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links (Span 3) */}
        <div className="md:col-span-3">
          <h3 className="text-lg font-semibold font-heading text-white mb-6 relative inline-block">
            Jelajahi
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#D3DC86] rounded-full"></span>
          </h3>
          <ul className="space-y-3">
            {[
              { label: 'Beranda', href: '/beranda' },
              { label: 'Katalog Produk', href: '/produk' },
              { label: 'Tentang Kami', href: '/about' },
              { label: 'Keranjang Belanja', href: '/keranjang' },
              { label: 'Profil Saya', href: '/profile' },
            ].map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className="text-sm text-white/70 hover:text-[#D3DC86] hover:translate-x-1 flex items-center transition-all duration-200 group"
                >
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info (Span 4) */}
        <div className="md:col-span-4">
          <h3 className="text-lg font-semibold font-heading text-white mb-6 relative inline-block">
            Hubungi Kami
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#D3DC86] rounded-full"></span>
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-white/80">
              <MapPin className="w-5 h-5 text-[#D3DC86] flex-shrink-0 mt-0.5" />
              <span>Gedung KWU, Universitas Negeri Malang, Jl. Semarang No. 5</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-white/80">
              <Phone className="w-5 h-5 text-[#D3DC86] flex-shrink-0" />
              <span>+{waNumber}</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-white/80">
              <Mail className="w-5 h-5 text-[#D3DC86] flex-shrink-0" />
              <span>hello@kwustore.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="mt-16 pt-6 border-t border-white/10 text-center px-6">
        <p className="text-xs text-white/60">
          &copy; {new Date().getFullYear()} {storeName}. All rights reserved. 
          <span className="hidden sm:inline"> | Designed with love for KWU.</span>
        </p>
      </div>
    </footer>
  );
}
