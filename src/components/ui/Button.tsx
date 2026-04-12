'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {
    const variantClasses: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary',
      secondary: 'bg-secondary text-white hover:bg-secondary-dark',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white dark:border-primary-dark dark:text-white dark:hover:bg-primary dark:hover:text-white',
      ghost: 'text-primary hover:bg-primary/10 dark:text-primary-light dark:hover:bg-primary/20',
      danger: 'bg-error text-white hover:bg-error/90',
      accent: 'bg-accent text-primary hover:bg-accent-dark',
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'h-9 px-4 text-sm rounded-md',
      md: 'h-11 px-6 text-base rounded-lg',
      lg: 'h-13 px-8 text-lg rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-[0.96]',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;