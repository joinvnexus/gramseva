'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Loader from '@/components/common/Loader';
import { Calendar, Clock, MapPin, Phone, DollarSign, Inbox, CheckCircle, XCircle, Clock3, CalendarDays, Users, X } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  address: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  service: {
    id: string;
    category: string;
    hourlyRate: number;
    user: {
      name: string;
      phone: string;
      village: string;
    };
  };
}

type FilterStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

const statusConfig = {
  PENDING: { label: 'বিচারাধীন', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200', icon: Clock3 },
  CONFIRMED: { label: 'নিশ্চিত', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200', icon: CheckCircle },
  COMPLETED: { label: 'সম্পন্ন', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200', icon: CalendarDays },
  CANCELLED: { label: 'বাতিল', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200', icon: XCircle },
};

const serviceIcons: Record<string, string> = {
  'বাড়ি পরিষ্কার': '🧹',
  'রান্না': '🍳',
  'কাপড় পরিষ্কার': '👕',
  'বাচ্চা দেখা': '👶',
  'বয়স্ক দেখা': '👴',
  'বাগান': '🌱',
  'ড্রাইভিং': '🚗',
  'ইলেকট্রিক': '⚡',
  'প্লাম্বিং': '🔧',
  'কীট নাশক': '🐛',
};

function getServiceEmoji(category: string): string {
  return serviceIcons[category] || '🛠️';
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}

function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mt-2" />
        </div>
      ))}
    </div>
  );
}

export default function BookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'PENDING').length,
      confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (filterStatus === 'ALL') return bookings;
    return bookings.filter(b => b.status === filterStatus);
  }, [bookings, filterStatus]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('আপনি কি এই বুকিং বাতিল করতে চান?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const StatCard = ({ icon: Icon, count, label, color }: { icon: React.ElementType; count: number; label: string; color: string }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow dark:shadow-gray-900/50 ${color}`}>
      <Icon className="w-6 h-6 mx-auto mb-2" />
      <p className="text-2xl font-bold text-center">{count}</p>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );

  const FilterTabs = () => {
    const tabs: { key: FilterStatus; label: string }[] = [
      { key: 'ALL', label: 'সব' },
      { key: 'PENDING', label: 'বিচারাধীন' },
      { key: 'CONFIRMED', label: 'নিশ্চিত' },
      { key: 'COMPLETED', label: 'সম্পন্ন' },
      { key: 'CANCELLED', label: 'বাতিল' },
    ];
    return (
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filterStatus === tab.key
                ? 'bg-primary text-white dark:bg-primary-light dark:text-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">বুকিং দেখতে লগইন করুন</p>
        <Link href="/login" className="text-primary dark:text-primary-light mt-2 inline-block">
          লগইন করুন →
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary dark:text-primary-light">আমার বুকিং</h1>
        <SkeletonStats />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary dark:text-primary-light">আমার বুকিং</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={CalendarDays} count={stats.total} label="মোট" color="text-gray-700 dark:text-gray-200" />
        <StatCard icon={Clock3} count={stats.pending} label="বিচারাধীন" color="text-yellow-600" />
        <StatCard icon={CheckCircle} count={stats.confirmed} label="নিশ্চিত" color="text-green-600" />
        <StatCard icon={Users} count={stats.completed} label="সম্পন্ন" color="text-blue-600" />
        <StatCard icon={XCircle} count={stats.cancelled} label="বাতিল" color="text-red-600" />
      </div>

      <FilterTabs />

      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 p-12 text-center">
          <Inbox className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">কোন বুকিং নেই</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {filterStatus === 'ALL' 
              ? 'আপনি এখনও কোন সার্ভিস বুক করেননি'
              : `${statusConfig[filterStatus as keyof typeof statusConfig]?.label || filterStatus} স্ট্যাটাসে কোন বুকিং নেই`}
          </p>
          {filterStatus === 'ALL' && (
            <Link href="/services" className="text-primary dark:text-primary-light mt-4 inline-block">
              সার্ভিস ব্রাউজ করুন →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const StatusIcon = statusConfig[booking.status].icon;
            return (
              <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900/50 p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary-light/10 dark:to-primary-light/5 rounded-xl flex items-center justify-center text-3xl">
                    {getServiceEmoji(booking.service.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{booking.service.user.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{booking.service.category}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${statusConfig[booking.status].color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig[booking.status].label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{new Date(booking.date).toLocaleDateString('bn-BD')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{new Date(booking.date).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{booking.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="truncate">৳{booking.service.hourlyRate}/ঘন্টা</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{booking.service.user.phone}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      বাতিল
                    </button>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCompleteBooking(booking.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      সম্পন্ন
                    </button>
                  )}
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="px-3 py-1.5 text-sm font-medium text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-light/10 rounded-lg hover:bg-primary/20 dark:hover:bg-primary-light/20 transition-colors"
                  >
                    বিস্তারিত
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}