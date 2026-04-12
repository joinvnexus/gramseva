import { HTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = 'Avatar', size = 'md', fallback, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);

    const sizeClasses = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    const iconSizes = {
      xs: 12,
      sm: 14,
      md: 18,
      lg: 22,
      xl: 30,
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-full overflow-hidden bg-primary/10 dark:bg-primary/20 flex items-center justify-center',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : fallback ? (
          <span className={cn('font-semibold text-primary', { 'text-xs': size === 'xs', 'text-sm': size === 'sm', 'text-base': size === 'md', 'text-lg': size === 'lg', 'text-xl': size === 'xl' })}>
            {getInitials(fallback)}
          </span>
        ) : (
          <User className="text-primary" style={{ width: iconSizes[size], height: iconSizes[size] }} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;