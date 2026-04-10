'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Report } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Loader from '@/components/common/Loader';
import ReportCard from '@/components/reports/ReportCard';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
};

const statusText = {
  PENDING: 'বিচারাধীন',
  PROCESSING: 'প্রক্রিয়াধীন',
  RESOLVED: 'সমাধান済み',
};

const problemTypeIcons = {
  ROAD: '🛣️',
  WATER: '💧',
  ELECTRICITY: '⚡',
  OTHER: '📝',
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.append('status', filter);

      const response = await fetch(`/api/reports?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (reportId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/reports/${reportId}/vote`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        fetchReports(); // Refresh list
      }
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">সমস্যার রিপোর্ট</h1>
          <p className="text-gray-600 mt-1">আপনার এলাকার সমস্যা সমূহ</p>
        </div>
        <Link
          href="/reports/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          + নতুন রিপোর্ট
        </Link>
      </div>

      {/* ফিল্টার */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['ALL', 'PENDING', 'PROCESSING', 'RESOLVED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'ALL' && 'সব'}
            {status === 'PENDING' && '⏳ বিচারাধীন'}
            {status === 'PROCESSING' && '🔄 প্রক্রিয়াধীন'}
            {status === 'RESOLVED' && '✅ সমাধান済み'}
          </button>
        ))}
      </div>

      {/* রিপোর্ট লিস্ট */}
      {loading ? (
        <Loader />
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700">কোন রিপোর্ট নেই</h3>
          <p className="text-gray-500 mt-2">প্রথম রিপোর্টটি আপনিই দিন!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
           <ReportCard 
      key={report.id} 
      report={report} 
      onVote={handleVote}
    />
          ))}
        </div>
      )}
    </div>
  );
}