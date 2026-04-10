'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ReportForm from '@/components/reports/ReportForm';

export default function NewReportPage() {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    if (!isAuthenticated) {
      alert('রিপোর্ট জমা করতে হলে লগইন করুন');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert('রিপোর্ট সফলভাবে জমা হয়েছে!');
        router.push('/reports');
      } else {
        alert(data.error || 'রিপোর্ট জমা করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('রিপোর্ট জমা করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary px-6 py-4">
          <h1 className="text-xl font-bold text-white">নতুন রিপোর্ট</h1>
          <p className="text-white/80 text-sm mt-1">
            নতুন রিপোর্ট জমা করুন
          </p>
        </div>

        <div className="p-6">
          <ReportForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}

