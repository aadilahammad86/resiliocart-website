import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen p-8 lg:p-24 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Design System Reference</h1>
        <p className="text-foreground/70">
          Interactive documentation for our Glassmorphism tokens and utilities.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-glass-border pb-2">1. Glass Cards</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard variant="light" className="p-8">
            <h3 className="text-lg font-bold mb-2">Light Variant</h3>
            <p className="text-sm text-foreground/80">
              Uses bg-glass-light context for a bright, frosted glass effect. Best for standard
              content layers.
            </p>
          </GlassCard>

          <GlassCard variant="dark" className="p-8">
            <h3 className="text-lg font-bold mb-2">Dark Variant</h3>
            <p className="text-sm text-foreground/80">
              Uses bg-glass-dark context. Best for deep nested overlays or dramatic accents.
            </p>
          </GlassCard>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-glass-border pb-2">
          2. Glass Buttons
        </h2>
        <div className="flex flex-wrap gap-4">
          <GlassButton variant="primary">Primary Button</GlassButton>
          <GlassButton variant="secondary">Secondary Button</GlassButton>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-glass-border pb-2">
          3. Glass Inputs
        </h2>
        <div className="max-w-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Standard Text Input</label>
            <GlassInput type="text" placeholder="Enter your text here..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Password Input</label>
            <GlassInput type="password" placeholder="••••••••" />
          </div>
        </div>
      </section>
    </main>
  );
}
