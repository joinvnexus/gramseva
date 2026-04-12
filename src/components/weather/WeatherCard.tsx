'use client';

import { Volume2 } from 'lucide-react';
import SpeakButton from '@/components/common/SpeakButton';

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

interface WeatherCardProps {
  weather: WeatherData;
  onSpeak?: (text: string) => void;
}

export default function WeatherCard({ weather, onSpeak }: WeatherCardProps) {
  const { current, daily, agriculture } = weather;

  const speakText = `বর্তমান আবহাওয়া, তাপমাত্রা ${current.temperature} ডিগ্রি সেলসিয়াস, আবহ ${current.weather}, আর্দ্রতা ${current.humidity} শতাংশ, বাতাসের গতি ${current.windSpeed} কিলোমিটার প্রতি ঘণ্টা। বর্তমান ঋতু ${agriculture.season}`;

  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    onSpeak?.(speakText);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg opacity-90">বর্তমান আবহাওয়া</p>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-6xl font-bold">{current.temperature}°</span>
              <span className="text-xl opacity-80">সে:</span>
              <span className="text-2xl opacity-80">{current.temperatureF}°ফা:</span>
            </div>
            <p className="text-xl mt-2">{current.weather}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-8xl">{current.icon}</span>
            <button
              onClick={handleSpeak}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              title="শুনুন"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-sm opacity-80">আর্দ্রতা</p>
            <p className="text-xl font-semibold">{current.humidity}%</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-sm opacity-80">বাতাস</p>
            <p className="text-xl font-semibold">{current.windSpeed} কি.মি.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-sm opacity-80">বৃষ্টি</p>
            <p className="text-xl font-semibold">{current.rain} মি.মি.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-sm opacity-80">UV সূচক</p>
            <p className="text-xl font-semibold">{current.uvIndex}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          ৭ দিনের পূর্বাভাস
        </h3>
        <div className="flex overflow-x-auto gap-3 pb-2">
          {daily.map((day, index) => (
            <div
              key={day.date}
              className={`flex-shrink-0 rounded-xl p-3 text-center min-w-[80px] ${
                index === 0 ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {index === 0 ? 'আজ' : day.day}
              </p>
              <span className="text-3xl my-2 block">{day.weather.icon}</span>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {day.tempMax}° / {day.tempMin}°
              </p>
              {day.rain > 0 && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  🌧️ {day.rain}মি.মি.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🌾</span>
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
            বর্তমান ঋতু: {agriculture.season}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agriculture.crops.map((crop, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-green-100 dark:border-green-800"
            >
              <p className="font-medium text-gray-800 dark:text-white">{crop.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{crop.tips}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}