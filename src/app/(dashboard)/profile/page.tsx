'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const providerTypes = [
  { value: 'ELECTRICIAN', label: 'ইলেকট্রিশিয়ান', icon: '⚡', description: 'বৈদ্যুতিক কাজ, ওয়্যারিং, ফ্যান রিপেয়ার' },
  { value: 'PLUMBER', label: 'মিস্ত্রি', icon: '🔧', description: 'পাইপ লাইন, ট্যাপ, টয়লেট রিপেয়ার' },
  { value: 'MECHANIC', label: 'মেকানিক', icon: '🔨', description: 'মোটরসাইকেল, ইঞ্জিন, যন্ত্রপাতি মেরামত' },
  { value: 'DOCTOR', label: 'ডাক্তার', icon: '👨‍⚕️', description: 'স্বাস্থ্য সেবা, চিকিৎসা পরামর্শ' },
  { value: 'TUTOR', label: 'টিউটর', icon: '📚', description: 'পড়াশোনা, ক্লাস, প্রাইভেট টিউটর' },
  { value: 'OTHER', label: 'অন্যান্য', icon: '📦', description: 'অন্যান্য সার্ভিস' },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [showTypeSelection, setShowTypeSelection] = useState(false);

  const upgradeToProvider = async () => {
    if (!selectedType) {
      alert('দয়া করে একটি সার্ভিসের ধরন নির্বাচন করুন');
      return;
    }

    setUpgrading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ providerType: selectedType }),
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        window.location.reload();
      } else {
        alert(data.error || 'আপগ্রেড করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      alert('আপগ্রেড করতে সমস্যা হয়েছে');
    } finally {
      setUpgrading(false);
      setShowTypeSelection(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* প্রোফাইল হেডার */}
        <div className="h-32 bg-gradient-to-r from-primary to-primary-dark"></div>
        
        <div className="px-6 pb-6">
          <div className="flex flex-col items-center -mt-12 mb-4">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-4xl text-white">
                {user.name?.charAt(0) || '👤'}
              </div>
            </div>
            <h2 className="text-2xl font-bold mt-3">{user.name}</h2>
            <p className="text-gray-500">{user.phone}</p>
            
            {/* রোল ব্যাজ */}
            <div className="mt-2">
              {user.role === 'PROVIDER' ? (
                <div className="text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1">
                    🌟 {user.providerType} সার্ভিস প্রোভাইডার
                  </span>
                </div>
              ) : user.role === 'ADMIN' ? (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                  👑 অ্যাডমিন
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  👤 সাধারণ ইউজার
                </span>
              )}
            </div>
          </div>

          {/* তথ্য */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">📍 গ্রাম</span>
              <span className="font-medium">{user.village}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">🗺️ ওয়ার্ড নম্বর</span>
              <span className="font-medium">{user.ward}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">⭐ রেটিং</span>
              <span className="font-medium">{user.rating?.toFixed(1) || '0'} / 5</span>
            </div>
          </div>

          {/* অ্যাকশন বাটন */}
          <div className="mt-6 space-y-3">
            {user.role === 'USER' && !showTypeSelection && (
              <button
                onClick={() => setShowTypeSelection(true)}
                className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-secondary-dark transition"
              >
                🚀 সার্ভিস প্রোভাইডার হন
              </button>
            )}

            {/* প্রোভাইডার টাইপ সিলেক্ট মডাল */}
            {showTypeSelection && (
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-bold text-lg">আপনি কোন ধরনের সার্ভিস দিতে চান?</h3>
                <p className="text-sm text-gray-500">(শুধু একটি ধরন নির্বাচন করতে পারবেন)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {providerTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedType === type.value
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <div className="font-semibold">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowTypeSelection(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 rounded-lg"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={upgradeToProvider}
                    disabled={upgrading || !selectedType}
                    className="flex-1 bg-primary text-white py-2 rounded-lg disabled:opacity-50"
                  >
                    {upgrading ? 'আপগ্রেড হচ্ছে...' : 'নিশ্চিত করুন'}
                  </button>
                </div>
              </div>
            )}

            {user.role === 'PROVIDER' && (
              <button
                onClick={() => router.push('/services/new')}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                ➕ আমার সার্ভিস আপডেট করুন
              </button>
            )}

            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              লগআউট
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}