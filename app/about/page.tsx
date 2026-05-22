'use client';

import { useEffect, useState } from 'react';
import { MapPin, Mail, Clock, Globe, ExternalLink } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { SiteConfig } from '@/types';

export default function AboutPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/site-config');
        const data = await res.json();
        setConfig(data.config);
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#A1BC99]">Gagal memuat informasi toko</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#778873] text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">
            {config.aboutTitle || 'Tentang Kami'}
          </h1>
          <p className="text-white/70 text-sm">
            {config.storeName}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* About Text */}
        <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-6">
          <p className="text-[#778873] leading-relaxed whitespace-pre-line">
            {config.aboutText || 'Selamat datang di toko kami. Kami menyediakan berbagai produk berkualitas dengan harga terjangkau.'}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.address && (
            <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D3DC86]/30 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#778873]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#778873] mb-1">Alamat</h3>
                <p className="text-sm text-[#778873]/70">{config.address}</p>
              </div>
            </div>
          )}

          {config.email && (
            <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D3DC86]/30 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#778873]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#778873] mb-1">Email</h3>
                <p className="text-sm text-[#778873]/70">{config.email}</p>
              </div>
            </div>
          )}

          {config.operationalHours && (
            <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D3DC86]/30 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#778873]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#778873] mb-1">Jam Operasional</h3>
                <p className="text-sm text-[#778873]/70">{config.operationalHours}</p>
              </div>
            </div>
          )}

          {config.whatsappNumber && (
            <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D3DC86]/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#778873]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#778873] mb-1">WhatsApp</h3>
                <a
                  href={`https://wa.me/${config.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#A1BC99] hover:text-[#778873] transition-colors"
                >
                  +{config.whatsappNumber}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Social Media */}
        {(config.instagram || config.facebook) && (
          <div className="bg-white rounded-xl border-2 border-[#D3DC86] p-4">
            <h3 className="font-semibold text-[#778873] font-heading mb-3">Media Sosial</h3>
            <div className="flex gap-3">
              {config.instagram && (
                <a
                  href={`https://instagram.com/${config.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#D3DC86] text-[#778873] hover:bg-[#EFF3E0] transition-colors duration-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">@{config.instagram}</span>
                </a>
              )}
              {config.facebook && (
                <a
                  href={`https://facebook.com/${config.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#D3DC86] text-[#778873] hover:bg-[#EFF3E0] transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">{config.facebook}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        <div className="bg-white rounded-xl border-2 border-[#D3DC86] overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold text-[#778873] font-heading mb-2">Lokasi Kami</h3>
          </div>
          <div className="w-full h-64 bg-[#D3DC86]/20 flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4249.865724414436!2d112.61367700000001!3d-7.952465000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78827f2d620975%3A0xf19b7459bbee5ed5!2sUniversitas%20Brawijaya!5e1!3m2!1sid!2sid!4v1779449009182!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Toko"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
