'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ReportForm from '@/components/reports/ReportForm';
import { useOfflineReport, OfflineStatusBanner, QueueStatus, OnlineStatusIndicator } from '@/hooks/useOfflineReport';
import { useToast } from '@/hooks/useToast';

export default function NewReportPage() {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { 
    isOnline, 
    queueCount, 
    queueItems, 
    submitReport, 
    processQueue, 
    clearFailedItems,
    isProcessing 
  } = useOfflineReport();
  const { success, error, warning, info } = useToast();

  const handleSubmit = async (formData: FormData) => {
    if (!isAuthenticated) {
      warning('রিপোর্ট জমা করতে হলে লগইন করুন');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const result = await submitReport(formData);
      
      if (result.success) {
        if (result.offline) {
          info('রিপোর্ট অফলাইনে সংরক্ষিত হয়েছে। অনলাইন হলে সিঙ্ক হবে।');
        } else {
          success('রিপোর্ট সফলভাবে জমা হয়েছে!');
        }
        router.push('/reports');
      } else {
        error('রিপোর্ট জমা করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      console.error('Submit error:', err);
      error('রিপোর্ট জমা করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">নতুন রিপোর্ট</h1>
            <p className="text-white/80 text-sm mt-1">
              নতুন রিপোর্ট জমা করুন
            </p>
          </div>
          <OnlineStatusIndicator />
        </div>

        <div className="p-6">
          <OfflineStatusBanner 
            isOnline={isOnline} 
            queueCount={queueCount}
            onRetry={processQueue}
            isProcessing={isProcessing}
          />
          
          {queueItems.length > 0 && (
            <div className="mb-4">
              <QueueStatus 
                items={queueItems}
                onProcess={processQueue}
                onClear={clearFailedItems}
              />
            </div>
          )}
          
          <ReportForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}