'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface DashboardStats {
  myReports: number;
  myServices: number;
  resolvedReports: number;
  totalBookings: number;
}

interface RecentReport {
  id: string;
  problemType: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    myReports: 0,
    myServices: 0,
    resolvedReports: 0,
    totalBookings: 0,
  });
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
        setRecentReports(data.data.recentReports);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* স্বাগতম */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">স্বাগতম, {user?.name}!</h1>
        <p className="opacity-90 mt-1">
          {user?.role === 'PROVIDER' 
            ? 'আপনার সার্ভিস এবং আপডেট এখানে দেখুন' 
            : 'আপনার কার্যকলাপ এখানে দেখুন'}
        </p>
      </div>

      {/* স্ট্যাটস কার্ড */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">মোট রিপোর্ট</p>
              <p className="text-2xl font-bold text-primary">{stats.myReports}</p>
            </div>
            <div className="text-3xl">📝</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">সমাধান済み</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolvedReports}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        {user?.role === 'PROVIDER' && (
          <>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">আমার সার্ভিস</p>
                  <p className="text-2xl font-bold text-secondary">{stats.myServices}</p>
                </div>
                <div className="text-3xl">🔧</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">মোট বুকিং</p>
                  <p className="text-2xl font-bold text-accent">{stats.totalBookings}</p>
                </div>
                <div className="text-3xl">📅</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* সাম্প্রতিক রিপোর্ট */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">সাম্প্রতিক রিপোর্ট</h2>
        </div>
        <div className="divide-y">
          {recentReports.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">📭</div>
              <p>কোন রিপোর্ট নেই</p>
              <Link href="/reports/new" className="text-primary mt-2 inline-block">
                প্রথম রিপোর্ট দিন →
              </Link>
            </div>
          ) : (
            recentReports.map((report) => (
              <div key={report.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{report.description.substring(0, 60)}...</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(report.createdAt).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.status === 'PENDING' ? 'বিচারাধীন' :
                     report.status === 'PROCESSING' ? 'প্রক্রিয়াধীন' : 'সমাধান済み'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        {recentReports.length > 0 && (
          <div className="p-3 border-t text-center">
            <Link href="/reports" className="text-primary text-sm">
              সব রিপোর্ট দেখুন →
            </Link>
          </div>
        )}
      </div>

      {/* দ্রুত লিংক */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/reports/new"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <div className="text-3xl mb-2">➕</div>
          <p className="font-medium">নতুন রিপোর্ট</p>
        </Link>
        <Link
          href="/services"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <div className="text-3xl mb-2">🔍</div>
          <p className="font-medium">সার্ভিস খুঁজুন</p>
        </Link>
        {user?.role === 'PROVIDER' && (
          <Link
            href="/services/new"
            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">✨</div>
            <p className="font-medium">নতুন সার্ভিস</p>
          </Link>
        )}
        <Link
          href="/market"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <div className="text-3xl mb-2">🏪</div>
          <p className="font-medium">হাট বাজার</p>
        </Link>
      </div>
    </div>
  );
}