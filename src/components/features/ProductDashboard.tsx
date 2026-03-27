'use client';

import * as React from 'react';
import { ProductCardSkeleton } from './ProductCard';
import { DepartmentSection } from './DepartmentSection';
import { GlassCard } from '@/components/ui/GlassCard';
import { Layers } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  department: string;
  price: number;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Ergonomic Office Chair', department: 'Furniture', price: 199.99 },
  { id: '2', name: 'Mechanical Keyboard', department: 'Electronics', price: 149.99 },
  { id: '3', name: 'Noise Cancelling Headphones', department: 'Electronics', price: 299.0 },
  { id: '4', name: 'Standing Desk Converter', department: 'Furniture', price: 249.5 },
  { id: '5', name: 'Blue Light Glasses', department: 'Accessories', price: 45.0 },
  { id: '6', name: 'Executive Leather Notebook', department: 'Stationery', price: 24.99 },
  { id: '7', name: '4K Desktop Monitor', department: 'Electronics', price: 399.99 },
  { id: '8', name: 'Post-it Notes Bundle', department: 'Stationery', price: 12.5 },
];

export function ProductDashboard() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate a real API fetch with delay
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="space-y-4">
          <div className="h-6 w-32 bg-glass-dark rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-32 bg-glass-dark rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <GlassCard
        variant="light"
        className="p-16 mt-8 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2 px-4 shadow-none"
      >
        <div className="p-4 bg-glass-dark rounded-full">
          <Layers size={40} className="text-foreground/30" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight">No products found</h3>
          <p className="text-foreground/60 max-w-sm mt-2 text-sm leading-relaxed">
            There are currently no products available. Check back later.
          </p>
        </div>
      </GlassCard>
    );
  }

  // Grouping logic
  const departments = Array.from(new Set(products.map((p) => p.department)));

  return (
    <div className="space-y-12">
      {departments.map((dept) => (
        <DepartmentSection
          key={dept}
          department={dept}
          products={products.filter((p) => p.department === dept)}
        />
      ))}
    </div>
  );
}
