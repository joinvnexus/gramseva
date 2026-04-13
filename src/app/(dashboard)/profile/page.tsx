'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg overflow-hidden">
        <div className="relative h-32 bg-black/20">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 bg-white/30 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="pt-16 pb-6 px-6">
          <div className="h-8 w-48 bg-white/30 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2 animate-pulse"></div>
            <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfileRedirectPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setShowSkeleton(false);
    
    if (user?.role === 'ADMIN') {
      router.push('/admin/profile');
    } else if (user?.role === 'PROVIDER') {
      router.push('/provider/profile');
    } else {
      router.push('/user/profile');
    }
  }, [isAuthenticated, user, router]);

  if (showSkeleton) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}