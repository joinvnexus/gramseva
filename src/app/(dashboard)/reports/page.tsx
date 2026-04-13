'use client';

import { useState, useEffect, useMemo, createElement } from 'react';
import Link from 'next/link';
import { Report } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Loader from '@/components/common/Loader';
import ReportCard from '@/components/reports/ReportCard';
import { MapPin, Droplets, Zap, FileText, Clock, RefreshCw, CheckCircle, Inbox, ThumbsUp, BarChart } from 'lucide-react';

const statusColors = {
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
  PROCESSING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  RESOLVED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
};

const problemTypeIcons = {
  ROAD: MapPin,
  WATER: Droplets,
  ELECTRICITY: Zap,
  OTHER: FileText,
};

const statusText = {
  PENDING: 'বিচারাধীন',
  PROCESSING: 'প্রক্রিয়াধীন',
  RESOLVED: 'সমাধান',
};


type SortOption = 'RECENT' | 'VOTES';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [problemTypeFilter, setProblemTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('RECENT');
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, [statusFilter, problemTypeFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (problemTypeFilter !== 'ALL') params.append('problemType', problemTypeFilter);

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
        fetchReports();
      }
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'PENDING').length;
    const processing = reports.filter(r => r.status === 'PROCESSING').length;
    const resolved = reports.filter(r => r.status === 'RESOLVED').length;
    return { total, pending, processing, resolved };
  }, [reports]);

  const sortedReports = useMemo(() => {
    const sorted = [...reports];
    if (sortBy === 'RECENT') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'VOTES') {
      sorted.sort((a, b) => b.upVotes - a.upVotes);
    }
    return sorted;
  }, [reports, sortBy]);

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-primary-light">সমস্যার রিপোর্ট</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">আপনার এলাকার সমস্যা সমূহ</p>
        </div>
        <Link
          href="/reports/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          + নতুন রিপোর্ট
        </Link>
      </div>

      {/* স্ট্যাটস সামারি */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">মোট রিপোর্ট</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <BarChart className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">বিচারাধীন</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">প্রক্রিয়াধীন</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.processing}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">সমাধান</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* সমস্যার ধরন ফিল্টার */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          সমস্যার ধরন:
        </span>
        {['ALL', 'ROAD', 'WATER', 'ELECTRICITY', 'OTHER'].map((type) => (
          <button
            key={type}
            onClick={() => setProblemTypeFilter(type)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-sm transition flex items-center gap-1.5 ${
              problemTypeFilter === type
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {type !== 'ALL' && problemTypeIcons[type as keyof typeof problemTypeIcons] && 
              createElement(problemTypeIcons[type as keyof typeof problemTypeIcons], { className: "w-3.5 h-3.5" })
            }
            <span>{type === 'ALL' ? 'সব' : type}</span>
          </button>
        ))}
      </div>

      {/* সর্টিং অপশন */}
      <div className="flex items-center gap-2">
        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <BarChart className="w-4 h-4 mr-1" />
          সর্ট:
        </span>
        <button
          onClick={() => setSortBy('RECENT')}
          className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1.5 ${
            sortBy === 'RECENT'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          সাম্প্রতিক
        </button>
        <button
          onClick={() => setSortBy('VOTES')}
          className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1.5 ${
            sortBy === 'VOTES'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          সবচেয়ে বেশি ভোট
        </button>
      </div>

      {/* স্ট্যাটাস ফিল্টার */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          স্ট্যাটাস:
        </span>
        {['ALL', 'PENDING', 'PROCESSING', 'RESOLVED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-2 ${
              statusFilter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {status === 'ALL' && <Inbox className="w-4 h-4" />}
            {status === 'PENDING' && <Clock className="w-4 h-4" />}
            {status === 'PROCESSING' && <RefreshCw className="w-4 h-4" />}
            {status === 'RESOLVED' && <CheckCircle className="w-4 h-4" />}
            <span>
              {status === 'ALL' && 'সব'}
              {status === 'PENDING' && 'বিচারাধীন'}
              {status === 'PROCESSING' && 'প্রক্রিয়াধীন'}
              {status === 'RESOLVED' && 'সমাধান'}
            </span>
          </button>
        ))}
      </div>

      {/* ফলাফল সংখ্যা */}
      {!loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          মোট {sortedReports.length}টি রিপোর্ট
        </p>
      )}

      {/* রিপোর্ট লিস্ট */}
      {loading ? (
        <Loader />
      ) : sortedReports.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">কোন রিপোর্ট নেই</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">প্রথম রিপোর্টটি আপনিই দিন!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReports.map((report) => (
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