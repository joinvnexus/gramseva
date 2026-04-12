'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/common/Loader';
import { Zap, Wrench, Hammer, GraduationCap, Package, Star, Calendar, MapPin, DollarSign, Clock, User, CheckCircle, Edit, Save, X, AlertCircle } from 'lucide-react';

interface ProviderStats {
  totalServices: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  averageRating: number;
  totalEarnings: number;
}

interface Service {
  id: string;
  category: string;
  description: string;
  hourlyRate: number;
  rating: number;
  isAvailable: boolean;
  createdAt: string;
}

const categoryNames: Record<string, string> = {
  ELECTRICIAN: 'ইলেকট্রিশিয়ান',
  PLUMBER: 'মিস্ত্রি',
  MECHANIC: 'মেকানিক',
  DOCTOR: 'ডাক্তার',
  TUTOR: 'টিউটর',
  OTHER: 'অন্যান্য',
};

const categoryIcons: Record<string, React.ReactNode> = {
  ELECTRICIAN: <Zap className="w-6 h-6" />,
  PLUMBER: <Wrench className="w-6 h-6" />,
  MECHANIC: <Hammer className="w-6 h-6" />,
  DOCTOR: <GraduationCap className="w-6 h-6" />,
  TUTOR: <GraduationCap className="w-6 h-6" />,
  OTHER: <Package className="w-6 h-6" />,
};

export default function ProviderProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    ward: '',
    description: '',
    hourlyRate: '',
  });
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'PROVIDER') {
      router.push('/');
      return;
    }
    if (user) {
      setFormData({
        name: user.name || '',
        village: user.village || '',
        ward: user.ward?.toString() || '',
        description: '',
        hourlyRate: '',
      });
    }
    fetchProviderData();
  }, [isAuthenticated, user]);

  const fetchProviderData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, servicesRes] = await Promise.all([
        fetch('/api/provider/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/services/my', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const servicesData = await servicesRes.json();

      if (statsData.success) {
        setStats(statsData.data.stats);
      }
      if (servicesData.success && servicesData.data.length > 0) {
        const service = servicesData.data[0];
        setServices(servicesData.data);
        setFormData(prev => ({
          ...prev,
          description: service.description || '',
          hourlyRate: service.hourlyRate?.toString() || '',
        }));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!services[0]) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/services/${services[0].id}`, {
        method: 'PUT',
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
        alert('সার্ভিস আপডেট করা হয়েছে!');
        setIsEditing(false);
        fetchProviderData();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('সার্ভিস আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const toggleServiceStatus = async () => {
    if (!services[0]) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/services/${services[0].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isAvailable: !services[0].isAvailable,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`সার্ভিস ${services[0].isAvailable ? 'বন্ধ' : 'চালু'} করা হয়েছে`);
        fetchProviderData();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে');
    }
  };

  if (loading) return <Loader />;

  const mainService = services[0];
  const providerTypeName = user?.providerType 
    ? categoryNames[user.providerType as string] 
    : 'প্রোভাইডার';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* প্রোফাইল হেডার */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg overflow-hidden">
        <div className="relative h-32 bg-black/20">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>
        <div className="pt-16 pb-6 px-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded text-xs">
                  প্রোভাইডার
                </span>
              </div>
              <p className="text-white/80 text-sm mt-1">
                {user?.phone} • {providerTypeName}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/20 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {user?.village}, ওয়ার্ড {user?.ward}
                </span>
                {user?.verified && (
                  <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> ভেরিফাইড
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/provider/dashboard"
                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
              >
                ড্যাশবোর্ড
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* স্ট্যাটস কার্ড */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <div className="text-2xl font-bold text-primary">{stats?.averageRating?.toFixed(1) || 0}</div>
          <div className="text-sm text-gray-600">গড় রেটিং</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary">{stats?.totalBookings || 0}</div>
          <div className="text-sm text-gray-600">মোট বুকিং</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-600">৳{stats?.totalEarnings || 0}</div>
          <div className="text-sm text-gray-600">মোট আয়</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <div className="text-2xl font-bold text-yellow-600">{stats?.pendingBookings || 0}</div>
          <div className="text-sm text-gray-600">বিচারাধীন</div>
        </div>
      </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl mb-2">📅</div>
          <div className="text-2xl font-bold text-primary">{stats?.totalBookings || 0}</div>
          <div className="text-sm text-gray-600">মোট বুকিং</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-green-600">৳{stats?.totalEarnings || 0}</div>
          <div className="text-sm text-gray-600">মোট আয়</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-2xl font-bold text-yellow-600">{stats?.pendingBookings || 0}</div>
          <div className="text-sm text-gray-600">বিচারাধীন</div>
        </div>
      </div>

      {/* আমার সার্ভিস */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">আমার সার্ভিস</h2>
          {mainService && (
            <button
              onClick={toggleServiceStatus}
              className={`px-3 py-1 rounded text-sm ${
                mainService.isAvailable 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {mainService.isAvailable ? 'সার্ভিস বন্ধ করুন' : 'সার্ভিস চালু করুন'}
            </button>
          )}
        </div>
        <div className="p-6">
          {mainService ? (
            isEditing ? (
              <form onSubmit={updateService} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">সার্ভিসের ধরন</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{categoryIcons[mainService.category]}</span>
                    <span className="font-medium">{categoryNames[mainService.category]}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">সার্ভিসের ধরন পরিবর্তন করা যাবে না</p>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">সার্ভিসের বিবরণ</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">ঘন্টাপ্রতি মূল্য (টাকা)</label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">
                    সংরক্ষণ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-4xl">{categoryIcons[mainService.category]}</span>
                  <div>
                    <h3 className="font-bold text-lg">{categoryNames[mainService.category]}</h3>
                    <p className="text-sm text-gray-500">
                      {mainService.isAvailable ? '✅ চালু আছে' : '❌ বন্ধ আছে'}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">বিবরণ</h4>
                  <p className="text-gray-600">{mainService.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">মূল্য</h4>
                    <p className="text-2xl font-bold text-primary">৳{mainService.hourlyRate}/ঘন্টা</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-semibold text-gray-700 mb-1">রেটিং</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-lg font-semibold">{mainService.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-secondary-dark transition"
                >
                  সার্ভিস আপডেট করুন
                </button>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500">আপনার কোন সার্ভিস নেই</p>
              <Link
                href="/services/new"
                className="text-primary mt-2 inline-block hover:underline"
              >
                সার্ভিস তৈরি করুন →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* প্রোফাইল তথ্য */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">প্রোফাইল তথ্য</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">পূর্ণ নাম</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">মোবাইল নম্বর</span>
              <span className="font-medium">{user?.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">গ্রামের নাম</span>
              <span className="font-medium">{user?.village}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">ওয়ার্ড নম্বর</span>
              <span className="font-medium">{user?.ward}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">সার্ভিস টাইপ</span>
              <span className="font-medium">{providerTypeName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">জয়েন তারিখ</span>
              <span className="font-medium">
                {new Date(user?.createdAt || '').toLocaleDateString('bn-BD')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* সাম্প্রতিক বুকিং */}
      {stats && stats.totalBookings > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">সাম্প্রতিক বুকিং</h2>
          </div>
          <div className="p-4">
            <Link
              href="/provider/dashboard"
              className="text-primary hover:underline text-sm"
            >
              ড্যাশবোর্ডে সব বুকিং দেখুন →
            </Link>
          </div>
        </div>
      )}

      {/* অ্যাকশন বাটন */}
      <div className="flex gap-4">
        <Link
          href="/provider/dashboard"
          className="flex-1 bg-primary text-white py-3 rounded-lg text-center font-semibold hover:bg-primary-dark transition"
        >
          ড্যাশবোর্ডে যান
        </Link>
        <button
          onClick={logout}
          className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          লগআউট
        </button>
      </div>
    </div>
  );
}