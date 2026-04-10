'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'হোম', icon: '🏠' },
    { href: '/services', label: 'সার্ভিস', icon: '🔧' },
    { href: '/reports', label: 'রিপোর্ট', icon: '📝' },
    { href: '/market', label: 'বাজার', icon: '🏪' },
    { href: '/profile', label: 'প্রোফাইল', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}