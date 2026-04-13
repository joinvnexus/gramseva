'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Smartphone, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Check
} from 'lucide-react';

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
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
      setError(err.message || 'OTP পাঠাতে সমস্যা হয়েছে');
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
      setError(err.message || 'OTP ভেরিফাই করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const isPhoneValid = phone.length === 11 && /^01\d{9}$/.test(phone);
  const isOtpValid = otp.length === 6;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 overflow-hidden max-w-4xl w-full">
        
        {/* Left Side - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-8 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-8xl">🏠</div>
            <div className="absolute bottom-20 right-10 text-6xl">📱</div>
            <div className="absolute top-1/2 left-1/4 text-5xl">✨</div>
          </div>
          <div className="text-center text-white z-10">
            <div className="text-7xl mb-6">🏡</div>
            <h2 className="text-3xl font-bold mb-3">গ্রামসেবায় স্বাগতম</h2>
            <p className="text-lg opacity-90">আপনার গ্রামের সেবা এখন আপনার হাতের মুঠোয়</p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="bg-white/20 rounded-full p-3">📋</div>
              <div className="bg-white/20 rounded-full p-3">💰</div>
              <div className="bg-white/20 rounded-full p-3">📊</div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary dark:text-primary-light">লগইন</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              {step === 'phone' 
                ? 'আপনার মোবাইল নম্বর দিন' 
                : `${phone.slice(0, 5)}****${phone.slice(-3)} নম্বরে পাঠানো OTP দিন`}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 flex items-start gap-2 animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP}>
              <div className="relative mb-5">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder=" "
                  className="peer w-full h-14 px-4 pt-5 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
                <label className="absolute left-4 top-5 text-gray-500 dark:text-gray-400 transition-all peer-focus:-translate-y-2 peer-focus:text-xs peer-focus:text-primary peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base cursor-text pointer-events-none">
                  মোবাইল নম্বর (১১ অঙ্ক)
                </label>
                <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {isPhoneValid && (
                <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400 text-sm">
                  <Check className="w-4 h-4" />
                  সঠিক মোবাইল নম্বর
                </div>
              )}

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  আমাকে মনে রাখুন
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !isPhoneValid}
                className="w-full h-12 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    পাঠানো হচ্ছে...
                  </>
                ) : (
                  <>
                    OTP পাঠান
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex justify-between items-center mt-4 text-sm">
                <Link href="/forgot-password" className="text-primary dark:text-primary-light hover:underline">
                  পাসওয়ার্ড ভুলে গেছি?
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className="relative mb-5">
                <input
                  type={showOtp ? "text" : "password"}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder=" "
                  className="peer w-full h-14 px-4 pt-5 pb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono text-center text-xl tracking-widest"
                  maxLength={6}
                  required
                />
                <label className="absolute left-4 top-5 text-gray-500 dark:text-gray-400 transition-all peer-focus:-translate-y-2 peer-focus:text-xs peer-focus:text-primary peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base cursor-text pointer-events-none">
                  ৬ ডিজিটের OTP কোড
                </label>
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showOtp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {isOtpValid && (
                <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400 text-sm">
                  <Check className="w-4 h-4" />
                  সঠিক OTP
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isOtpValid}
                className="w-full h-12 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ভেরিফাই করা হচ্ছে...
                  </>
                ) : (
                  <>
                    লগইন করুন
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                }}
                className="w-full mt-3 text-primary dark:text-primary-light text-sm flex items-center justify-center gap-1 hover:underline"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                ভিন্ন নম্বর ব্যবহার করুন
              </button>
            </form>
          )}

          {/* Social Login Placeholder */}
          <div className="mt-6">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 dark:text-gray-400 text-sm">অথবা</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled
                className="flex-1 h-10 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.381H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.381C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm">Facebook</span>
              </button>
              <button
                type="button"
                disabled
                className="flex-1 h-10 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm">Google</span>
              </button>
            </div>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              নতুন ইউজার?{' '}
              <Link href="/register" className="text-primary dark:text-primary-light font-semibold hover:underline">
                রেজিস্ট্রেশন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}