'use client';

interface CropInfo {
  name: string;
  tips: string;
}

interface AgriTipsProps {
  season: string;
  crops: CropInfo[];
}

const SEASON_ADVICE: Record<string, { icon: string; advice: string[] }> = {
  'গ্রীষ্ম': {
    icon: '☀️',
    advice: [
      'সকালে বা সন্ধ্যায় সেচ করুন, দুপুরে নয়',
      'মাটির আর্দ্রতা বজায় রাখুন মালচিং করে',
      'পোকামাকড় থেকে সবজি রক্ষা করুন জাল দিয়ে',
      'বিকেলে কীটনাশক স্প্রে করুন',
    ],
  },
  'বর্ষা': {
    icon: '🌧️',
    advice: [
      'খেত থেকে পানি নিষ্কাশন নিশ্চিত করুন',
      'ধানে ইউরিয়া সার দিন জমে যাওয়ার আগে',
      'বন্যার আগে মাটির ধারে বাঁধ দিন',
      'আলুর জমিতে পানি জমতে দেবেন না',
    ],
  },
  'শরৎ': {
    icon: '🍂',
    advice: [
      'গম বপনের আগে মাটি ভালোভাবে চাষ করুন',
      'সরিষা বপনের সময় আর্দ্রতা দেখুন',
      'শস্য ধুয়ে শুকিয়ে রাখুন সংরক্ষণের আগে',
      'ধান কাটার পর রোদে শুকান',
    ],
  },
  'শীত': {
    icon: '❄️',
    advice: [
      'কমলা ও আমে ব্লাচিং করুন ঠান্ডা থেকে',
      'সবজির খেতে পলিব্লাঙ্কিং দিন',
      'সকালে সেচ দিন বিকেলে নয়',
      'গরুর খাদ্যে প্রোটিন বাড়ান',
    ],
  },
};

const getUVAdvice = (uv: number): string[] => {
  if (uv >= 8) {
    return [
      'দুপুর ১২-৩টার মধ্যে খেতে কাজ করবেন না',
      'হাতে ও মুখে ক্রিম লাগান',
      'টুপি ও ছাতা ব্যবহার করুন',
      'পানি বেশি পান করুন',
    ];
  }
  if (uv >= 5) {
    return [
      'দুপুরে কাজ করলে ছায়ায় বিশ্রাম নিন',
      'হাসি ও মুখ ঢেকে রাখুন',
      'সকাল ১০টা বা বিকেল ৪টার পরে কাজ করুন',
    ];
  }
  return ['আজ UV কম, স্বাভাবিকভাবে কাজ করুন'];
};

export default function AgriTips({ season, crops }: AgriTipsProps) {
  const seasonAdvice = SEASON_ADVICE[season] || SEASON_ADVICE['গ্রীষ্ম'];

  return (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{seasonAdvice.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
              বর্তমান ঋতু: {season}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              এই ঋতুর কৃষি পরামর্শ
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {seasonAdvice.advice.map((advice, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl p-3"
            >
              <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
              <p className="text-gray-700 dark:text-gray-300">{advice}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🌾</span>
          <div>
            <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200">
              এই ঋতুর ফসল
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              চাষের জন্য পরামর্শ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crops.map((crop, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-amber-100 dark:border-amber-800"
            >
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                {crop.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {crop.tips}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">☀️</span>
          <div>
            <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">
              রোদে কাজের পরামর্শ
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              সুর্যের তীব্রতা সম্পর্কে সতর্কতা
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span className="text-gray-700 dark:text-gray-300">
                  সকাল ৬-১০টা: সবচেয়ে ভালো সময় খেতে কাজ করার
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span className="text-gray-700 dark:text-gray-300">
                  দুপুর ১২-৩টা: বিশ্রাম নিন, ছায়ায় থাকুন
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span className="text-gray-700 dark:text-gray-300">
                  বিকেল ৪-৬টা: আবার কাজ করার উপযুক্ত সময়
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}