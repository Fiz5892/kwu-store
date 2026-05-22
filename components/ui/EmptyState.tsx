import { ShoppingBag } from 'lucide-react';
import Button from './Button';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionLabel = 'Mulai Belanja',
  actionHref = '/produk',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-[#D3DC86]/30 flex items-center justify-center mb-4">
        {icon || <ShoppingBag className="w-10 h-10 text-[#A1BC99]" />}
      </div>
      <h3 className="text-lg font-semibold text-[#778873] mb-2 font-heading">
        {title}
      </h3>
      <p className="text-sm text-[#A1BC99] mb-6 max-w-xs">{description}</p>
      {actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
