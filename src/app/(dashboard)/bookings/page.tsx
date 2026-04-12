'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Loader from '@/components/common/Loader';
import { Calendar, Clock, MapPin, Phone, DollarSign, Inbox } from 'lucide-react';

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

const statusConfig = {
  PENDING: { label: 'বিচারাধীন', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' },
  CONFIRMED: { label: 'নিশ্চিত', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' },
  COMPLETED: { label: 'সম্পন্ন', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' },
  CANCELLED: { label: 'বাতিল', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' },
};

export default function BookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary dark:text-primary-light">আমার বুকিং</h1>

      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-8 text-center">
          <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">কোন বুকিং নেই</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">আপনি এখনও কোন সার্ভিস বুক করেননি</p>
          <Link href="/services" className="text-primary dark:text-primary-light mt-4 inline-block">
            সার্ভিস ব্রাউজ করুন →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{booking.service.user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{booking.service.category}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig[booking.status].color}`}>
                  {statusConfig[booking.status].label}
                </span>
              </div>
              <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(booking.date).toLocaleDateString('bn-BD')}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {new Date(booking.date).toLocaleTimeString('bn-BD')}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {booking.address}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  ৳{booking.service.hourlyRate}/ঘন্টা
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {booking.service.user.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}