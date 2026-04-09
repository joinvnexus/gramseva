'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState(false);

  const upgradeToProvider = async () => {
    if (!confirm('আপনি কি সার্ভিস প্রোভাইডার হতে চান? তারপর আপনি সার্ভিস দিতে পারবেন।')) {
      return;
    }

    setUpgrading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('恭喜! আপনি এখন সার্ভিস প্রোভাইডার। এখন নতুন সার্ভিস যোগ করতে পারবেন।');
        window.location.reload();
      } else {
        alert(data.error || 'আপগ্রেড করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      alert('আপগ্রেড করতে সমস্যা হয়েছে');
    } finally {
      setUpgrading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* কভার ফটো */}
        <div className="h-32 bg-gradient-to-r from-primary to-primary-dark"></div>
        
        {/* প্রোফাইল ইনফো */}
        <div className="px-6 pb-6">
          <div className="flex flex-col items-center -mt-12 mb-4">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-4xl">
                {user.name?.charAt(0) || '👤'}
              </div>
            </div>
            <h2 className="text-2xl font-bold mt-3">{user.name}</h2>
            <p className="text-gray-500">{user.phone}</p>
            
            {/* রোল ব্যাজ */}
            <div className="mt-2">
              {user.role === 'PROVIDER' ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  🌟 সার্ভিস প্রোভাইডার
                </span>
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
            <div className="flex justify-between py-2">
              <span className="text-gray-600">✅ ভেরিফিকেশন</span>
              <span className={user.verified ? 'text-green-600' : 'text-yellow-600'}>
                {user.verified ? 'ভেরিফাইড ✓' : 'ভেরিফাইড নয়'}
              </span>
            </div>
          </div>

          {/* অ্যাকশন বাটন */}
          <div className="mt-6 space-y-3">
            {user.role === 'USER' && (
              <button
                onClick={upgradeToProvider}
                disabled={upgrading}
                className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-secondary-dark transition disabled:opacity-50"
              >
                {upgrading ? 'আপগ্রেড করা হচ্ছে...' : '🚀 সার্ভিস প্রোভাইডার হন'}
              </button>
            )}

            {user.role === 'PROVIDER' && (
              <button
                onClick={() => router.push('/services/new')}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                ➕ নতুন সার্ভিস যোগ করুন
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

      {/* যদি প্রোভাইডার হয়, তাহলে তার সার্ভিস লিস্ট দেখানো */}
      {user.role === 'PROVIDER' && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-4">আমার সার্ভিস সমূহ</h3>
          <MyServicesList />
        </div>
      )}
    </div>
  );
}

// আমার সার্ভিস লিস্ট কম্পোনেন্ট
function MyServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyServices();
  }, []);

  const fetchMyServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/services/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">লোডিং...</div>;
  if (services.length === 0) return <div className="text-center py-4 text-gray-500">কোন সার্ভিস যোগ করেননি</div>;

  return (
    <div className="space-y-3">
      {services.map((service: any) => (
        <div key={service.id} className="border rounded-lg p-3 flex justify-between items-center">
          <div>
            <p className="font-medium">{service.category}</p>
            <p className="text-sm text-gray-600">{service.description.substring(0, 50)}...</p>
            <p className="text-sm text-primary">৳{service.hourlyRate}/ঘন্টা</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleAvailability(service.id, !service.isAvailable)}
              className={`px-3 py-1 rounded text-sm ${
                service.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {service.isAvailable ? 'চালু' : 'বন্ধ'}
            </button>
            <button className="text-blue-500">✏️</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function toggleAvailability(id: string, isAvailable: boolean) {
  // এপি কল করে স্ট্যাটাস আপডেট
}