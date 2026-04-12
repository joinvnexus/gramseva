'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';
import { Users, Wrench, FileText, Store, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalAdmins: number;
  totalServices: number;
  totalReports: number;
  totalBookings: number;
  pendingReports: number;
  processingReports: number;
  resolvedReports: number;
  totalMarkets: number;
  todayBookings: number;
  thisMonthRevenue: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  user: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchAdminData();
  }, [isAuthenticated, user]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
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

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
            <p className="opacity-90 mt-1">
              স্বাগতম, {user?.name}! পুরো সিস্টেম আপনি নিয়ন্ত্রণ করতে পারবেন।
            </p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <span className="text-sm">অ্যাডমিন প্যানেল v1.0</span>
          </div>
        </div>
      </div>

      {/* মেইন স্ট্যাটস */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition">
          <Users className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalUsers || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">মোট ইউজার</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition">
          <Wrench className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalProviders || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">প্রোভাইডার</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition">
          <FileText className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalReports || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">রিপোর্ট</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalServices || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">সার্ভিস</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalBookings || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">বুকিং</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition">
          <Store className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalMarkets || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">হাট বাজার</div>
        </div>
      </div>

      {/* রিপোর্ট স্ট্যাটস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow dark:shadow-gray-900/50 p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm">বিচারাধীন রিপোর্ট</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats?.pendingReports || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
          </div>
          <Link href="/admin/reports?status=PENDING" className="text-yellow-600 dark:text-yellow-400 text-sm mt-2 inline-block">
            দেখুন →
          </Link>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow dark:shadow-gray-900/50 p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm">প্রক্রিয়াধীন রিপোর্ট</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats?.processingReports || 0}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <Link href="/admin/reports?status=PROCESSING" className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block">
            দেখুন →
          </Link>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow dark:shadow-gray-900/50 p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm">সমাধান হয়েছে</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats?.resolvedReports || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
          <Link href="/admin/reports?status=RESOLVED" className="text-green-600 dark:text-green-400 text-sm mt-2 inline-block">
            দেখুন →
          </Link>
        </div>
      </div>

      {/* কুইক অ্যাকশন */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/users" className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition group">
          <Users className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light group-hover:scale-110 transition" />
          <p className="font-medium text-gray-800 dark:text-gray-200">ইউজার ম্যানেজ</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">সকল ইউজার দেখুন ও পরিচালনা করুন</p>
        </Link>
        <Link href="/admin/services" className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition group">
          <Wrench className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light group-hover:scale-110 transition" />
          <p className="font-medium text-gray-800 dark:text-gray-200">সার্ভিস ম্যানেজ</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">সকল সার্ভিস দেখুন ও পরিচালনা করুন</p>
        </Link>
        <Link href="/admin/reports" className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition group">
          <FileText className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light group-hover:scale-110 transition" />
          <p className="font-medium text-gray-800 dark:text-gray-200">রিপোর্ট ম্যানেজ</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">রিপোর্ট স্ট্যাটাস আপডেট করুন</p>
        </Link>
        <Link href="/admin/markets" className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center hover:shadow-lg transition group">
          <Store className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light group-hover:scale-110 transition" />
          <p className="font-medium text-gray-800 dark:text-gray-200">হাট বাজার</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">হাট বাজার ও দর আপডেট করুন</p>
        </Link>
      </div>

      {/* সাম্প্রতিক কার্যকলাপ */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">সাম্প্রতিক কার্যকলাপ</h2>
          <Link href="/admin/activities" className="text-primary dark:text-primary-light text-sm">সব দেখুন →</Link>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p>কোনো কার্যকলাপ নেই</p>
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  {activity.type === 'user' && <Users className="w-6 h-6 text-primary dark:text-primary-light" />}
                  {activity.type === 'service' && <Wrench className="w-6 h-6 text-primary dark:text-primary-light" />}
                  {activity.type === 'report' && <FileText className="w-6 h-6 text-primary dark:text-primary-light" />}
                  {activity.type === 'booking' && <Calendar className="w-6 h-6 text-primary dark:text-primary-light" />}
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.user} • {new Date(activity.createdAt).toLocaleString('bn-BD')}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  activity.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                  activity.status === 'PROCESSING' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                  activity.status === 'RESOLVED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}