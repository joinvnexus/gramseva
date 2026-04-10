'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceBookingProps {
  serviceId: string;
  serviceName: string;
  hourlyRate: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ServiceBooking({
  serviceId,
  serviceName,
  hourlyRate,
  onClose,
  onSuccess,
}: ServiceBookingProps) {
  const { user, isAuthenticated } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('বুকিং করতে লগইন করুন');
      return;
    }

    if (!date || !time || !address) {
      setError('সব তথ্য পূরণ করুন');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const dateTime = new Date(`${date}T${time}`);
      
      if (dateTime < new Date()) {
        setError('অনুগ্রহ করে ভবিষ্যতের তারিখ নির্বাচন করুন');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/bookings', {  // ✅ এন্ডপয়েন্ট ঠিক করা হয়েছে
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          date: dateTime.toISOString(),
          address,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(data.message || 'বুকিং সফল হয়েছে!');
        onSuccess();
      } else {
        setError(data.error || 'বুকিং করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('বুকিং করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // আজকের তারিখ থেকে শুরু
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">বুকিং করুন</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">সার্ভিস</label>
            <input
              type="text"
              value={serviceName}
              disabled
              className="w-full px-3 py-2 bg-gray-100 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">মূল্য</label>
            <input
              type="text"
              value={`৳${hourlyRate}/ঘন্টা`}
              disabled
              className="w-full px-3 py-2 bg-gray-100 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              তারিখ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              সময় <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              ঠিকানা <span className="text-red-500">*</span>
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="আপনার সম্পূর্ণ ঠিকানা দিন"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              disabled={loading}
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition"
            >
              {loading ? 'বুকিং হচ্ছে...' : 'বুকিং কনফার্ম করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}