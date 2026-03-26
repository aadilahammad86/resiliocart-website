import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark';
}

export function GlassCard({ className, variant = 'light', ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border backdrop-blur-md shadow-xl overflow-hidden',
        variant === 'light'
          ? 'bg-glass-light border-glass-border text-foreground'
          : 'bg-glass-dark border-glass-border text-foreground',
        className
      )}
      {...props}
    />
  );
}
