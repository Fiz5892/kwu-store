import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { siteConfig } from '@/lib/db/schema';

export async function GET() {
  try {
    const configs = await db.select().from(siteConfig).limit(1);
    
    if (configs.length === 0) {
      // Fallback to env vars
      return NextResponse.json({
        config: {
          id: 0,
          storeName: process.env.NEXT_PUBLIC_STORE_NAME || 'Toko Kami',
          storeTagline: 'Belanja mudah dan nyaman',
          logoUrl: null,
          whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '628000000000',
          aboutTitle: 'Tentang Kami',
          aboutText: 'Selamat datang di toko kami.',
          aboutImageUrl: null,
          address: null,
          email: null,
          instagram: null,
          facebook: null,
          operationalHours: null,
          createdAt: new Date(),
        },
      });
    }

    const configData = configs[0];
    if (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
      configData.whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    }

    return NextResponse.json({ config: configData });
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil konfigurasi' },
      { status: 500 }
    );
  }
}
