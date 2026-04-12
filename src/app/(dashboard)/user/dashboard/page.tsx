'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Loader from '@/components/common/Loader';
import { toBanglaDate } from '@/utils/bengaliHelper';
import { FileText, Calendar, Store, Plus, Search, CheckCircle, Clock, ThumbsUp } from 'lucide-react';

interface UserStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  totalBookings: number;
  completedBookings: number;
  upvotedReports: number;
}

interface RecentActivity {
  id: string;
  type: 'report' | 'booking';
  title: string;
  status: string;
  date: string;
}

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'USER') {
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
        setRecentActivities(data.data.recentActivities);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">ড্যাশবোর্ড দেখতে লগইন করুন</p>
        <Link href="/login" className="text-primary dark:text-primary-light mt-2 inline-block">
          লগইন করুন →
        </Link>
      </div>
    );
  }

  if (user?.role !== 'USER') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">এই পেজ শুধুমাত্র সাধারণ ইউজারদের জন্য</p>
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* স্বাগতম */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">স্বাগতম, {user?.name}!</h1>
        <p className="opacity-90 mt-1">
          আপনার কার্যকলাপ এবং পরিসংখ্যান এখানে দেখুন
        </p>
      </div>

      {/* স্ট্যাটস কার্ড */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalReports || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">মোট রিপোর্ট</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.resolvedReports || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">সমাধান হয়েছে</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalBookings || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">বুকিং</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-accent dark:text-accent-light" />
          <div className="text-2xl font-bold text-accent dark:text-accent-light">{stats?.upvotedReports || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">ভোট দেওয়া</div>
        </div>
      </div>

      {/* দ্রুত লিংক */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/reports/new"
          className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition"
        >
          <Plus className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <p className="font-medium text-gray-800 dark:text-gray-200">নতুন রিপোর্ট</p>
        </Link>
        <Link
          href="/services"
          className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition"
        >
          <Search className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <p className="font-medium text-gray-800 dark:text-gray-200">সার্ভিস খুঁজুন</p>
        </Link>
        <Link
          href="/bookings"
          className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition"
        >
          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <p className="font-medium text-gray-800 dark:text-gray-200">আমার বুকিং</p>
        </Link>
        <Link
          href="/market"
          className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition"
        >
          <Store className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <p className="font-medium text-gray-800 dark:text-gray-200">হাট বাজার</p>
        </Link>
      </div>

      {/* সাম্প্রতিক কার্যকলাপ */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">সাম্প্রতিক কার্যকলাপ</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p>কোনো কার্যকলাপ নেই</p>
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activity.type === 'report' ? (
                    <FileText className="w-6 h-6 text-primary dark:text-primary-light" />
                  ) : (
                    <Calendar className="w-6 h-6 text-primary dark:text-primary-light" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{toBanglaDate(activity.date)}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  activity.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                  activity.status === 'RESOLVED' || activity.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                }`}>
                  {activity.status === 'PENDING' ? 'বিচারাধীন' :
                   activity.status === 'RESOLVED' ? 'সমাধান হয়েছে' :
                   activity.status === 'COMPLETED' ? 'সম্পন্ন' : 'প্রক্রিয়াধীন'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}