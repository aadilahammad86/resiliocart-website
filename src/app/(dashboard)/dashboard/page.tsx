import { ProductDashboard } from '@/components/features/ProductDashboard';

export default function DashboardPage() {
  return (
    <main className="p-8 space-y-8 max-w-[1500px] mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-foreground/70">Browse items organized by department.</p>
      </div>

      <ProductDashboard />
    </main>
  );
}
