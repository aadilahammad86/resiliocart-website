import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
          'backdrop-blur-md border border-glass-border shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
          variant === 'primary'
            ? 'bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30 dark:text-indigo-200'
            : 'bg-glass-light text-foreground hover:bg-white/20',
          className
        )}
        {...props}
      />
    );
  }
);
GlassButton.displayName = 'GlassButton';
