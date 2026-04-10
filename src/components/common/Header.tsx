"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from './NotificationBell';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-white font-bold text-xl">GramSeva</span>
          </Link>

          {/* ডেস্কটপ মেনু */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/services"
              className="text-white hover:text-accent transition"
            >
              সার্ভিসেস
            </Link>
            <Link
              href="/reports"
              className="text-white hover:text-accent transition"
            >
              রিপোর্ট
            </Link>
            <Link
              href="/market"
              className="text-white hover:text-accent transition"
            >
              হাট বাজার
            </Link>

            {isAuthenticated && <NotificationBell />}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-white hover:bg-primary-light rounded-full transition"
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

          {/* ড্যাশবোর্ড লিংক যোগ করুন */}
{isAuthenticated && (
  <>
    <Link href="/dashboard" className="text-white hover:text-accent transition">
      ড্যাশবোর্ড
    </Link>
    <Link href="/bookings" className="text-white hover:text-accent">
      আমার বুকিং
    </Link>
    <Link href="/profile" className="text-white hover:text-accent transition">
      👤 {user?.name}
    </Link>
    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
      লগআউট
    </button>
  </>
)}
          </nav>

          {/* মোবাইল মেনু বাটন */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-white hover:bg-primary-light rounded-full transition"
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* মোবাইল মেনু */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-primary-light">
            <nav className="flex flex-col gap-3">
              <Link
                href="/services"
                className="text-white hover:text-accent transition py-2"
              >
                সার্ভিসেস
              </Link>
              <Link
                href="/reports"
                className="text-white hover:text-accent transition py-2"
              >
                রিপোর্ট
              </Link>
              <Link
                href="/market"
                className="text-white hover:text-accent transition py-2"
              >
                হাট বাজার
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="text-white hover:text-accent transition py-2"
                  >
                    প্রোফাইল
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-left"
                  >
                    লগআউট
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-accent text-primary px-4 py-2 rounded-lg text-center"
                >
                  লগইন
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
