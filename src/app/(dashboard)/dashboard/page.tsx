import { ProductGridMockup } from '@/components/features/ProductGridMockup';

export default function DashboardMockup() {
  return (
    <main className="p-8 space-y-8 max-w-[1500px] mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-foreground/70">
          Browse items by department. Use the toggles below to view the mocked glassmorphism loading
          and empty states!
        </p>
      </div>

      {/* Rendering the interactive 3-state grid directly into the dashboard layout! */}
      <ProductGridMockup />
    </main>
  );
}
