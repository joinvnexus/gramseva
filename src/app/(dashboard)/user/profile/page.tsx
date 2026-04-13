'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import Loader from '@/components/common/Loader';
import Link from 'next/link';
import { User, FileText, CheckCircle, Calendar, ThumbsUp, MapPin, Edit, X, Save } from 'lucide-react';

interface UserStats {
  totalReports: number;
  resolvedReports: number;
  totalBookings: number;
  completedBookings: number;
  upvotedReports: number;
}

export default function UserProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { success, error } = useToast();
  const [stats, setStats] = useState<UserStats | null>(null);
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
    if (user?.role !== 'USER') {
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
    fetchUserStats();
  }, [isAuthenticated, user]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/stats', {
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
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg overflow-hidden">
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
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg overflow-hidden">
        <div className="relative h-32 bg-black/20">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-700">
              <User className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>
        <div className="pt-16 pb-6 px-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-white/80 text-sm mt-1">
                {user?.phone} • সদস্য {new Date(user?.createdAt || '').toLocaleDateString('bn-BD')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                  সাধারণ ইউজার
                </span>
                {user?.verified && (
                  <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> ভেরিফাইড
                  </span>
                )}
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
          <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalReports || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">মোট রিপোর্ট</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.resolvedReports || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">সমাধান হয়েছে</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalBookings || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">মোট বুকিং</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.upvotedReports || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">আপভোট</div>
        </div>
      </div>

      {/* দ্রুত লিংক */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">দ্রুত লিংক</h2>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/user/reports"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <FileText className="w-8 h-8 text-primary mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">আমার রিপোর্ট</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{stats?.totalReports || 0} টি</span>
          </Link>
          <Link
            href="/user/bookings"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Calendar className="w-8 h-8 text-secondary mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">আমার বুকিং</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{stats?.totalBookings || 0} টি</span>
          </Link>
          <Link
            href="/user/saved"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <ThumbsUp className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">সংরক্ষিত</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{stats?.upvotedReports || 0} টি</span>
          </Link>
          <Link
            href="/services"
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">সার্ভিস খুঁজুন</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">সব সার্ভিস</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">ওয়ার্ড নম্বর</label>
                <input
                  type="number"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition flex items-center gap-2">
                  <Save className="w-4 h-4" /> সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> বাতিল
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
                <span className="text-gray-600 dark:text-gray-400">জয়েন তারিখ</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {new Date(user?.createdAt || '').toLocaleDateString('bn-BD')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* প্রোভাইডার হওয়ার আমন্ত্রণ */}
      <div className="bg-gradient-to-r from-secondary to-secondary-dark rounded-lg p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold">সার্ভিস প্রোভাইডার হন!</h3>
            <p className="opacity-90 mt-1">
              আপনার দক্ষতা শেয়ার করুন এবং আয় করুন
            </p>
          </div>
          <Link
            href="/profile"
            className="bg-accent text-primary px-6 py-2 rounded-lg font-semibold hover:bg-accent-dark transition"
          >
            আপগ্রেড করুন →
          </Link>
        </div>
      </div>

      {/* অ্যাকশন বাটন */}
      <div className="flex gap-4">
        <Link
          href="/user/dashboard"
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