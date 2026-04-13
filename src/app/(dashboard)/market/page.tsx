'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Loader from '@/components/common/Loader';
import { Calendar, Clock, MapPin, Store, Search, Building2, TrendingUp, TrendingDown, ArrowRight, ArrowLeft } from 'lucide-react';

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
  market?: {
    village: string;
    marketDay: string;
  };
}

interface PriceTrend {
  product: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  unit: string;
}

interface PopularProduct {
  name: string;
  icon: string;
}

const weekDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

const popularProducts: PopularProduct[] = [
  { name: 'আলু', icon: '🥔' },
  { name: 'পেঁয়াজ', icon: '🧅' },
  { name: 'ধান', icon: '🌾' },
  { name: 'চাল', icon: '🍚' },
  { name: 'মুগ ডাল', icon: '🫘' },
  { name: 'সয়াবিন তেল', icon: '🛢️' },
];

const priceTrendsData: PriceTrend[] = [
  { product: 'আলু', currentPrice: 45, previousPrice: 40, change: 12.5, unit: 'কেজি' },
  { product: 'পেঁয়াজ', currentPrice: 60, previousPrice: 65, change: -7.7, unit: 'কেজি' },
  { product: 'চাল (সাদা)', currentPrice: 52, previousPrice: 50, change: 4, unit: 'কেজি' },
  { product: 'মুগ ডাল', currentPrice: 120, previousPrice: 115, change: 4.3, unit: 'কেজি' },
  { product: 'সয়াবিন তেল', currentPrice: 190, previousPrice: 185, change: 2.7, unit: 'লিটার' },
  { product: 'কাঁচা মরিচ', currentPrice: 200, previousPrice: 180, change: 11.1, unit: 'কেজি' },
];

const allProducts = ['আলু', 'পেঁয়াজ', 'রসুন', 'টমেটো', 'কাঁচা মরিচ', 'ধান', 'চাল', 'গম', 'মুগ ডাল', 'মসুর ডাল', 'সয়াবিন তেল', 'সূর্ণমাখন', 'চিনি', 'ময়দা', 'ব্রাউন রুটি', 'ডাল', ' চাল', ' গমের আটা'];

export default function MarketPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMarkets();
    fetchPrices();
  }, [selectedDay, selectedProduct]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      const filtered = allProducts.filter(p => p.toLowerCase().includes(value.toLowerCase()));
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product: string) => {
    setSearchQuery(product);
    setSelectedProduct(product);
    setShowSuggestions(false);
  };

  const handlePopularProductClick = (product: string) => {
    setSelectedProduct(product);
    setSearchQuery(product);
  };

  const clearPopularProductFilter = () => {
    setSelectedProduct('');
    setSearchQuery('');
  };

  const getUniqueMarketsWithPrices = () => {
    const marketMap = new Map<string, { name: string; day: string }>();
    prices.forEach(p => {
      if (p.market?.village) {
        marketMap.set(p.market.village, {
          name: p.market.village,
          day: p.market.marketDay
        });
      }
    });
    return Array.from(marketMap.values());
  };

  const today = new Date();
  const todayName = weekDays[today.getDay()];
  const todayMarkets = markets.filter(m => m.marketDay === todayName);

  const getMarketDaysForWeek = () => {
    return weekDays.map(day => {
      const dayMarkets = markets.filter(m => m.marketDay === day);
      return { day, markets: dayMarkets };
    });
  };

  return (
    <div className="space-y-6">
      {/* হেডার */}
      <div>
        <h1 className="text-2xl font-bold text-primary dark:text-primary-light">হাট বাজার ও দর</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">আপনার এলাকার হাটের দিন ও বাজার দর জানুন</p>
      </div>

      {/* Search with Autocomplete */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">পণ্য খুঁজুন</label>
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="আলু, পেঁয়াজ, ধান..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery.length > 0 && setShowSuggestions(filteredSuggestions.length > 0)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-primary focus:border-primary"
          />
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popular Products Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-primary dark:text-primary-light">জনপ্রিয় পণ্য</h2>
          {selectedProduct && (
            <button
              onClick={clearPopularProductFilter}
              className="text-sm text-secondary dark:text-secondary-light hover:underline"
            >
              মফিল্টার করুন
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {popularProducts.map((product) => (
            <button
              key={product.name}
              onClick={() => handlePopularProductClick(product.name)}
              className={`p-3 rounded-lg text-center transition ${
                selectedProduct === product.name
                  ? 'bg-primary dark:bg-primary-dark text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-secondary/20 dark:hover:bg-secondary/20'
              }`}
            >
              <span className="text-2xl block mb-1">{product.icon}</span>
              <span className="text-sm font-medium">{product.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Trends Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
        <h2 className="text-lg font-bold text-primary dark:text-primary-light mb-4">দামের উত্থান-পতন</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {priceTrendsData.map((trend) => (
            <div key={trend.product} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800 dark:text-gray-200">{trend.product}</span>
                {trend.change >= 0 ? (
                  <span className="flex items-center text-green-600 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <ArrowRight className="w-3 h-3" />
                    +{trend.change.toFixed(1)}%
                  </span>
                ) : (
                  <span className="flex items-center text-red-600 text-sm">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <ArrowLeft className="w-3 h-3" />
                    {trend.change.toFixed(1)}%
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary dark:text-primary-light">৳{trend.currentPrice}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/{trend.unit}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                গতকাল: ৳{trend.previousPrice}/{trend.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Market Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
        <h2 className="text-lg font-bold text-primary dark:text-primary-light mb-4">সাপ্তাহিক হাটের ক্যালেন্ডার</h2>
        <div className="grid grid-cols-7 gap-2">
          {getMarketDaysForWeek().map(({ day, markets }) => (
            <div
              key={day}
              className={`p-2 rounded-lg text-center ${
                day === todayName
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <div className={`font-semibold text-sm mb-1 ${day === todayName ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                {day}
              </div>
              <div className="text-xs">
                {markets.length > 0 ? (
                  <span className="text-green-600 dark:text-green-400">{markets.length}টি হাট</span>
                ) : (
                  <span className="text-gray-500">বন্ধ</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* আজকের হাট */}
      {todayMarkets.length > 0 && (
        <div className="bg-gradient-to-r from-accent to-accent-dark rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-6 h-6" />
            <h2 className="font-bold text-lg">আজকের হাট ({todayName})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayMarkets.map((market) => (
              <div key={market.id} className="bg-white/20 rounded-lg p-3">
                <p className="font-semibold">{market.village}</p>
                <p className="text-sm opacity-90 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {market.marketTime}
                </p>
                {market.location && (
                  <p className="text-sm opacity-90 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {market.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Comparison */}
      {prices.length > 0 && getUniqueMarketsWithPrices().length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
          <h2 className="text-lg font-bold text-primary dark:text-primary-light mb-4">হাট ভিত্তিক দাম তুলনা</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">পণ্য</th>
                  {getUniqueMarketsWithPrices().map((market) => (
                    <th key={market.name} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {market.name}
                      <span className="text-gray-400 text-[10px] ml-1">({market.day})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...new Set(prices.map(p => p.product))].map((product) => {
                  const productPrices = prices.filter(p => p.product === product);
                  if (productPrices.length < 2) return null;
                  return (
                    <tr key={product}>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">{product}</td>
                      {getUniqueMarketsWithPrices().map((market) => {
                        const price = productPrices.find(p => p.market?.village === market.name);
                        return (
                          <td key={market.name} className="px-4 py-3 whitespace-nowrap">
                            {price ? (
                              <span className="text-primary dark:text-primary-light font-semibold">৳{price.price}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ফিল্টার */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">হাটের দিন</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-primary focus:border-primary"
            >
              <option value="">সব দিন</option>
              {weekDays.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">পণ্যের নাম</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="যেমন: আলু, পেঁয়াজ, ধান..."
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* হাটের তালিকা */}
      <div>
        <h2 className="text-xl font-bold text-primary dark:text-primary-light mb-4">সাপ্তাহিক হাট সমূহ</h2>
        {loading ? (
          <Loader />
        ) : markets.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50">
            <Store className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">কোন হাটের তথ্য পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {markets.map((market) => (
              <div key={market.id} className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-primary dark:text-primary-light">{market.village}</h3>
                  <span className="bg-secondary/20 dark:bg-secondary/30 text-secondary dark:text-secondary-light px-2 py-1 rounded text-xs">
                    {market.marketDay}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" /> {market.marketTime}
                </p>
                {market.location && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {market.location}
                  </p>
                )}
                {market.prices.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">সর্বশেষ দর:</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
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
          <h2 className="text-xl font-bold text-primary dark:text-primary-light mb-4">বাজার দর</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">পণ্য</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">দর (৳)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">একক</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">হাট</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {prices.map((price) => (
                  <tr key={price.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">{price.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-primary dark:text-primary-light font-semibold">৳{price.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{price.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{price.market?.village}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 text-sm">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
          <h2 className="text-xl font-bold text-primary dark:text-primary-light mb-4">অ্যাডমিন প্যানেল - হাট বাজার</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {/* নতুন হাট বাজার যোগ করার মডাল */}}
              className="bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-dark dark:hover:bg-primary"
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