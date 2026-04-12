'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
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
    } catch (error) {
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
        alert('প্রোফাইল আপডেট করা হয়েছে!');
        setIsEditing(false);
        window.location.reload();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('প্রোফাইল আপডেট করতে সমস্যা হয়েছে');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* প্রোফাইল হেডার */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg overflow-hidden">
        <div className="relative h-32 bg-black/20">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
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
                  <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded text-xs">
                    ✓ ভেরিফাইড
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
          <div className="text-sm text-gray-600">মোট বুকিং</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-600">{stats?.upvotedReports || 0}</div>
          <div className="text-sm text-gray-600">আপভোট</div>
        </div>
      </div>
          <div className="text-sm text-gray-600">সমাধান済み</div>
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

      {/* প্রোফাইল তথ্য */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">প্রোফাইল তথ্য</h2>
        </div>
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">পূর্ণ নাম</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">গ্রামের নাম</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">ওয়ার্ড নম্বর</label>
                <input
                  type="number"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">
                  সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  বাতিল
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">পূর্ণ নাম</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">মোবাইল নম্বর</span>
                <span className="font-medium">{user?.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">গ্রামের নাম</span>
                <span className="font-medium">{user?.village}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">ওয়ার্ড নম্বর</span>
                <span className="font-medium">{user?.ward}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">জয়েন তারিখ</span>
                <span className="font-medium">
                  {new Date(user?.createdAt || '').toLocaleDateString('bn-BD')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* প্রোভাইডার হওয়ার আমন্ত্রণ */}
      <div className="bg-gradient-to-r from-secondary to-secondary-dark rounded-lg p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold">সার্ভিস প্রোভাইডার হন!</h3>
            <p className="opacity-90 mt-1">
              আপনার দক্ষতা শেয়ার করুন এবং আয় করুন
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
          className="flex-1 bg-primary text-white py-3 rounded-lg text-center font-semibold hover:bg-primary-dark transition"
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