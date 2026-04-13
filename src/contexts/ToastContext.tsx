'use client';

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  success: (message?: string) => void;
  error: (message?: string) => void;
  info: (message?: string) => void;
  warning: (message?: string) => void;
  removeToast: (id: string) => void;
}

const BENGALI_MESSAGES = {
  success: {
    default: 'সফলভাবে সম্পন্ন হয়েছে',
    saved: 'সফলভাবে সংরক্ষণ করা হয়েছে',
    updated: 'সফলভাবে আপডেট করা হয়েছে',
    deleted: 'সফলভাবে মুছে ফেলা হয়েছে',
    submitted: 'সফলভাবে জমা দেওয়া হয়েছে',
  },
  error: {
    default: 'কিছু সমস্যা হয়েছে',
    save: 'সংরক্ষণ করতে ব্যর্থ',
    update: 'আপডেট করতে ব্যর্থ',
    delete: 'মুছে ফেলতে ব্যর্থ',
    submit: 'জমা দিতে ব্যর্থ',
    network: 'ইন্টারনেট সংযোগে সমস্যা',
    auth: 'প্রমাণীকরণ ব্যর্থ',
  },
  info: {
    default: 'তথ্য',
    loading: 'লোড হচ্ছে...',
    wait: 'অপেক্ষা করুন',
  },
  warning: {
    default: 'সতর্কতা',
    offline: 'আপনি অফলাইনে আছেন',
    unsaved: 'সংরক্ষণ করা হয়নি',
    confirm: 'নিশ্চিত করুন',
  },
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (type: ToastType, customMessage?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const message = customMessage || BENGALI_MESSAGES[type].default;

      setToasts((prev) => {
        if (prev.length >= 5) {
          const oldest = prev[0];
          removeToast(oldest.id);
        }
        return [...prev, { id, message, type }];
      });

      const duration = 4000;
      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);

      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  const success = useCallback(
    (message?: string) => addToast('success', message),
    [addToast]
  );
  const error = useCallback(
    (message?: string) => addToast('error', message),
    [addToast]
  );
  const info = useCallback(
    (message?: string) => addToast('info', message),
    [addToast]
  );
  const warning = useCallback(
    (message?: string) => addToast('warning', message),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        success,
        error,
        info,
        warning,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}