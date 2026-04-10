'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    reports: 0,
    markets: 0,
  });
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
    fetchStats();
  }, [isAuthenticated, user]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setStats(data.data);
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
      <h1 className="text-2xl font-bold text-primary">অ্যাডমিন প্যানেল</h1>

      {/* স্ট্যাটস */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-primary">{stats.users}</div>
          <div className="text-sm text-gray-600">মোট ইউজার</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl mb-2">🔧</div>
          <div className="text-2xl font-bold text-primary">{stats.services}</div>
          <div className="text-sm text-gray-600">সার্ভিস</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-bold text-primary">{stats.reports}</div>
          <div className="text-sm text-gray-600">রিপোর্ট</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl mb-2">🏪</div>
          <div className="text-2xl font-bold text-primary">{stats.markets}</div>
          <div className="text-sm text-gray-600">হাট বাজার</div>
        </div>
      </div>

      {/* অ্যাডমিন মেনু */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-lg mb-4">হাট বাজার ম্যানেজ</h2>
          <button className="w-full bg-primary text-white py-2 rounded mb-2">
            নতুন হাট বাজার যোগ
          </button>
          <button className="w-full bg-secondary text-white py-2 rounded">
            দর আপডেট করুন
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-lg mb-4">নোটিফিকেশন</h2>
          <button className="w-full bg-primary text-white py-2 rounded mb-2">
            সকল ইউজারে নোটিফিকেশন পাঠান
          </button>
          <button className="w-full bg-secondary text-white py-2 rounded">
            নির্দিষ্ট ইউজারে পাঠান
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-lg mb-4">ইউজার ম্যানেজ</h2>
          <button className="w-full bg-primary text-white py-2 rounded mb-2">
            সকল ইউজার দেখুন
          </button>
          <button className="w-full bg-secondary text-white py-2 rounded">
            প্রোভাইডার ভেরিফাই করুন
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-lg mb-4">রিপোর্ট ম্যানেজ</h2>
          <button className="w-full bg-primary text-white py-2 rounded mb-2">
            পেন্ডিং রিপোর্ট দেখুন
          </button>
          <button className="w-full bg-secondary text-white py-2 rounded">
            রিপোর্ট স্ট্যাটাস আপডেট
          </button>
        </div>
      </div>
    </div>
  );
}