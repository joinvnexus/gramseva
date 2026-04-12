'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import NotificationBell from './NotificationBell';
import VoiceSearch from './VoiceSearch';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // স্ক্রল ইফেক্ট
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ক্লিক আউটসাইড হ্যান্ডলার
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // রোল বেসড ড্যাশবোর্ড লিংক
  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'PROVIDER') return '/provider/dashboard';
    return '/user/dashboard';
  };

  // রোল বেসড প্রোফাইল লিংক
  const getProfileLink = () => {
    if (!user) return '/profile';
    if (user.role === 'ADMIN') return '/admin/profile';
    if (user.role === 'PROVIDER') return '/provider/profile';
    return '/user/profile';
  };

  // ভয়েস সার্চ হ্যান্ডলার
  const handleVoiceSearch = (text: string) => {
    if (text.includes('মিস্ত্রি') || text.includes('ইলেকট্রিশিয়ান')) {
      router.push('/services?category=ELECTRICIAN');
    } else if (text.includes('ডাক্তার')) {
      router.push('/services?category=DOCTOR');
    } else if (text.includes('টিউটর')) {
      router.push('/services?category=TUTOR');
    } else if (text.includes('রিপোর্ট') || text.includes('সমস্যা')) {
      router.push('/reports/new');
    } else if (text.includes('হাট') || text.includes('বাজার')) {
      router.push('/market');
    } else {
      router.push(`/services?search=${encodeURIComponent(text)}`);
    }
  };

  // সার্চ হ্যান্ডলার
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // নেভিগেশন আইটেম
  const navItems = [
    { href: '/services', label: 'সার্ভিসেস', icon: '🔧', active: pathname === '/services' || pathname?.startsWith('/services/') },
    { href: '/reports', label: 'রিপোর্ট', icon: '📝', active: pathname === '/reports' || pathname?.startsWith('/reports/') },
    { href: '/market', label: 'হাট বাজার', icon: '🏪', active: pathname === '/market' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg' : 'bg-primary shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* লোগো */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span className="text-3xl transition-transform group-hover:scale-110 inline-block">
                🌾
              </span>
              <span className="absolute -top-1 -right-2 text-xs animate-ping opacity-0 group-hover:opacity-100">✨</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl md:text-2xl">GramSeva</span>
              <span className="hidden md:inline-block text-accent text-sm ml-1">মাটি ও মানুষ</span>
            </div>
          </Link>

          {/* ডেস্কটপ নেভিগেশন */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  item.active
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.active && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* ডেস্কটপ রাইট সেকশন */}
          <div className="hidden lg:flex items-center gap-3">
            {/* সার্চ বাটন */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-full transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
                  <form onSubmit={handleSearch} className="p-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="সার্ভিস বা নাম দিয়ে খুঁজুন..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                      <button type="submit" className="bg-primary text-white px-3 py-2 rounded-lg">
                        🔍
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* ভয়েস সার্চ */}
            <VoiceSearch onResult={handleVoiceSearch} />

            {/* থিম টগল */}
            <button
              onClick={toggleTheme}
              className="p-2 text-white hover:bg-white/10 rounded-full transition"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* নোটিফিকেশন */}
            {isAuthenticated && <NotificationBell />}

            {/* ইউজার মেনু */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition group"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || '👤'}
                  </div>
                  <span className="text-white text-sm max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  <svg className={`w-4 h-4 text-white transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-3 border-b bg-gray-50">
                      <p className="font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.phone}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                        user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        user?.role === 'PROVIDER' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user?.role === 'ADMIN' ? 'অ্যাডমিন' :
                         user?.role === 'PROVIDER' ? 'প্রোভাইডার' : 'ইউজার'}
                      </span>
                    </div>
                    <div className="py-2">
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <span className="text-xl">📊</span>
                        <span>ড্যাশবোর্ড</span>
                      </Link>
                      <Link
                        href={getProfileLink()}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <span className="text-xl">👤</span>
                        <span>প্রোফাইল</span>
                      </Link>
                      {user?.role === 'PROVIDER' && (
                        <Link
                          href="/services/new"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <span className="text-xl">➕</span>
                          <span>সার্ভিস আপডেট</span>
                        </Link>
                      )}
                      {user?.role === 'ADMIN' && (
                        <>
                          <Link
                            href="/admin/users"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <span className="text-xl">👥</span>
                            <span>ইউজার ম্যানেজ</span>
                          </Link>
                          <Link
                            href="/admin/services"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <span className="text-xl">🔧</span>
                            <span>সার্ভিস ম্যানেজ</span>
                          </Link>
                          <Link
                            href="/admin/reports"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <span className="text-xl">📝</span>
                            <span>রিপোর্ট ম্যানেজ</span>
                          </Link>
                          <Link
                            href="/admin/markets"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <span className="text-xl">🏪</span>
                            <span>হাট বাজার</span>
                          </Link>
                        </>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                          router.push('/');
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition text-left"
                      >
                        <span className="text-xl">🚪</span>
                        <span>লগআউট</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition"
                >
                  লগইন
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition"
                >
                  রেজিস্ট্রার
                </Link>
              </div>
            )}
          </div>

          {/* মোবাইল মেনু বাটন */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* মোবাইলে ভয়েস সার্চ */}
            <VoiceSearch onResult={handleVoiceSearch} />
            
            {isAuthenticated && <NotificationBell />}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* মোবাইল মেনু */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20 animate-slideDown">
            {/* মোবাইল সার্চ */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="সার্চ করুন..."
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-accent"
                />
                <button type="submit" className="px-4 py-2 bg-accent text-primary rounded-lg">
                  🔍
                </button>
              </form>
            </div>

            {/* মোবাইল নেভিগেশন */}
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    item.active
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.active && (
                    <span className="ml-auto w-1.5 h-1.5 bg-accent rounded-full"></span>
                  )}
                </Link>
              ))}
              
              <hr className="my-2 border-white/20" />
              
              {isAuthenticated ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition"
                  >
                    <span className="text-xl">📊</span>
                    <span>ড্যাশবোর্ড</span>
                  </Link>
                  <Link
                    href={getProfileLink()}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition"
                  >
                    <span className="text-xl">👤</span>
                    <span>প্রোফাইল</span>
                  </Link>
                  {user?.role === 'PROVIDER' && (
                    <Link
                      href="/services/new"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition"
                    >
                      <span className="text-xl">➕</span>
                      <span>সার্ভিস আপডেট</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      router.push('/');
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-white/10 rounded-lg transition w-full text-left"
                  >
                    <span className="text-xl">🚪</span>
                    <span>লগআউট</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 text-white hover:bg-white/10 rounded-lg transition text-center"
                  >
                    লগইন
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 bg-accent text-primary rounded-lg font-semibold text-center"
                  >
                    রেজিস্ট্রার
                  </Link>
                </div>
              )}
              
              <hr className="my-2 border-white/20" />
              
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition"
              >
                <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
                <span>{theme === 'light' ? 'ডার্ক মোড' : 'লাইট মোড'}</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* মোবাইল নিচের বার */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                item.active
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href={getDashboardLink()}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                pathname === getDashboardLink()
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              <span className="text-xl">📊</span>
              <span className="text-xs mt-1">ড্যাশ</span>
            </Link>
          )}
          <Link
            href={isAuthenticated ? getProfileLink() : '/login'}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
              pathname === getProfileLink()
                ? 'text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
          >
            <span className="text-xl">👤</span>
            <span className="text-xs mt-1">{isAuthenticated ? 'প্রোফাইল' : 'লগইন'}</span>
          </Link>
        </div>
      </div>

      {/* অফলাইন ইন্ডিকেটর */}
      {typeof window !== 'undefined' && !navigator.onLine && (
        <div className="bg-yellow-500 text-white text-center py-1 text-sm">
          📡 আপনি অফলাইনে আছেন। কিছু ফিচার সীমিত থাকতে পারে।
        </div>
      )}
    </header>
  );
}