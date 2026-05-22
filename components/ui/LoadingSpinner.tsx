import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-[#D3DC86] border-t-[#A1BC99]',
          {
            'h-5 w-5': size === 'sm',
            'h-8 w-8': size === 'md',
            'h-12 w-12': size === 'lg',
          }
        )}
      />
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border-2 border-[#D3DC86] overflow-hidden animate-pulse">
      <div className="aspect-square bg-[#D3DC86]/30" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-[#D3DC86]/30 rounded w-3/4" />
        <div className="h-4 bg-[#D3DC86]/30 rounded w-1/2" />
        <div className="h-9 bg-[#D3DC86]/30 rounded-lg w-full mt-3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
