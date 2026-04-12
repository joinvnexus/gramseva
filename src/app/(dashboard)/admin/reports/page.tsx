'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/components/common/Loader';
import { AlertCircle, Clock, CheckCircle, FileText, MapPin, Phone, User, ThumbsUp, Trash2, PlayCircle, CheckCheck } from 'lucide-react';

interface Report {
  id: string;
  problemType: string;
  description: string;
  imageUrl: string | null;
  status: string;
  upVotes: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    phone: string;
    village: string;
  };
}

const problemTypeNames: Record<string, string> = {
  ROAD: 'রাস্তা',
  WATER: 'পানি',
  ELECTRICITY: 'বিদ্যুৎ',
  OTHER: 'অন্যান্য',
};

const problemTypeIcons: Record<string, string> = {
  ROAD: '🛣️',
  WATER: '💧',
  ELECTRICITY: '⚡',
  OTHER: '📝',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
  PROCESSING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  RESOLVED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
};

const statusNames: Record<string, string> = {
  PENDING: 'বিচারাধীন',
  PROCESSING: 'প্রক্রিয়াধীন',
  RESOLVED: 'সমাধান হয়েছে',
};

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AdminReportsContent />
    </Suspense>
  );
}

function AdminReportsContent() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'ALL');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchReports();
  }, [isAuthenticated, user, filterStatus]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filterStatus === 'ALL' 
        ? '/api/admin/reports' 
        : `/api/admin/reports?status=${filterStatus}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        alert('রিপোর্ট স্ট্যাটাস আপডেট করা হয়েছে');
        fetchReports();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm('রিপোর্টটি ডিলিট করতে চান? এই কাজ অপরিবর্তনীয়!')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        alert('রিপোর্ট ডিলিট সফল!');
        fetchReports();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('রিপোর্ট ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-primary-light">রিপোর্ট ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">সকল রিপোর্ট দেখুন ও স্ট্যাটাস আপডেট করুন</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          মোট রিপোর্ট: {reports.length}
        </div>
      </div>

      {/* স্ট্যাটাস ফিল্টার */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'ALL'
                ? 'bg-primary dark:bg-primary-dark text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            সব রিপোর্ট
          </button>
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'PENDING'
                ? 'bg-yellow-500 text-white'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800/50'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-1" /> বিচারাধীন
          </button>
          <button
            onClick={() => setFilterStatus('PROCESSING')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'PROCESSING'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50'
            }`}
          >
            <PlayCircle className="w-4 h-4 inline mr-1" /> প্রক্রিয়াধীন
          </button>
          <button
            onClick={() => setFilterStatus('RESOLVED')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'RESOLVED'
                ? 'bg-green-500 text-white'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50'
            }`}
          >
            <CheckCheck className="w-4 h-4 inline mr-1" /> সমাধান হয়েছে
          </button>
        </div>
      </div>

      {/* রিপোর্ট লিস্ট */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* হেডার */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-2xl">{problemTypeIcons[report.problemType]}</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {problemTypeNames[report.problemType]}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[report.status]}`}>
                    {statusNames[report.status]}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(report.createdAt).toLocaleString('bn-BD')}
                  </span>
                </div>

                {/* বিবরণ */}
                <p className="text-gray-700 dark:text-gray-300 mb-3">{report.description}</p>

                {/* ইউজার তথ্য */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {report.user.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" /> {report.user.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {report.user.village}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" /> {report.upVotes} ভোট
                  </span>
                </div>

                {/* ছবি */}
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

              {/* অ্যাকশন বাটন */}
              <div className="flex flex-col gap-2 ml-4">
                {report.status !== 'RESOLVED' && (
                  <>
                    {report.status === 'PENDING' && (
                      <button
                        onClick={() => updateReportStatus(report.id, 'PROCESSING')}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        প্রক্রিয়াধীন করুন
                      </button>
                    )}
                    {report.status === 'PROCESSING' && (
                      <button
                        onClick={() => updateReportStatus(report.id, 'RESOLVED')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        সমাধান করুন
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => deleteReport(report.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-8 text-center text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p>কোনো রিপোর্ট পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
}