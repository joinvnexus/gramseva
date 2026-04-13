'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VoiceButton from '@/components/common/VoiceButton';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Search, Wrench, Stethoscope, GraduationCap, Hammer, Truck, FileText, Store, Mic, ArrowRight, Users, Award, Zap, Calendar, Eye, CloudSun, Thermometer, AlertTriangle, Clock, Phone, MapPin } from 'lucide-react';

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
    { name: 'ইলেকট্রিশিয়ান', icon: Zap, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400', category: 'ELECTRICIAN' },
    { name: 'প্লাম্বার', icon: Hammer, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', category: 'PLUMBER' },
    { name: 'ডাক্তার', icon: Stethoscope, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', category: 'DOCTOR' },
    { name: 'টিউটর', icon: GraduationCap, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', category: 'TUTOR' },
    { name: 'মেকানিক', icon: Truck, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400', category: 'MECHANIC' },
    { name: 'গাড়ি চালক', icon: Truck, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400', category: 'DRIVER' },
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

  const recentReports = [
    { id: 1, title: 'রাস্তার বিদ্যুৎ লাইন ঝুলে পড়েছে', location: 'গ্রাম ৩, ওয়ার্ড ৫', status: 'আবেদন গৃহীত', time: '২ ঘন্টা আগে', type: 'বিদ্যুৎ' },
    { id: 2, title: 'মাটি ভাঙন রাস্তা সংস্কার প্রয়োজন', location: 'গ্রাম ১, ওয়ার্ড ২', status: 'প্রক্রিয়াধীন', time: '৫ ঘন্টা আগে', type: 'রাস্তা' },
    { id: 3, title: 'নালা পরিষ্কার প্রয়োজন', location: 'গ্রাম ২, ওয়ার্ড ৮', status: 'সমাধান হয়েছে', time: '১ দিন আগে', type: 'পরিষ্কার' },
  ];

  const quickActions = [
    { name: 'রিপোর্ট করুন', icon: AlertTriangle, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', href: '/reports/new' },
    { name: 'হাট দেখুন', icon: Store, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400', href: '/market' },
    { name: 'সার্ভিস খুঁজুন', icon: Search, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', href: '/services' },
    { name: 'যোগাযোগ', icon: Phone, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', href: '/contact' },
  ];

  const howItWorks = [
    { step: 1, icon: Search, title: 'সার্ভিস খুঁজুন', desc: 'আপনার প্রয়োজন অনুযায়ী সার্ভিস বাছাই করুন' },
    { step: 2, icon: Phone, title: 'যোগাযোগ করুন', desc: 'সরাসরি সার্ভিস প্রোভাইডারের সাথে কথা বলুন' },
    { step: 3, icon: Award, title: 'সেবা পান', desc: 'মানসম্মত সেবা নিশ্চিত করুন' },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'সমাধান হয়েছে') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'প্রক্রিয়াধীন') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  };

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
              বলুন: &quot;মিস্ত্রি দরকার&quot;, &quot;রাস্তা ভাঙা&quot;
            </p>
          </div>
        </div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card hover={false} className="border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">আজকের হাট</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">রবিবার, ১৩ এপ্রিল</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">পশু হাট</p>
                <p className="font-semibold text-gray-800 dark:text-white">বাজার চলাকালীন</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => router.push('/market')}>
                <Eye className="w-4 h-4 mr-1" />
                দেখুন
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card hover={false} className="border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">আজকের আবহাওয়া</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">গ্রামীণ এলাকা</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-6 h-6 text-orange-500" />
                <span className="text-3xl font-bold text-gray-800 dark:text-white">৩২°C</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">আংশিক মেঘলা</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">আর্দ্রতা: ৬৫%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all text-center cursor-pointer h-full flex flex-col items-center justify-center">
                <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{action.name}</span>
              </div>
            </Link>
          ))}
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">সাম্প্রতিক রিপোর্টসমূহ</h2>
          <button onClick={() => router.push('/reports')} className="text-sm text-primary font-medium hover:underline">
            সব দেখুন
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentReports.map((report) => (
            <Card key={report.id} hover={true} className="border border-gray-100 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {report.time}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">{report.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {report.location}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white mb-4">কিভাবে কাজ করে</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {howItWorks.map((item, index) => (
            <div key={index} className="relative bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-card">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {['', '১', '২', '৩'][item.step]}
              </div>
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              {index < howItWorks.length - 1 && (
                <div className="hidden sm:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
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
