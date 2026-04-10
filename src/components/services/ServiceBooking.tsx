// src/compomemts/services/ServiceBooking.tsx
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

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          date: `${date}T${time}`,
          address,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || 'বুকিং করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      setError('বুকিং করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">বুকিং করুন</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">সার্ভিস</label>
            <input
              type="text"
              value={serviceName}
              disabled
              className="w-full px-3 py-2 bg-gray-100 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">মূল্য</label>
            <input
              type="text"
              value={`৳${hourlyRate}/ঘন্টা`}
              disabled
              className="w-full px-3 py-2 bg-gray-100 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">তারিখ</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">সময়</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">ঠিকানা</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              placeholder="আপনার সম্পূর্ণ ঠিকানা দিন"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'বুকিং হচ্ছে...' : 'বুকিং কনফার্ম করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}