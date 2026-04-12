'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';
import { Plus, Trash2, Calendar, MapPin, Store, X } from 'lucide-react';

interface Market {
  id: string;
  village: string;
  marketDay: string;
  marketTime: string;
  location: string | null;
  isActive: boolean;
  prices: Price[];
}

interface Price {
  id: string;
  product: string;
  price: number;
  unit: string;
  date: string;
}

const weekDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

export default function AdminMarketsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [formData, setFormData] = useState({
    village: '',
    marketDay: '',
    marketTime: '',
    location: '',
  });
  const [priceData, setPriceData] = useState({
    product: '',
    price: '',
    unit: 'কেজি',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchMarkets();
  }, [isAuthenticated, user]);

  const fetchMarkets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/markets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMarkets(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/markets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert('হাট বাজার যোগ করা হয়েছে!');
        setShowAddModal(false);
        setFormData({ village: '', marketDay: '', marketTime: '', location: '' });
        fetchMarkets();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('হাট বাজার যোগ করতে সমস্যা হয়েছে');
    }
  };

  const addPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMarket) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/markets/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          marketId: selectedMarket.id,
          ...priceData,
          price: parseFloat(priceData.price),
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('দর যোগ করা হয়েছে!');
        setShowPriceModal(false);
        setPriceData({ product: '', price: '', unit: 'কেজি' });
        fetchMarkets();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('দর যোগ করতে সমস্যা হয়েছে');
    }
  };

  const toggleMarketStatus = async (marketId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/markets/${marketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await response.json();
      if (data.success) {
        alert('হাট বাজার স্ট্যাটাস আপডেট করা হয়েছে');
        fetchMarkets();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const deleteMarket = async (marketId: string) => {
    if (!confirm('হাট বাজার ডিলিট করতে চান? সব দরও ডিলিট হবে!')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/markets/${marketId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        alert('হাট বাজার ডিলিট সফল!');
        fetchMarkets();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('হাট বাজার ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-primary-light">হাট বাজার ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">হাট বাজার ও দর পরিচালনা করুন</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-dark dark:hover:bg-primary"
        >
          <Plus className="w-4 h-4 inline mr-1" /> নতুন হাট বাজার যোগ করুন
        </button>
      </div>

      {/* মার্কেট লিস্ট */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {markets.map((market) => (
          <div key={market.id} className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 overflow-hidden">
            <div className={`p-4 ${market.isActive ? 'bg-primary/5 dark:bg-primary/10' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-primary dark:text-primary-light">{market.village}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {market.marketDay}, {market.marketTime}
                    </span>
                    {market.location && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {market.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedMarket(market);
                      setShowPriceModal(true);
                    }}
                    className="bg-secondary text-white px-2 py-1 rounded text-sm hover:bg-secondary-dark"
                  >
                    + দর যোগ
                  </button>
                  <button
                    onClick={() => toggleMarketStatus(market.id, market.isActive)}
                    className={`px-2 py-1 rounded text-sm ${
                      market.isActive 
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' 
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }`}
                  >
                    {market.isActive ? 'বন্ধ করুন' : 'চালু করুন'}
                  </button>
                  <button
                    onClick={() => deleteMarket(market.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* দর লিস্ট */}
            {market.prices.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">বর্তমান দর</h4>
                <div className="grid grid-cols-2 gap-2">
                  {market.prices.slice(0, 4).map((price) => (
                    <div key={price.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{price.product}</span>
                      <span className="font-medium text-primary dark:text-primary-light">
                        ৳{price.price}/{price.unit}
                      </span>
                    </div>
                  ))}
                </div>
                {market.prices.length > 4 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                    এবং আরও {market.prices.length - 4}টি দর
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {markets.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-8 text-center text-gray-500 dark:text-gray-400">
          <Store className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
          <p>কোনো হাট বাজার নেই</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-primary dark:text-primary-light mt-2 inline-block"
          >
            প্রথম হাট বাজার যোগ করুন →
          </button>
        </div>
      )}

      {/* অ্যাড মার্কেট মডাল */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary dark:text-primary-light">নতুন হাট বাজার যোগ করুন</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 dark:text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={addMarket} className="p-4 space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">গ্রামের নাম</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">হাটের দিন</label>
                <select
                  value={formData.marketDay}
                  onChange={(e) => setFormData({ ...formData, marketDay: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  required
                >
                  <option value="">সিলেক্ট করুন</option>
                  {weekDays.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">সময়</label>
                <input
                  type="text"
                  value={formData.marketTime}
                  onChange={(e) => setFormData({ ...formData, marketTime: e.target.value })}
                  placeholder="যেমন: সকাল ১০টা - বিকাল ৫টা"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">অবস্থান (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                />
              </div>
              <button type="submit" className="w-full bg-primary dark:bg-primary-dark text-white py-2 rounded-lg hover:bg-primary-dark dark:hover:bg-primary">
                যোগ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* অ্যাড প্রাইস মডাল */}
      {showPriceModal && selectedMarket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary dark:text-primary-light">
                {selectedMarket.village} - নতুন দর যোগ করুন
              </h2>
              <button onClick={() => setShowPriceModal(false)} className="text-gray-500 dark:text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={addPrice} className="p-4 space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">পণ্যের নাম</label>
                <input
                  type="text"
                  value={priceData.product}
                  onChange={(e) => setPriceData({ ...priceData, product: e.target.value })}
                  placeholder="যেমন: আলু, পেঁয়াজ, ধান"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">মূল্য (টাকা)</label>
                <input
                  type="number"
                  value={priceData.price}
                  onChange={(e) => setPriceData({ ...priceData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">একক</label>
                <select
                  value={priceData.unit}
                  onChange={(e) => setPriceData({ ...priceData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                >
                  <option value="কেজি">কেজি</option>
                  <option value="পিস">পিস</option>
                  <option value="মন">মন</option>
                  <option value="হালি">হালি</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-primary dark:bg-primary-dark text-white py-2 rounded-lg hover:bg-primary-dark dark:hover:bg-primary">
                দর যোগ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}