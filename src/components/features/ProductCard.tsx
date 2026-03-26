import * as React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';

interface Product {
  id: string;
  name: string;
  department: string;
  price: number;
  imageUrl?: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <GlassCard
      variant="light"
      className="flex flex-col h-full hover:border-indigo-500/50 transition-colors group"
    >
      {/* Mock Image Area */}
      <div className="h-48 w-full bg-glass-dark border-b border-glass-border relative overflow-hidden flex items-center justify-center">
        <span className="text-foreground/30 text-sm">Image Placeholder</span>

        {/* Department Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-glass-light backdrop-blur-md border border-glass-border rounded-full text-indigo-600 dark:text-indigo-300">
          {product.department}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-lg line-clamp-2 leading-tight mb-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">${product.price.toFixed(2)}</span>
          <GlassButton variant="primary" className="px-3 py-1.5 text-sm">
            Add
          </GlassButton>
        </div>
      </div>
    </GlassCard>
  );
}

export function ProductCardSkeleton() {
  return (
    <GlassCard variant="light" className="flex flex-col h-full animate-pulse">
      <div className="h-48 w-full bg-glass-dark border-b border-glass-border" />
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="h-6 bg-glass-dark rounded-md w-3/4" />
        <div className="h-4 bg-glass-dark rounded-md w-1/2" />

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="h-8 w-16 bg-glass-dark rounded-md" />
          <div className="h-8 w-16 bg-glass-dark rounded-md" />
        </div>
      </div>
    </GlassCard>
  );
}
