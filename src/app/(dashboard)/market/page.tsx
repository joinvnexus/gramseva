'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Market {
  id: string;
  village: string;
  marketDay: string;
  marketTime: string;
  location: string | null;
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

export default function MarketPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMarkets();
    fetchPrices();
  }, [selectedDay, selectedProduct]);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDay) params.append('day', selectedDay);
      const response = await fetch(`/api/markets?${params.toString()}`);
      const data = await response.json();
      if (data.success) setMarkets(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrices = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedProduct) params.append('product', selectedProduct);
      const response = await fetch(`/api/markets/prices?${params.toString()}`);
      const data = await response.json();
      if (data.success) setPrices(data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // আজকের দিন বের করা
  const today = new Date();
  const todayName = weekDays[today.getDay()];
  const todayMarkets = markets.filter(m => m.marketDay === todayName);

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div>
        <h1 className="text-2xl font-bold text-primary">হাট বাজার ও দর</h1>
        <p className="text-gray-600 mt-1">আপনার এলাকার হাটের দিন ও বাজার দর জানুন</p>
      </div>

      {/* আজকের হাট */}
      {todayMarkets.length > 0 && (
        <div className="bg-gradient-to-r from-accent to-accent-dark rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📅</span>
            <h2 className="font-bold text-lg">আজকের হাট ({todayName})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayMarkets.map((market) => (
              <div key={market.id} className="bg-white/20 rounded-lg p-3">
                <p className="font-semibold">{market.village}</p>
                <p className="text-sm opacity-90">⏰ {market.marketTime}</p>
                {market.location && (
                  <p className="text-sm opacity-90">📍 {market.location}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ফিল্টার */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">হাটের দিন</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="">সব দিন</option>
              {weekDays.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পণ্যের নাম</label>
            <input
              type="text"
              placeholder="যেমন: আলু, পেঁয়াজ, ধান..."
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* হাটের তালিকা */}
      <div>
        <h2 className="text-xl font-bold text-primary mb-4">সাপ্তাহিক হাট সমূহ</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : markets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">🏪</div>
            <p className="text-gray-500">কোন হাটের তথ্য পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {markets.map((market) => (
              <div key={market.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-primary">{market.village}</h3>
                  <span className="bg-secondary/20 text-secondary px-2 py-1 rounded text-xs">
                    {market.marketDay}
                  </span>
                </div>
                <p className="text-gray-600 text-sm flex items-center gap-1 mb-2">
                  <span>⏰</span> {market.marketTime}
                </p>
                {market.location && (
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <span>📍</span> {market.location}
                  </p>
                )}
                {market.prices.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">সর্বশেষ দর:</p>
                    <p className="text-sm font-semibold">
                      {market.prices[0].product}: ৳{market.prices[0].price}/{market.prices[0].unit}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* দরের তালিকা */}
      {prices.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">বাজার দর</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">পণ্য</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">দর (৳)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">একক</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">হাট</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {prices.map((price) => (
                  <tr key={price.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{price.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-primary font-semibold">৳{price.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{price.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{price.market?.village}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {new Date(price.date).toLocaleDateString('bn-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* অ্যাডমিন প্যানেল (শুধু অ্যাডমিন) */}
      {user?.role === 'ADMIN' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-primary mb-4">অ্যাডমিন প্যানেল - হাট বাজার</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {/* নতুন হাট বাজার যোগ করার মডাল */}}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
            >
              + নতুন হাট বাজার যোগ করুন
            </button>
            <button
              onClick={() => {/* নতুন দর যোগ করার মডাল */}}
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark"
            >
              + নতুন দর যোগ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}