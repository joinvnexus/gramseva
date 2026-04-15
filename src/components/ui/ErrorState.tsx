'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  icon?: ReactNode;
  title?: string;
  message?: string;
  retry?: () => void;
  className?: string;
}

export default function ErrorState({
  icon,
  title = 'কিছু সমস্যা হয়েছে',
  message = 'অনুগ্রহ করে পুনরায় চেষ্টা করুন',
  retry,
  className
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {icon || (
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-error" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          পুনরায় চেষ্টা করুন
        </Button>
      )}
    </div>
  );
}