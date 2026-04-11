'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';

interface Service {
  id: string;
  category: string;
  description: string;
  hourlyRate: number;
  rating: number;
  isAvailable: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    phone: string;
    village: string;
  };
}

const categoryNames: Record<string, string> = {
  ELECTRICIAN: 'ইলেকট্রিশিয়ান',
  PLUMBER: 'মিস্ত্রি',
  MECHANIC: 'মেকানিক',
  DOCTOR: 'ডাক্তার',
  TUTOR: 'টিউটর',
  OTHER: 'অন্যান্য',
};

const categoryIcons: Record<string, string> = {
  ELECTRICIAN: '⚡',
  PLUMBER: '🔧',
  MECHANIC: '🔨',
  DOCTOR: '👨‍⚕️',
  TUTOR: '📚',
  OTHER: '📦',
};

export default function AdminServicesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchServices();
  }, [isAuthenticated, user]);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/services', {
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

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
      const data = await response.json();
      if (data.success) {
        alert('সার্ভিস স্ট্যাটাস আপডেট করা হয়েছে');
        fetchServices();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm('সার্ভিসটি ডিলিট করতে চান? এই কাজ অপরিবর্তনীয়!')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        alert('সার্ভিস ডিলিট সফল!');
        fetchServices();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('সার্ভিস ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">সার্ভিস ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 mt-1">সকল সার্ভিস দেখুন ও পরিচালনা করুন</p>
        </div>
        <div className="text-sm text-gray-500">
          মোট সার্ভিস: {services.length}
        </div>
      </div>

      {/* ফিল্টার ও সার্চ */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="প্রোভাইডারের নাম বা সার্ভিস বিবরণ দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">সব ক্যাটাগরি</option>
              <option value="ELECTRICIAN">⚡ ইলেকট্রিশিয়ান</option>
              <option value="PLUMBER">🔧 মিস্ত্রি</option>
              <option value="MECHANIC">🔨 মেকানিক</option>
              <option value="DOCTOR">👨‍⚕️ ডাক্তার</option>
              <option value="TUTOR">📚 টিউটর</option>
              <option value="OTHER">📦 অন্যান্য</option>
            </select>
          </div>
        </div>
      </div>

      {/* সার্ভিস লিস্ট */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">সার্ভিস</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">প্রোভাইডার</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">মূল্য</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">রেটিং</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryIcons[service.category]}</span>
                    <div>
                      <p className="font-medium">{categoryNames[service.category]}</p>
                      <p className="text-sm text-gray-500 max-w-md truncate">
                        {service.description.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">{service.user.name}</p>
                  <p className="text-sm text-gray-500">{service.user.phone}</p>
                  <p className="text-xs text-gray-400">{service.user.village}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-primary">৳{service.hourlyRate}</span>
                  <span className="text-xs text-gray-500">/ঘন্টা</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{service.rating.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleServiceStatus(service.id, service.isAvailable)}
                    className={`px-2 py-1 rounded text-xs ${
                      service.isAvailable 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {service.isAvailable ? '✓ চালু' : '✗ বন্ধ'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteService(service.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️ ডিলিট
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredServices.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            কোনো সার্ভিস পাওয়া যায়নি
          </div>
        )}
      </div>
    </div>
  );
}