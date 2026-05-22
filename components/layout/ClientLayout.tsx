'use client';

import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <main className={isAdmin ? 'flex-1' : 'flex-1 pt-14 pb-24 md:pb-8'}>
      {children}
    </main>
  );
}
