import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gray';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variantClasses: Record<BadgeVariant, string> = {
      primary: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light',
      secondary: 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary-light',
      success: 'bg-success/10 text-success dark:bg-success/20',
      warning: 'bg-warning/10 text-warning dark:bg-warning/20',
      error: 'bg-error/10 text-error dark:bg-error/20',
      info: 'bg-info/10 text-info dark:bg-info/20',
      gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;