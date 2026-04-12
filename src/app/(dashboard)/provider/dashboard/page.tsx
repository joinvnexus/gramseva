'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Loader from '@/components/common/Loader';
import { toBanglaDate, formatCurrency } from '@/utils/bengaliHelper';
import { Wrench, Calendar, Star, DollarSign, Clock, CheckCircle, MapPin, Phone, User, TrendingUp, Check, X } from 'lucide-react';

interface ProviderStats {
  totalServices: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  averageRating: number;
  totalEarnings: number;
}

interface RecentBooking {
  id: string;
  date: string;
  status: string;
  user: { name: string; phone: string };
  service: { category: string; hourlyRate: number };
}

export default function ProviderDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'PROVIDER') {
      fetchProviderData();
    }
  }, [isAuthenticated, user]);

  const fetchProviderData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/provider/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
        setRecentBookings(data.data.recentBookings);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        fetchProviderData();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
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

  if (user?.role !== 'PROVIDER') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">এই পেজ শুধুমাত্র প্রোভাইডারদের জন্য</p>
        <Link href="/profile" className="text-primary dark:text-primary-light mt-2 inline-block">
          প্রোভাইডার হন →
        </Link>
      </div>
    );
  }

  if (loading) return <Loader />;

  const categoryName = {
    ELECTRICIAN: 'ইলেকট্রিশিয়ান',
    PLUMBER: 'মিস্ত্রি',
    MECHANIC: 'মেকানিক',
    DOCTOR: 'ডাক্তার',
    TUTOR: 'টিউটর',
    OTHER: 'অন্যান্য',
  }[user.providerType as string] || user.providerType;

  return (
    <div className="space-y-6">
      {/* স্বাগতম */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">স্বাগতম, {user?.name}!</h1>
            <p className="opacity-90 mt-1">
              আপনি একজন {categoryName} প্রোভাইডার
            </p>
          </div>
          <Link
            href="/services/new"
            className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent-dark transition"
          >
            সার্ভিস আপডেট করুন
          </Link>
        </div>
      </div>

      {/* স্ট্যাটস কার্ড */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <Wrench className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalServices || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">আমার সার্ভিস</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary dark:text-primary-light" />
          <div className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.totalBookings || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">মোট বুকিং</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.pendingBookings || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">বিচারাধীন</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 text-center">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(stats?.totalEarnings || 0)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">মোট আয়</div>
        </div>
      </div>

      {/* রেটিং ও স্ট্যাটাস */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">গড় রেটিং</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-2xl font-bold text-primary dark:text-primary-light">{stats?.averageRating?.toFixed(1) || 0}</span>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <Star className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">সম্পন্ন বুকিং</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.completedBookings || 0}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* সাম্প্রতিক বুকিং */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">সাম্প্রতিক বুকিং</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p>কোনো বুকিং নেই</p>
            </div>
          ) : (
            recentBookings.map((booking) => (
              <div key={booking.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{booking.user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{booking.user.phone}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {toBanglaDate(booking.date)}
                    </p>
                    <p className="text-sm text-primary dark:text-primary-light mt-1 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> {formatCurrency(booking.service.hourlyRate)}/ঘন্টা
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      booking.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                      booking.status === 'CONFIRMED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                    }`}>
                      {booking.status === 'PENDING' ? 'বিচারাধীন' :
                       booking.status === 'CONFIRMED' ? 'নিশ্চিত' : 'সম্পন্ন'}
                    </span>
                    
                    {booking.status === 'PENDING' && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                        >
                          <Check className="w-3 h-3" /> নিশ্চিত
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                          <X className="w-3 h-3" /> বাতিল
                        </button>
                      </div>
                    )}
                    
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-2 hover:bg-blue-600"
                      >
                        সম্পন্ন
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}