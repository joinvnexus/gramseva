'use client';

import React from 'react';
import Toast from './Toast';
import { useToastContext } from '@/contexts/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-50 flex flex-col gap-2 p-4
        md:bottom-6 md:right-6 md:items-end
        bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-auto max-w-sm"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}