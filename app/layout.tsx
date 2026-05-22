import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import ClientLayout from '@/components/layout/ClientLayout';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Toko Hijau — Belanja Mudah dan Nyaman',
  description: 'Toko online terpercaya dengan berbagai produk berkualitas. Belanja mudah, checkout via WhatsApp.',
  keywords: ['toko online', 'belanja', 'e-commerce', 'toko hijau'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-body bg-[#EFF3E0] min-h-screen antialiased flex flex-col" suppressHydrationWarning>
        <Navbar />
        <ClientLayout>
          {children}
        </ClientLayout>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
