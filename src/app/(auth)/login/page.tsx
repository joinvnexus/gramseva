'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Smartphone, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { sendOTP, login } = useAuth();
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendOTP(phone);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'OTP পাঠাতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(phone, otp);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'OTP ভেরিফাই করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary dark:text-primary-light">লগইন</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {step === 'phone' 
              ? 'আপনার মোবাইল নম্বর দিন' 
              : `${phone} নম্বরে পাঠানো OTP দিন`}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-2 rounded mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">মোবাইল নম্বর</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full h-12 pl-11 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || phone.length !== 11}
              className="w-full h-11 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? 'পাঠানো হচ্ছে...' : 'OTP পাঠান'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">OTP কোড</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6 ডিজিটের কোড"
                  className="w-full h-12 pl-11 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  maxLength={6}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full h-11 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? 'ভেরিফাই করা হচ্ছে...' : 'লগইন করুন'}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full mt-3 text-primary dark:text-primary-light text-sm flex items-center justify-center gap-1"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              ভিন্ন নম্বর ব্যবহার করুন
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            নতুন ইউজার?{' '}
            <Link href="/register" className="text-primary dark:text-primary-light font-semibold hover:underline">
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}