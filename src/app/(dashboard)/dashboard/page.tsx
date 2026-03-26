import { GlassCard } from '@/components/ui/GlassCard';

export default function DashboardMockup() {
  return (
    <main className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-foreground/70">
          This is the primary workspace view. Note the responsive Glassmorphism Sidebar fixed to the
          left of the screen.
        </p>
      </div>

      <GlassCard
        variant="dark"
        className="p-12 text-center text-foreground/60 border border-dashed hover:border-solid transition-all cursor-pointer"
      >
        <p>
          Main content area. (The Department-wise product grid from US-06 will be implemented here).
        </p>
      </GlassCard>
    </main>
  );
}
