'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileRedirectPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // রোল বেসড রিডাইরেক্ট
    if (user?.role === 'ADMIN') {
      router.push('/admin/profile');
    } else if (user?.role === 'PROVIDER') {
      router.push('/provider/profile');
    } else {
      router.push('/user/profile');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}