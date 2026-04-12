import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'ghost';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white rounded-xl shadow-card border border-gray-100',
      flat: 'bg-white rounded-xl border border-gray-100',
      ghost: 'bg-transparent',
    };

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          'overflow-hidden',
          hover && 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 border-b border-gray-100', className)} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 border-t border-gray-100', className)} {...props} />
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;
export { CardHeader, CardContent, CardFooter };