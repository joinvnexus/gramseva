'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-2xl font-bold text-primary">লগইন</h1>
          <p className="text-gray-600 mt-2">
            {step === 'phone' 
              ? 'আপনার মোবাইল নম্বর দিন' 
              : `${phone} নম্বরে পাঠানো OTP দিন`}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">মোবাইল নম্বর</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="input-field"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || phone.length !== 11}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'পাঠানো হচ্ছে...' : 'OTP পাঠান'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">OTP কোড</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6 ডিজিটের কোড"
                className="input-field"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'ভেরিফাই করা হচ্ছে...' : 'লগইন করুন'}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full mt-3 text-primary text-sm"
            >
              ← ভিন্ন নম্বর ব্যবহার করুন
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-gray-600">
            নতুন ইউজার?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}