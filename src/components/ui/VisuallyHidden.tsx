'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VisuallyHiddenProps {
  children: ReactNode;
  className?: string;
}

export default function VisuallyHidden({ children, className }: VisuallyHiddenProps) {
  return (
    <span className={cn(
      'absolute w-px h-px p-0 -overflow-hidden clip-0 border-0',
      '[clip:rect(0,0,0,0)]',
      className
    )}>
      {children}
    </span>
  );
}