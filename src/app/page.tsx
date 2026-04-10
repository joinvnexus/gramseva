'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VoiceSearch from '@/components/common/VoiceSearch';
export default function Home() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const handleVoiceResult = (text: string) => {
    // ভয়েস কমান্ড পার্স করুন
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('মিস্ত্রি') || lowerText.includes('ইলেকট্রিশিয়ান')) {
      router.push('/services?category=ELECTRICIAN');
    } else if (lowerText.includes('ডাক্তার')) {
      router.push('/services?category=DOCTOR');
    } else if (lowerText.includes('টিউটর')) {
      router.push('/services?category=TUTOR');
    } else if (lowerText.includes('রিপোর্ট') || lowerText.includes('সমস্যা')) {
      router.push('/reports/new');
    } else if (lowerText.includes('হাট') || lowerText.includes('বাজার')) {
      router.push('/market');
    } else {
      // সাধারণ সার্চ
      router.push(`/services?search=${encodeURIComponent(text)}`);
    }
  };

  return (
    <div className="space-y-12">
      {/* হিরো সেকশন */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark rounded-2xl overflow-hidden">
        <div className="relative z-10 px-6 py-16 md:py-24 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            গ্রামের হাতে ডিজিটাল বাংলাদেশ
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            মিস্ত্রি, ডাক্তার, রিপোর্টিং, হাট বাজার - সব এক জায়গায়
          </p>
          
         {/* ভয়েস সার্চ সেন্টার */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/services')}
                className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent-dark transition"
              >
                সার্ভিস খুঁজুন
              </button>
              <button
                onClick={() => router.push('/reports/new')}
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                সমস্যা রিপোর্ট করুন
              </button>
            </div>
            
            {/* ভয়েস বাটন */}
            <div className="mt-4">
              <div className="relative">
                <VoiceSearch 
                  onResult={handleVoiceResult}
                  onListening={setIsListening}
                />
                {isListening && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-black/80 text-white px-4 py-2 rounded-full text-sm whitespace-nowrap">
                    🎤 বলুন "মিস্ত্রি", "ডাক্তার", "রিপোর্ট"...
                  </div>
                )}
              </div>
              <p className="text-sm opacity-80 mt-4">
                অথবা ভয়েসে বলুন: "মিস্ত্রি দরকার", "রাস্তা ভাঙা", "হাট বাজার"
              </p>
            </div>
          </div>


        </div>

        
        {/* ডেকোরেটিভ এলিমেন্ট */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>

      {/* ফিচার সেকশন */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
          আমাদের সার্ভিসসমূহ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card p-6 text-center hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* স্ট্যাটস সেকশন */}
      <section className="bg-secondary rounded-2xl py-12 px-6 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold">৫০০+</div>
            <div className="text-sm opacity-90">সক্রিয় ইউজার</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">১০০+</div>
            <div className="text-sm opacity-90">সার্ভিস প্রোভাইডার</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">২০০+</div>
            <div className="text-sm opacity-90">রিপোর্ট সমাধান</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold">২০+</div>
            <div className="text-sm opacity-90">গ্রাম কাভারেজ</div>
          </div>
        </div>
      </section>

      {/* CTA সেকশন */}
      <section className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">আজই যোগ দিন</h2>
        <p className="text-gray-600 mb-6">আপনার গ্রামকে ডিজিটাল করুন, পাশে থাকুন মানুষের</p>
        <Link href="/register" className="btn-primary inline-block">
          রেজিস্ট্রেশন করুন
        </Link>
      </section>
    </div>
  );
}

const features = [
  {
    icon: '🔧',
    title: 'লোকাল সার্ভিস',
    description: 'মিস্ত্রি, ইলেকট্রিশিয়ান, ডাক্তার সহ সব ধরনের সার্ভিস',
  },
  {
    icon: '📝',
    title: 'প্রবলেম রিপোর্টিং',
    description: 'রাস্তা, পানি, বিদ্যুৎ সমস্যা সরাসরি রিপোর্ট করুন',
  },
  {
    icon: '🏪',
    title: 'হাট বাজার',
    description: 'হাটের দিন ও বাজার দরের আপডেট তথ্য',
  },
  {
    icon: '🎤',
    title: 'ভয়েস সাপোর্ট',
    description: 'লিখতে না জানলেও বললেই হবে',
  },
];