import * as React from 'react';
import { cn } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-glass-border bg-glass-light px-3 py-2 text-sm text-foreground',
          'backdrop-blur-sm shadow-inner transition-colors',
          'placeholder:text-foreground/50',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
GlassInput.displayName = 'GlassInput';
