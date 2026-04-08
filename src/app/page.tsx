import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services" className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent-dark transition">
              সার্ভিস খুঁজুন
            </Link>
            <Link href="/reports/new" className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              সমস্যা রিপোর্ট করুন
            </Link>
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