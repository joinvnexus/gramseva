'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const categories = [
  { value: 'ELECTRICIAN', label: 'ইলেকট্রিশিয়ান', icon: '⚡', description: 'বৈদ্যুতিক কাজ, ওয়্যারিং, ফ্যান রিপেয়ার ইত্যাদি' },
  { value: 'PLUMBER', label: 'মিস্ত্রি', icon: '🔧', description: 'পাইপ লাইন, ট্যাপ, টয়লেট রিপেয়ার' },
  { value: 'MECHANIC', label: 'মেকানিক', icon: '🔨', description: 'মোটরসাইকেল, ইঞ্জিন, যন্ত্রপাতি মেরামত' },
  { value: 'DOCTOR', label: 'ডাক্তার', icon: '👨‍⚕️', description: 'স্বাস্থ্য সেবা, চিকিৎসা পরামর্শ' },
  { value: 'TUTOR', label: 'টিউটর', icon: '📚', description: 'পড়াশোনা, ক্লাস, প্রাইভেট টিউটর' },
  { value: 'OTHER', label: 'অন্যান্য', icon: '📦', description: 'অন্যান্য সার্ভিস' },
];

export default function NewServicePage() {
  const [formData, setFormData] = useState({
    category: 'ELECTRICIAN',
    description: '',
    hourlyRate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // চেক করুন ইউজার PROVIDER কিনা
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (user?.role !== 'PROVIDER') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">অনুমতি নেই</h2>
          <p className="text-gray-500 mb-6">
            শুধুমাত্র সার্ভিস প্রোভাইডাররা নতুন সার্ভিস যোগ করতে পারেন।
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="btn-primary"
          >
            প্রোফাইল আপগ্রেড করুন
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ভ্যালিডেশন
    if (!formData.description.trim()) {
      setError('সার্ভিসের বিবরণ দিন');
      setLoading(false);
      return;
    }

    if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
      setError('সঠিক ঘন্টাপ্রতি মূল্য দিন');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: formData.category,
          description: formData.description,
          hourlyRate: parseFloat(formData.hourlyRate),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('সার্ভিস সফলভাবে যোগ করা হয়েছে! 🎉');
        router.push('/services');
      } else {
        setError(data.error || 'সার্ভিস যোগ করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('সার্ভিস যোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c.value === formData.category);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* হেডার */}
        <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-5">
          <h1 className="text-2xl font-bold text-white">নতুন সার্ভিস যোগ করুন</h1>
          <p className="text-white/80 text-sm mt-1">
            আপনার দক্ষতা শেয়ার করুন এবং আয় করুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* এরর মেসেজ */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* সার্ভিস ক্যাটাগরি */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              সার্ভিসের ধরন <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`p-4 rounded-lg text-left transition-all ${
                    formData.category === cat.value
                      ? 'bg-primary/10 border-2 border-primary shadow-md'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{cat.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{cat.description}</div>
                    </div>
                    {formData.category === cat.value && (
                      <span className="text-primary text-xl">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={`যেমন: আমি ${selectedCategory?.label} হিসাবে কাজ করি। আমার দক্ষতাগুলো হলো...`}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              বিস্তারিত জানান যাতে কাস্টমার বুঝতে পারে
            </p>
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
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="যেমন: 300"
                min="50"
                step="50"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              সাধারণত: ইলেকট্রিশিয়ান ২০০-৫০০৳, মিস্ত্রি ৩০০-৬০০৳, ডাক্তার ৫০০-১০০০৳
            </p>
          </div>

          {/* টিপস বক্স */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">পেশাদার টিপস</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✓ • বিস্তারিত বিবরণ দিন - কাস্টমার বুঝতে পারবে</li>
                  <li>✓ • বাস্তবসম্মত মূল্য নির্ধারণ করুন</li>
                  <li>✓ • দ্রুত সাড়া দিন - ভালো রেটিং পাবেন</li>
                  <li>✓ • কাজ শেষে কাস্টমারকে রিভিউ দিতে বলুন</li>
                </ul>
              </div>
            </div>
          </div>

          {/* বাটন */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  যোগ করা হচ্ছে...
                </span>
              ) : (
                'সার্ভিস যোগ করুন'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* প্রিভিউ সেকশন */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-700 mb-3">📋 আপনার সার্ভিস প্রিভিউ</h3>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{selectedCategory?.icon}</span>
            <div>
              <div className="font-bold text-primary">{selectedCategory?.label}</div>
              <div className="text-sm text-gray-500">ঘন্টাপ্রতি: ৳{formData.hourlyRate || '___'}</div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            {formData.description || (formData.description ? '' : 'এখানে আপনার বিবরণ দেখা যাবে...')}
          </p>
        </div>
      </div>
    </div>
  );
}