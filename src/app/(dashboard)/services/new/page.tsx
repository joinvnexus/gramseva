'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function NewServicePage() {
  const [formData, setFormData] = useState({
    description: '',
    hourlyRate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingService, setExistingService] = useState<any>(null);
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'PROVIDER') {
      fetchMyService();
    }
  }, [user]);

  // প্রোভাইডারের বিদ্যমান সার্ভিস fetch করুন
  const fetchMyService = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/services/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setExistingService(data.data[0]);
        setFormData({
          description: data.data[0].description,
          hourlyRate: data.data[0].hourlyRate.toString(),
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = existingService ? `/api/services/${existingService.id}` : '/api/services';
      const method = existingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: formData.description,
          hourlyRate: parseFloat(formData.hourlyRate),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(existingService ? 'সার্ভিস আপডেট করা হয়েছে!' : 'সার্ভিস যোগ করা হয়েছে!');
        router.push('/services');
      } else {
        setError(data.error || 'সার্ভিস যোগ করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      setError('সার্ভিস যোগ করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // প্রোভাইডার চেক
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (user?.role !== 'PROVIDER') {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-700">অনুমতি নেই</h2>
        <p className="text-gray-500">শুধুমাত্র প্রোভাইডাররা এই পেজ দেখতে পারেন</p>
      </div>
    );
  }

  const categoryName = {
    ELECTRICIAN: 'ইলেকট্রিশিয়ান',
    PLUMBER: 'মিস্ত্রি',
    MECHANIC: 'মেকানিক',
    DOCTOR: 'ডাক্তার',
    TUTOR: 'টিউটর',
    OTHER: 'অন্যান্য',
  }[user.providerType as string] || user.providerType;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-5">
          <h1 className="text-2xl font-bold text-white">
            {existingService ? 'সার্ভিস আপডেট করুন' : 'আমার সার্ভিস'}
          </h1>
          <p className="text-white/80 text-sm mt-1">
            আপনি একজন {categoryName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* প্রোভাইডার টাইপ দেখানো হচ্ছে (এডিট করা যাবে না) */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-gray-700 font-semibold mb-2">
              আপনার সার্ভিসের ধরন
            </label>
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {user.providerType === 'ELECTRICIAN' && '⚡'}
                {user.providerType === 'PLUMBER' && '🔧'}
                {user.providerType === 'MECHANIC' && '🔨'}
                {user.providerType === 'DOCTOR' && '👨‍⚕️'}
                {user.providerType === 'TUTOR' && '📚'}
                {user.providerType === 'OTHER' && '📦'}
              </span>
              <div>
                <div className="font-semibold text-primary">{categoryName}</div>
                <div className="text-xs text-gray-500">
                  {user.providerType === 'ELECTRICIAN' && 'বৈদ্যুতিক কাজ, ওয়্যারিং, ফ্যান রিপেয়ার'}
                  {user.providerType === 'PLUMBER' && 'পাইপ লাইন, ট্যাপ, টয়লেট রিপেয়ার'}
                  {user.providerType === 'MECHANIC' && 'মোটরসাইকেল, ইঞ্জিন, যন্ত্রপাতি মেরামত'}
                  {user.providerType === 'DOCTOR' && 'স্বাস্থ্য সেবা, চিকিৎসা পরামর্শ'}
                  {user.providerType === 'TUTOR' && 'পড়াশোনা, ক্লাস, প্রাইভেট টিউটর'}
                  {user.providerType === 'OTHER' && 'অন্যান্য সার্ভিস'}
                </div>
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ সার্ভিসের ধরন পরিবর্তন করা যাবে না। পরিবর্তন করতে চাইলে অ্যাডমিনের সাথে যোগাযোগ করুন।
            </p>
          </div>

          {/* সার্ভিসের বিবরণ */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              সার্ভিসের বিবরণ <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={`আপনার দক্ষতা ও অভিজ্ঞতা বিস্তারিত জানান...`}
              required
            />
          </div>

          {/* ঘন্টাপ্রতি মূল্য */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              ঘন্টাপ্রতি মূল্য (টাকা) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                ৳
              </span>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="যেমন: 300"
                min="50"
                step="50"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? 'সংরক্ষণ করা হচ্ছে...' : (existingService ? 'আপডেট করুন' : 'সার্ভিস যোগ করুন')}
          </button>
        </form>
      </div>
    </div>
  );
}