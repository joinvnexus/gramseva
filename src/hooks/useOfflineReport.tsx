'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  addToQueue, 
  getQueue, 
  updateQueueStatus, 
  removeFromQueue,
  processQueue as processQueueApi,
  registerSync,
  PendingRequest 
} from '@/utils/offlineQueue';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface QueueItem extends PendingRequest {
  id: number;
}

interface UseOfflineReportReturn {
  isOnline: boolean;
  queueCount: number;
  queueItems: QueueItem[];
  submitReport: (formData: FormData) => Promise<{ success: boolean; offline?: boolean; message?: string }>;
  processQueue: () => Promise<void>;
  clearFailedItems: () => Promise<void>;
  isProcessing: boolean;
}

export function useOfflineReport(): UseOfflineReportReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);

    const handleOnline = () => {
      setIsOnline(true);
      registerSync();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_COMPLETE') {
          loadQueue();
        }
      });
    }

    loadQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadQueue = async () => {
    try {
      const items = await getQueue();
      setQueueItems(items as QueueItem[]);
    } catch (error) {
      console.error('Failed to load queue:', error);
    }
  };

  const submitReport = useCallback(async (formData: FormData): Promise<{ success: boolean; offline?: boolean; message?: string }> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!isOnline) {
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        await addToQueue({
          url: '/api/reports',
          method: 'POST',
          headers,
          body: formData,
        });

        await loadQueue();
        
        registerSync();

        return {
          success: true,
          offline: true,
          message: 'রিপোর্ট অফলাইনে সংরক্ষিত হয়েছে। ইন্টারনেট সংযোগ হলে স্বয়ংক্রিয়ভাবে জমা হবে।'
        };
      } catch (error) {
        console.error('Failed to queue report:', error);
        return {
          success: false,
          message: 'রিপোর্ট সংরক্ষণে ব্যর্থ। আবার চেষ্টা করুন।'
        };
      }
    }

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        return { success: true, message: 'রিপোর্ট সফলভাবে জমা হয়েছে!' };
      }
      
      return { success: false, message: data.error || 'রিপোর্ট জমা করতে সমস্যা হয়েছে' };
    } catch (error) {
      console.error('Submit error:', error);
      
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        await addToQueue({
          url: '/api/reports',
          method: 'POST',
          headers,
          body: formData,
        });

        await loadQueue();
        registerSync();

        return {
          success: true,
          offline: true,
          message: 'ইন্টারনেট সংযোগ নেই। রিপোর্ট অফলাইনে সংরক্ষিত হয়েছে।'
        };
      } catch (queueError) {
        console.error('Failed to queue after fetch error:', queueError);
        return { success: false, message: 'রিপোর্ট জমা করতে ব্যর্থ। ইন্টারনেট চেক করুন।' };
      }
    }
  }, [isOnline]);

  const processQueue = useCallback(async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await processQueueApi();
      await loadQueue();
      
      if (result.success > 0) {
        console.log(`Successfully synced ${result.success} items`);
      }
      if (result.failed > 0) {
        console.log(`Failed to sync ${result.failed} items`);
      }
    } catch (error) {
      console.error('Queue processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const clearFailedItems = useCallback(async () => {
    const failedItems = queueItems.filter(item => item.status === 'failed');
    
    for (const item of failedItems) {
      if (item.id) {
        await removeFromQueue(item.id);
      }
    }
    
    await loadQueue();
  }, [queueItems]);

  return {
    isOnline,
    queueCount: queueItems.filter(item => item.status === 'pending').length,
    queueItems,
    submitReport,
    processQueue,
    clearFailedItems,
    isProcessing,
  };
}

interface OfflineStatusBannerProps {
  isOnline: boolean;
  queueCount: number;
  onRetry?: () => void;
  isProcessing?: boolean;
}

export function OfflineStatusBanner({ isOnline, queueCount, onRetry, isProcessing }: OfflineStatusBannerProps) {
  if (isOnline && queueCount === 0) return null;

  return (
    <div className={`p-3 rounded-lg mb-4 flex items-center justify-between ${
      isOnline ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700' : 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700'
    }`}>
      <div className="flex items-center gap-3">
        {isOnline ? (
          <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-600 dark:text-red-400" />
        )}
        <span className={`text-sm ${isOnline ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300'}`}>
          {!isOnline ? 'আপনি অফলাইনে আছেন। ' : ''}
          {queueCount > 0 && `${queueCount}টি রিপোর্ট জমার অপেক্ষায়।`}
        </span>
      </div>
      
      {queueCount > 0 && onRetry && (
        <button
          onClick={onRetry}
          disabled={isProcessing || !isOnline}
          className="flex items-center gap-1 px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? 'সিঙ্ক হচ্ছে...' : 'পুনরায় চেষ্টা'}
        </button>
      )}
    </div>
  );
}

interface QueueStatusProps {
  items: QueueItem[];
  onProcess?: () => void;
  onClear?: () => void;
}

export function QueueStatus({ items, onProcess, onClear }: QueueStatusProps) {
  if (items.length === 0) return null;

  const pending = items.filter(i => i.status === 'pending').length;
  const syncing = items.filter(i => i.status === 'syncing').length;
  const failed = items.filter(i => i.status === 'failed').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">সিঙ্ক স্ট্যাটাস</h3>
      
      <div className="space-y-2 mb-4">
        {pending > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600 dark:text-gray-400">{pending}টি অপেক্ষায়</span>
          </div>
        )}
        {syncing > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">{syncing}টি সিঙ্ক হচ্ছে</span>
          </div>
        )}
        {failed > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-gray-600 dark:text-gray-400">{failed}টি ব্যর্থ</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {onProcess && (
          <button
            onClick={onProcess}
            className="flex items-center gap-1 px-3 py-2 bg-primary text-white text-sm rounded hover:bg-primary-dark"
          >
            <RefreshCw className="w-4 h-4" />
            সিঙ্ক করুন
          </button>
        )}
        {onClear && failed > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ব্যর্থ মুছুন
          </button>
        )}
      </div>
    </div>
  );
}

export function OnlineStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600 dark:text-green-400">অনলাইন</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-500" />
          <span className="text-xs text-red-600 dark:text-red-400">অফলাইন</span>
        </>
      )}
    </div>
  );
}