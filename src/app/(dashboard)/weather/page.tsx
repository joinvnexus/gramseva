'use client';

import { useState, useEffect } from 'react';
import WeatherCard from '@/components/weather/WeatherCard';
import AgriTips from '@/components/agriculture/AgriTips';
import Loader from '@/components/common/Loader';

interface WeatherData {
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  current: {
    temperature: number;
    temperatureF: number;
    humidity: number;
    weatherCode: number;
    weather: string;
    icon: string;
    windSpeed: number;
    rain: number;
    uvIndex: number;
  };
  daily: Array<{
    date: string;
    day: string;
    fullDate: string;
    tempMax: number;
    tempMin: number;
    weatherCode: number;
    weather: { bn: string; icon: string };
    rain: number;
    windMax: number;
  }>;
  agriculture: {
    season: string;
    crops: Array<{ name: string; tips: string }>;
  };
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');

  const fetchWeather = async (latitude?: string, longitude?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (latitude) params.append('lat', latitude);
      if (longitude) params.append('lng', longitude);

      const response = await fetch(`/api/weather?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setWeather(data.data);
      } else {
        setError(data.error || 'তথ্য পাওয়া যায়নি');
      }
    } catch (err) {
      setError('আবহাওয়ার তথ্য লোড করতে সমস্যা হয়েছে');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(lat, lng);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">😕</span>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            তথ্য পাওয়া যায়নি
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
          <button
            onClick={() => fetchWeather()}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-primary-light">
            আবহাওয়া ও কৃষি
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            বাংলাদেশের আবহাওয়া ও কৃষি তথ্য
          </p>
        </div>
      </div>

      <form
        onSubmit={handleLocationSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          অন্য জায়গার আবহাওয়া দেখতে অক্ষাংশ ও দ্রাঘিমাংশ দিন:
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="অক্ষাংশ (_lat)"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
          />
          <input
            type="text"
            placeholder="দ্রাঘিমাংশ (_lng)"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            খুঁজুন
          </button>
        </div>
      </form>

      {weather && (
        <>
          <WeatherCard weather={weather} />

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              কৃষি পরামর্শ
            </h3>
            <AgriTips
              season={weather.agriculture.season}
              crops={weather.agriculture.crops}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3">
                <span className="text-2xl block mb-1">🌡️</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">তাপমাত্রা</p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {weather.current.temperature}°C
                </p>
              </div>
              <div className="p-3">
                <span className="text-2xl block mb-1">💧</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">আর্দ্রতা</p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {weather.current.humidity}%
                </p>
              </div>
              <div className="p-3">
                <span className="text-2xl block mb-1">🌬️</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">বাতাস</p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {weather.current.windSpeed} কি.মি.
                </p>
              </div>
              <div className="p-3">
                <span className="text-2xl block mb-1">🌧️</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">বৃষ্টি</p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {weather.current.rain} মি.মি.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}