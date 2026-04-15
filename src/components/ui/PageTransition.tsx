'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function PageTransition({ children, className, delay = 0 }: PageTransitionProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div 
      className={cn(
        'animate-fade-in',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}