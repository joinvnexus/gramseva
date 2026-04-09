'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Report } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

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
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700">কোন রিপোর্ট নেই</h3>
          <p className="text-gray-500 mt-2">প্রথম রিপোর্টটি আপনিই দিন!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* হেডার */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{problemTypeIcons[report.problemType]}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[report.status]}`}>
                      {statusText[report.status]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>

                  {/* বিবরণ */}
                  <p className="text-gray-700 mb-3">{report.description}</p>

                  {/* ইউজার ও লোকেশন */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      👤 {report.user?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      📍 {report.user?.village}
                    </span>
                  </div>

                  {/* ছবি (যদি থাকে) */}
                  {report.imageUrl && (
                    <div className="mt-3">
                      <img
                        src={report.imageUrl}
                        alt="Report"
                        className="h-32 w-auto rounded object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* ভোট বাটন */}
                <button
                  onClick={() => handleVote(report.id)}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="text-2xl">👍</span>
                  <span className="text-sm font-semibold mt-1">{report.upVotes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}