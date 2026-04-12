'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VoiceButton from '@/components/common/VoiceButton';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Search, Wrench, Stethoscope, GraduationCap, Hammer, Truck, Plane, FileText, Store, Mic, ArrowRight, Star, Clock, Users, Award } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleVoiceResult = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('মিস্ত্রি') || lowerText.includes('ইলেকট্রিশিয়ান')) {
      router.push('/services?category=ELECTRICIAN');
    } else if (lowerText.includes('ডাক্তার') || lowerText.includes('ডাক্টার')) {
      router.push('/services?category=DOCTOR');
    } else if (lowerText.includes('টিউটর') || lowerText.includes('শিক্ষক')) {
      router.push('/services?category=TUTOR');
    } else if (lowerText.includes('রিপোর্ট') || lowerText.includes('সমস্যা') || lowerText.includes('শিকার')) {
      router.push('/reports/new');
    } else if (lowerText.includes('হাট') || lowerText.includes('বাজার')) {
      router.push('/market');
    } else {
      router.push(`/services?search=${encodeURIComponent(text)}`);
    }
  };

  const categories = [
    { name: 'ইলেকট্রিশিয়ান', icon: LightningIcon, color: 'bg-yellow-100 text-yellow-600', category: 'ELECTRICIAN' },
    { name: 'প্লাম্বার', icon: Hammer, color: 'bg-blue-100 text-blue-600', category: 'PLUMBER' },
    { name: 'ডাক্তার', icon: Stethoscope, color: 'bg-red-100 text-red-600', category: 'DOCTOR' },
    { name: 'টিউটর', icon: GraduationCap, color: 'bg-purple-100 text-purple-600', category: 'TUTOR' },
    { name: 'মেকানিক', icon: Truck, color: 'bg-orange-100 text-orange-600', category: 'MECHANIC' },
    { name: 'গাড়ি চালক', icon: CarIcon, color: 'bg-green-100 text-green-600', category: 'DRIVER' },
  ];

  const features = [
    { icon: Wrench, title: 'লোকাল সার্ভিস', desc: 'মিস্ত্রি, ইলেকট্রিশিয়ান সহ সব সার্ভিস' },
    { icon: FileText, title: 'রিপোর্টিং', desc: 'গ্রামের সমস্যা সরাসরি রিপোর্ট করুন' },
    { icon: Store, title: 'হাট বাজার', desc: 'দামের আপডেট তথ্য পান' },
    { icon: Mic, title: 'ভয়েস সার্ভিস', desc: 'বললেই হবে, লিখতে হবে না' },
  ];

  const stats = [
    { value: '৫০০+', label: 'সক্রিয় ইউজার', icon: Users },
    { value: '১০০+', label: 'সার্ভিস প্রোভাইডার', icon: Wrench },
    { value: '২০০+', label: 'সমাধানকৃত সমস্যা', icon: Award },
    { value: '২০+', label: 'গ্রাম কাভারেজ', icon: Store },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 md:pb-4">
      <section className="relative bg-gradient-to-r from-primary to-primary-dark rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="relative z-10 px-6 py-12 lg:py-16 text-center text-white">
          <h1 className="text-2xl lg:text-4xl font-bold mb-3">
            গ্রামের হাতে ডিজিটাল বাংলাদেশ
          </h1>
          <p className="text-base lg:text-lg mb-6 opacity-90">
            মিস্ত্রি, ডাক্তার, রিপোর্টিং - সব এক জায়গায়
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Button onClick={() => router.push('/services')} className="bg-accent text-primary hover:bg-accent-dark">
              <Search className="w-5 h-5" />
              সার্ভিস খুঁজুন
            </Button>
            <Button onClick={() => router.push('/reports/new')} variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <FileText className="w-5 h-5" />
              রিপোর্ট করুন
            </Button>
          </div>
          
          <div className="mt-6">
            <VoiceButton onResult={handleVoiceResult} />
            <p className="text-sm opacity-80 mt-2">
              বলুন: "মিস্ত্রি দরকার", "রাস্তা ভাঙা"
            </p>
          </div>
        </div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">সার্ভিস ক্যাটাগরি</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => router.push(`/services?category=${cat.category}`)}
              className="flex flex-col items-center p-4 rounded-xl bg-white dark:bg-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center mb-2`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-secondary/10 rounded-xl p-4 text-center">
            <stat.icon className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <div className="text-2xl lg:text-3xl font-bold text-secondary">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white mb-4">আমাদের সার্ভিসসমূহ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index} hover={false} className="border border-gray-100 dark:border-gray-700">
              <CardContent className="p-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center py-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-3">আজই যোগ দিন</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-5 max-w-md mx-auto">আপনার গ্রামকে ডিজিটাল করুন, পাশে থাকুন মানুষের</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register">
            <Button>
              রেজিস্ট্রেশন করুন
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="outline">সার্ভিস দেখুন</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}