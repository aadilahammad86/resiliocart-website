'use client';

import * as React from 'react';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Layers } from 'lucide-react';

enum ViewState {
  LOADING,
  EMPTY,
  POPULATED,
}

// Sample Department Data Mocks
const MOCK_PRODUCTS = [
  { id: '1', name: 'Ergonomic Office Chair', department: 'Furniture', price: 199.99 },
  { id: '2', name: 'Mechanical Keyboard', department: 'Electronics', price: 149.99 },
  { id: '3', name: 'Noise Cancelling Headphones', department: 'Electronics', price: 299.0 },
  { id: '4', name: 'Standing Desk Converter', department: 'Furniture', price: 249.5 },
  { id: '5', name: 'Blue Light Glasses', department: 'Accessories', price: 45.0 },
  { id: '6', name: 'Executive Leather Notebook', department: 'Stationery', price: 24.99 },
  { id: '7', name: '4K Desktop Monitor', department: 'Electronics', price: 399.99 },
  { id: '8', name: 'Post-it Notes Bundle', department: 'Stationery', price: 12.5 },
];

export function ProductGridMockup() {
  // Toggle states built specifically to satisfy all edge case requirements
  const [viewState, setViewState] = React.useState<ViewState>(ViewState.POPULATED);

  return (
    <div className="space-y-6">
      {/* Interactive Mock Layout Header */}
      <div className="flex flex-wrap gap-2 p-3 bg-glass-light backdrop-blur-sm border border-glass-border rounded-xl">
        <span className="text-sm font-bold flex items-center mr-4">Preview States:</span>
        <button
          onClick={() => setViewState(ViewState.LOADING)}
          className={`text-sm px-4 py-1.5 rounded-lg border transition-colors ${viewState === ViewState.LOADING ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-700 dark:text-indigo-300 font-semibold' : 'border-glass-border hover:bg-white/10'}`}
        >
          Loading Grid
        </button>
        <button
          onClick={() => setViewState(ViewState.EMPTY)}
          className={`text-sm px-4 py-1.5 rounded-lg border transition-colors ${viewState === ViewState.EMPTY ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-700 dark:text-indigo-300 font-semibold' : 'border-glass-border hover:bg-white/10'}`}
        >
          Empty State
        </button>
        <button
          onClick={() => setViewState(ViewState.POPULATED)}
          className={`text-sm px-4 py-1.5 rounded-lg border transition-colors ${viewState === ViewState.POPULATED ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-700 dark:text-indigo-300 font-semibold' : 'border-glass-border hover:bg-white/10'}`}
        >
          Populated Products
        </button>
      </div>

      {/* Grid States */}
      {viewState === ViewState.LOADING && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {viewState === ViewState.EMPTY && (
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
              There are currently no products available in this department. Check back later or
              clear your filters.
            </p>
          </div>
        </GlassCard>
      )}

      {viewState === ViewState.POPULATED && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
