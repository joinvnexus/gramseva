'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import NotificationBell from './NotificationBell';
import VoiceSearch from './VoiceSearch';
import { Wrench, FileText, Store, LayoutDashboard, User, Plus, Users, LogOut, Search, Moon, Sun, Menu, X, Wheat, Bell, WifiOff } from 'lucide-react';

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
    { href: '/services', label: 'সার্ভিসেস', icon: Wrench, active: pathname === '/services' || pathname?.startsWith('/services/') },
    { href: '/reports', label: 'রিপোর্ট', icon: FileText, active: pathname === '/reports' || pathname?.startsWith('/reports/') },
    { href: '/market', label: 'হাট বাজার', icon: Store, active: pathname === '/market' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg' : 'bg-primary shadow-md'
    }`}>
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* লোগো */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Wheat className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
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
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
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
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 overflow-hidden">
                  <form onSubmit={handleSearch} className="p-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="সার্ভিস বা নাম দিয়ে খুঁজুন..."
                        className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                      <button type="submit" className="bg-primary text-white p-2 rounded-lg">
                        <Search className="w-5 h-5" />
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
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
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
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-sm max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  <svg className={`w-4 h-4 text-white transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 overflow-hidden">
                    <div className="p-3 border-b bg-gray-50 dark:bg-gray-700">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{user?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.phone}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                        user?.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                        user?.role === 'PROVIDER' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {user?.role === 'ADMIN' ? 'অ্যাডমিন' :
                         user?.role === 'PROVIDER' ? 'প্রোভাইডার' : 'ইউজার'}
                      </span>
                    </div>
                    <div className="py-2">
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>ড্যাশবোর্ড</span>
                      </Link>
                      <Link
                        href={getProfileLink()}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>প্রোফাইল</span>
                      </Link>
                      {user?.role === 'PROVIDER' && (
                        <Link
                          href="/services/new"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Plus className="w-5 h-5" />
                          <span>সার্ভিস আপডেট</span>
                        </Link>
                      )}
                      {user?.role === 'ADMIN' && (
                        <>
                          <Link
                            href="/admin/users"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Users className="w-5 h-5" />
                            <span>ইউজার ম্যানেজ</span>
                          </Link>
                          <Link
                            href="/admin/services"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Wrench className="w-5 h-5" />
                            <span>সার্ভিস ম্যানেজ</span>
                          </Link>
                          <Link
                            href="/admin/reports"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FileText className="w-5 h-5" />
                            <span>রিপোর্ট ম্যানেজ</span>
                          </Link>
                          <Link
                            href="/admin/markets"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Store className="w-5 h-5" />
                            <span>হাট বাজার</span>
                          </Link>
                        </>
                      )}
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                          router.push('/');
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left"
                      >
                        <LogOut className="w-5 h-5" />
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
          <div className="lg:hidden py-3 border-t border-white/20 animate-slideDown -mx-3 sm:mx-0 px-3 sm:px-0">
            {/* মোবাইল সার্চ */}
            <div className="mb-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="সার্চ করুন..."
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-accent"
                />
                <button type="submit" className="p-2 bg-accent text-primary rounded-lg">
                  <Search className="w-5 h-5" />
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
                  <item.icon className="w-5 h-5" />
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
                    <LayoutDashboard className="w-5 h-5" />
                    <span>ড্যাশবোর্ড</span>
                  </Link>
                  <Link
                    href={getProfileLink()}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition"
                  >
                    <User className="w-5 h-5" />
                    <span>প্রোফাইল</span>
                  </Link>
                  {user?.role === 'PROVIDER' && (
                    <Link
                      href="/services/new"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition"
                    >
                      <Plus className="w-5 h-5" />
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
                    <LogOut className="w-5 h-5" />
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
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span>{theme === 'light' ? 'ডার্ক মোড' : 'লাইট মোড'}</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* মোবাইল নিচের বার */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                item.active
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href={getDashboardLink()}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                pathname === getDashboardLink()
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs mt-1">ড্যাশ</span>
            </Link>
          )}
          <Link
            href={isAuthenticated ? getProfileLink() : '/login'}
            className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
              pathname === getProfileLink()
                ? 'text-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-primary'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">{isAuthenticated ? 'প্রোফাইল' : 'লগইন'}</span>
          </Link>
        </div>
      </div>

      {/* অফলাইন ইন্ডিকেটর */}
      {typeof window !== 'undefined' && !navigator.onLine && (
        <div className="bg-yellow-500 text-white text-center py-1 text-sm flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>আপনি অফলাইনে আছেন। কিছু ফিচার সীমিত থাকতে পারে।</span>
        </div>
      )}
    </header>
  );
}