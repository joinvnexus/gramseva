// src/app/api/weather/route.ts
import { NextRequest, NextResponse } from 'next/server';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

const BANGLADESH_DEFAULT = {
  lat: 23.8103,
  lng: 90.4125,
};

const WEATHER_CODES: Record<number, { bn: string; icon: string }> = {
  0: { bn: 'স্বচ্ছ আকাশ', icon: '☀️' },
  1: { bn: 'মূলত স্বচ্ছ', icon: '🌤️' },
  2: { bn: 'আংশিক মেঘলা', icon: '⛅' },
  3: { bn: 'মেঘাচ্ছন্ন', icon: '☁️' },
  45: { bn: 'কুয়াশা', icon: '🌫️' },
  48: { bn: 'হালকা কুয়াশা', icon: '🌫️' },
  51: { bn: 'হালকা বৃষ্টি', icon: '🌧️' },
  53: { bn: 'মাঝারি বৃষ্টি', icon: '🌧️' },
  55: { bn: 'ভারী বৃষ্টি', icon: '🌧️' },
  61: { bn: 'হালকা বৃষ্টি', icon: '🌧️' },
  63: { bn: 'মাঝারি বৃষ্টি', icon: '🌧️' },
  65: { bn: 'ভারী বৃষ্টি', icon: '🌧️' },
  71: { bn: 'হালকা বরফ', icon: '🌨️' },
  73: { bn: 'মাঝারি বরফ', icon: '🌨️' },
  75: { bn: 'ভারী বরফ', icon: '❄️' },
  77: { bn: 'বরফ দানা', icon: '🌨️' },
  80: { bn: 'হালকা বৃষ্টিসহ মেঘ', icon: '🌦️' },
  81: { bn: 'মাঝারি বৃষ্টিসহ মেঘ', icon: '🌦️' },
  82: { bn: 'ভারী বৃষ্টিসহ মেঘ', icon: '🌦️' },
  85: { bn: 'হালকি তুষারপাত', icon: '🌨️' },
  86: { bn: 'ভারী তুষারপাত', icon: '❄️' },
  95: { bn: 'বজ্রসহ বৃষ্টি', icon: '⛈️' },
  96: { bn: 'বজ্রসহ ভারী বৃষ্টি', icon: '⛈️' },
  99: { bn: 'তীব্র বজ্রসহ বৃষ্টি', icon: '⛈️' },
};

function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return 'গ্রীষ্ম';
  if (month >= 6 && month <= 9) return 'বর্ষা';
  if (month >= 10 && month <= 11) return 'শরৎ';
  return 'শীত';
}

function getSeasonAndCrops(month: number) {
  const season = getSeason(month);
  
  const cropsBySeason: Record<string, { name: string; tips: string }[]> = {
    'গ্রীষ্ম': [
      { name: 'ধান', tips: 'বপনের সময়, মাটির আর্দ্রতা বজায় রাখুন' },
      { name: 'তরমুজ', tips: 'নিয়মিত সেচ দিন, গরু থেকে রক্ষা করুন' },
      { name: 'কমলা', tips: 'পানি দেওয়া বন্ধ করুন, পাকা সময় প্রস্তুতি নিন' },
    ],
    'বর্ষা': [
      { name: 'ধান (আমন)', tips: 'লাঙ্গল দিয়ে মাটি প্রস্তুত করুন, বীজতলা তৈরি করুন' },
      { name: 'পাট', tips: 'বপনের জন্য প্রস্তুতি নিন, জাল দিয়ে আচড় কাটুন' },
      { name: 'ভুট্টা', tips: 'আর্দ্র মাটিতে লাগান, সার দিন' },
    ],
    'শরৎ': [
      { name: 'গম', tips: 'বপনের আদর্শ সময়, সেচ দিন' },
      { name: 'সরিষা', tips: 'বপনের সময়, মাটি আর্দ্র রাখুন' },
      { name: 'বাছুর', tips: 'জমি প্রস্তুত করুন, বীজ সংগ্রহ করুন' },
    ],
    'শীত': [
      { name: 'আলু', tips: 'জমি প্রস্তুত করুন, সেচ কম দিন' },
      { name: 'মটর', tips: 'বপনের সময়, পানি নিষ্কাশন নিশ্চিত করুন' },
      { name: 'বিউনি', tips: 'আর্দ্র মাটিতে লাগান, ছায়ায় রাখুন' },
    ],
  };

  return {
    season,
    crops: cropsBySeason[season] || cropsBySeason['গ্রীষ্ম'],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '') || BANGLADESH_DEFAULT.lat;
    const lng = parseFloat(searchParams.get('lng') || '') || BANGLADESH_DEFAULT.lng;

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      current: 'temperature_2m,relative_humidity_2m,weather_code,rain,wind_speed_10m,uv_index',
      daily: 'temperature_2m_max,temperature_2m_min,weather_code,rain_sum,wind_speed_10m_max',
      timezone: 'Asia/Dhaka',
      forecast_days: '7',
    });

    const response = await fetch(`${OPEN_METEO_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    
    const current = data.current;
    const daily = data.daily;
    const currentWeatherCode = current?.weather_code ?? 0;
    const weatherInfo = WEATHER_CODES[currentWeatherCode] || WEATHER_CODES[0];
    
    const now = new Date();
    const month = now.getMonth() + 1;
    const { season, crops } = getSeasonAndCrops(month);

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return {
        date: dateStr,
        day: date.toLocaleDateString('bn-BD', { weekday: 'short' }),
        fullDate: date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' }),
      };
    };

    const dailyForecast = daily.time.map((dateStr: string, index: number) => ({
      ...formatDate(dateStr),
      tempMax: Math.round(daily.temperature_2m_max[index]),
      tempMin: Math.round(daily.temperature_2m_min[index]),
      weatherCode: daily.weather_code[index],
      weather: WEATHER_CODES[daily.weather_code[index]] || WEATHER_CODES[0],
      rain: daily.rain_sum[index] ?? 0,
      windMax: daily.wind_speed_10m_max[index] ?? 0,
    }));

    const result = {
      location: {
        lat,
        lng,
        name: 'বাংলাদেশ',
      },
      current: {
        temperature: Math.round(current.temperature_2m),
        temperatureF: Math.round((current.temperature_2m * 9/5) + 32),
        humidity: Math.round(current.relative_humidity_2m),
        weatherCode: currentWeatherCode,
        weather: weatherInfo.bn,
        icon: weatherInfo.icon,
        windSpeed: Math.round(current.wind_speed_10m),
        rain: current.rain ?? 0,
        uvIndex: Math.round((current.uv_index ?? 0) * 10) / 10,
      },
      daily: dailyForecast,
      agriculture: {
        season,
        crops,
      },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { success: false, error: 'আবহাওয়ার তথ্য লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}