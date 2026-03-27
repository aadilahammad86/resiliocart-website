import * as React from 'react';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
  department: string;
  price: number;
}

interface DepartmentSectionProps {
  department: string;
  products: Product[];
}

export function DepartmentSection({ department, products }: DepartmentSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
          {department}
        </h2>
        <div className="h-px flex-1 bg-glass-border/40" />
        <span className="text-xs font-medium text-foreground/40 bg-glass-light px-2 py-1 rounded-md border border-glass-border">
          {products.length} {products.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
