'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Loader from '@/components/common/Loader';
import { toBanglaDate } from '@/utils/bengaliHelper';
import { FileText, Calendar, Store, Plus, Search, CheckCircle, Clock } from 'lucide-react';

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
        <p className="text-gray-500">ড্যাশবোর্ড দেখতে লগইন করুন</p>
        <Link href="/login" className="text-primary mt-2 inline-block">
          লগইন করুন →
        </Link>
      </div>
    );
  }

  if (user?.role !== 'USER') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">এই পেজ শুধুমাত্র সাধারণ ইউজারদের জন্য</p>
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
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary">{stats?.totalReports || 0}</div>
          <div className="text-sm text-gray-600">মোট রিপোর্ট</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-600">{stats?.resolvedReports || 0}</div>
          <div className="text-sm text-gray-600">সমাধান হয়েছে</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary">{stats?.totalBookings || 0}</div>
          <div className="text-sm text-gray-600">বুকিং</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
          <div className="text-2xl font-bold text-accent">{stats?.upvotedReports || 0}</div>
          <div className="text-sm text-gray-600">ভোট দেওয়া</div>
        </div>
      </div>

      {/* দ্রুত লিংক */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/reports/new"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <Plus className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">নতুন রিপোর্ট</p>
        </Link>
        <Link
          href="/services"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <Search className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">সার্ভিস খুঁজুন</p>
        </Link>
        <Link
          href="/bookings"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">আমার বুকিং</p>
        </Link>
        <Link
          href="/market"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <Store className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">হাট বাজার</p>
        </Link>
      </div>

      {/* স্ট্যাটস কার্ড */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary">{stats?.totalReports || 0}</div>
          <div className="text-sm text-gray-600">মোট রিপোর্ট</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-600">{stats?.resolvedReports || 0}</div>
          <div className="text-sm text-gray-600">সমাধান হয়েছে</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary">{stats?.totalBookings || 0}</div>
          <div className="text-sm text-gray-600">বুকিং</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
          <div className="text-2xl font-bold text-accent">{stats?.upvotedReports || 0}</div>
          <div className="text-sm text-gray-600">ভোট দেওয়া</div>
        </div>
      </div>

      {/* দ্রুত লিংক */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/reports/new"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <Plus className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">নতুন রিপোর্ট</p>
        </Link>
        <Link
          href="/services"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <Search className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">সার্ভিস খুঁজুন</p>
        </Link>
        <Link
          href="/bookings"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">আমার বুকিং</p>
        </Link>
        <Link
          href="/market"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <Store className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-medium">হাট বাজার</p>
        </Link>
      </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl mb-2">📅</div>
          <div className="text-2xl font-bold text-primary">{stats?.totalBookings || 0}</div>
          <div className="text-sm text-gray-600">বুকিং</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl mb-2">👍</div>
          <div className="text-2xl font-bold text-accent">{stats?.upvotedReports || 0}</div>
          <div className="text-sm text-gray-600">ভোট দেওয়া</div>
        </div>
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
        <Link
          href="/bookings"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <div className="text-3xl mb-2">📅</div>
          <p className="font-medium">আমার বুকিং</p>
        </Link>
        <Link
          href="/market"
          className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
        >
          <div className="text-3xl mb-2">🏪</div>
          <p className="font-medium">হাট বাজার</p>
        </Link>
      </div>

      {/* সাম্প্রতিক কার্যকলাপ */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">সাম্প্রতিক কার্যকলাপ</h2>
        </div>
        <div className="divide-y">
          {recentActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>কোনো কার্যকলাপ নেই</p>
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activity.type === 'report' ? (
                    <FileText className="w-6 h-6 text-primary" />
                  ) : (
                    <Calendar className="w-6 h-6 text-primary" />
                  )}
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{toBanglaDate(activity.date)}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  activity.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  activity.status === 'RESOLVED' || activity.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {activity.status === 'PENDING' ? 'বিচারাধীন' :
                   activity.status === 'RESOLVED' ? 'সমাধান済み' :
                   activity.status === 'COMPLETED' ? 'সম্পন্ন' : 'প্রক্রিয়াধীন'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}