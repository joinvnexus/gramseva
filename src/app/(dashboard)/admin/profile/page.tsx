'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import Loader from '@/components/common/Loader';
import Link from 'next/link';
import { Crown, Users, Wrench, FileText, Calendar, MapPin, LogOut, Edit, Save, X } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalServices: number;
  totalReports: number;
  totalBookings: number;
}

export default function AdminProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { success, error } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    ward: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    if (user) {
      setFormData({
        name: user.name || '',
        village: user.village || '',
        ward: user.ward?.toString() || '',
      });
    }
    fetchAdminStats();
  }, [isAuthenticated, user]);

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
      }
    } catch (err) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          village: formData.village,
          ward: parseInt(formData.ward),
        }),
      });
      const data = await response.json();
      if (data.success) {
        success('প্রোফাইল আপডেট করা হয়েছে!');
        setIsEditing(false);
        window.location.reload();
      } else {
        error(data.error);
      }
} catch (err) {
      error('প্রোফাইল আপডেট করতে সমস্যা হয়েছে');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg overflow-hidden">
          <div className="relative h-32 bg-black/20">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 bg-white/30 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2 animate-pulse"></div>
              <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* প্রোফাইল হেডার */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg overflow-hidden">
        <div className="relative h-32 bg-black/20">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-700">
              <Crown className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        <div className="pt-16 pb-6 px-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs">
                  অ্যাডমিন
                </span>
              </div>
              <p className="text-white/80 text-sm mt-1">
                {user?.phone} • সিস্টেম অ্যাডমিনিস্ট্রেটর
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/20 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {user?.village}, ওয়ার্ড {user?.ward}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition flex items-center gap-2"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {isEditing ? 'বাতিল করুন' : 'প্রোফাইল এডিট'}
            </button>
          </div>
        </div>
      </div>

      {/* স্ট্যাটস কার্ড */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalUsers || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">মোট ইউজার</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <Wrench className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalProviders || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">প্রোভাইডার</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalReports || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">রিপোর্ট</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalBookings || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">বুকিং</div>
        </div>
      </div>

      {/* অ্যাডমিন স্ট্যাটাস সামগ্রী */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold">সিস্টেম সারসংক্ষেপ</h3>
            <p className="opacity-80 text-sm mt-1">
              {stats?.totalUsers || 0} ইউজার • {stats?.totalProviders || 0} প্রোভাইডার • {stats?.totalServices || 0} সার্ভিস
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="bg-white text-purple-700 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
          >
            অ্যাডমিন ড্যাশবোর্ড
          </Link>
        </div>
      </div>

      {/* দ্রুত লিংক */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">অ্যাডমিন ফাংশন</h2>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Users className="w-8 h-8 text-primary mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ইউজার ম্যানেজ</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{stats?.totalUsers || 0}</span>
          </Link>
          <Link
            href="/admin/providers"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Wrench className="w-8 h-8 text-secondary mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">প্রোভাইডার</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{stats?.totalProviders || 0}</span>
          </Link>
          <Link
            href="/admin/reports"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <FileText className="w-8 h-8 text-red-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">রিপোর্ট</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{stats?.totalReports || 0}</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">বুকিং</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{stats?.totalBookings || 0}</span>
          </Link>
        </div>
      </div>

      {/* প্রোফাইল তথ্য */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">প্রোফাইল তথ্য</h2>
        </div>
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">পূর্ণ নাম</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">গ্রামের নাম</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">ওয়ার্ড নম্বর</label>
                <input
                  type="number"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition">
                  <Save className="w-4 h-4" />
                  সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                >
                  <X className="w-4 h-4" />
                  বাতিল
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">পূর্ণ নাম</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">মোবাইল নম্বর</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{user?.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">গ্রামের নাম</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{user?.village}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">ওয়ার্ড নম্বর</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{user?.ward}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">রোল</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">অ্যাডমিন</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">জয়েন তারিখ</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {new Date(user?.createdAt || '').toLocaleDateString('bn-BD')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* অ্যাকশন বাটন */}
      <div className="flex gap-4">
        <Link
          href="/admin/dashboard"
          className="flex-1 bg-primary dark:bg-primary-dark text-white py-3 rounded-lg text-center font-semibold hover:bg-primary-dark dark:hover:bg-primary transition"
        >
          ড্যাশবোর্ডে যান
        </Link>
        <button
          onClick={logout}
          className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          লগআউট
        </button>
      </div>
    </div>
  );
}