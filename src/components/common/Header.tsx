'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* লোগো */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-white font-bold text-xl">GramSeva</span>
            <span className="text-accent text-sm hidden sm:inline">মাটি ও মানুষ</span>
          </Link>

          {/* ডেস্কটপ মেনু */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-white hover:text-accent transition">
              সার্ভিসেস
            </Link>
            <Link href="/reports" className="text-white hover:text-accent transition">
              রিপোর্ট
            </Link>
            <Link href="/market" className="text-white hover:text-accent transition">
              হাট বাজার
            </Link>
            <Link href="/profile" className="text-white hover:text-accent transition">
              প্রোফাইল
            </Link>
            <button className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent-dark transition">
              লগইন
            </button>
          </nav>

          {/* মোবাইল মেনু বাটন */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* মোবাইল মেনু */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-primary-light">
            <nav className="flex flex-col gap-3">
              <Link href="/services" className="text-white hover:text-accent transition py-2">
                সার্ভিসেস
              </Link>
              <Link href="/reports" className="text-white hover:text-accent transition py-2">
                রিপোর্ট
              </Link>
              <Link href="/market" className="text-white hover:text-accent transition py-2">
                হাট বাজার
              </Link>
              <Link href="/profile" className="text-white hover:text-accent transition py-2">
                প্রোফাইল
              </Link>
              <button className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold w-full">
                লগইন
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}