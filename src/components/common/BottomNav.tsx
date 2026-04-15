'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Wrench, FileText, Store, Wheat, LayoutDashboard, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Role-based dashboard link (same as Header)
  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'PROVIDER') return '/provider/dashboard';
    return '/user/dashboard';
  };

  // Role-based profile link (same as Header)  
  const getProfileLink = () => {
    if (!user) return '/profile';
    if (user.role === 'ADMIN') return '/admin/profile';
    if (user.role === 'PROVIDER') return '/provider/profile';
    return '/user/profile';
  };

  const navItems = [
    { href: '/', label: 'হোম', icon: Home },
    { href: '/services', label: 'সার্ভিস', icon: Wrench },
    { href: '/weather', label: 'আবহাওয়া', icon: Wheat },
    { href: '/reports', label: 'রিপোর্ট', icon: FileText },
    { href: '/market', label: 'বাজার', icon: Store },
    { href: getDashboardLink(), label: 'ড্যাশ', icon: LayoutDashboard },
    { href: getProfileLink(), label: 'প্রোফাইল', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden z-50 pb-safe">
      <div className="flex justify-around items-center h-14 sm:h-16 px-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-1.5 px-0.5 transition",
                isActive ? "text-primary" : "text-gray-500 dark:text-gray-400 hover:text-primary"
              )}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className={cn("text-[9px] sm:text-xs mt-0.5 font-medium truncate w-full text-center", isActive && "text-primary")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
