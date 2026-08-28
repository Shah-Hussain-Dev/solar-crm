import * as React from 'react';
import { cn } from '@/shared/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        {
          'border-transparent bg-primary text-primary-foreground': variant === 'default',
          'border-transparent bg-secondary text-secondary-foreground': variant === 'secondary',
          'border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200': variant === 'destructive',
          'text-foreground border-border bg-background': variant === 'outline',
          'border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200': variant === 'success',
          'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200': variant === 'warning',
          'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200': variant === 'info',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
