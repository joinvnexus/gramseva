'use client';

import Skeleton from './Skeleton';

interface StatsCardSkeletonProps {
  variant?: 'default' | 'icon-left';
}

export default function StatsCardSkeleton({ variant = 'default' }: StatsCardSkeletonProps) {
  if (variant === 'icon-left') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton width={60} height={14} className="mb-2" />
            <Skeleton width={40} height={28} />
          </div>
          <Skeleton width={32} height={32} variant="circular" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
      <Skeleton width={32} height={32} variant="circular" className="mx-auto mb-2" />
      <Skeleton width={40} height={28} className="mx-auto mb-2" />
      <Skeleton width={60} height={14} className="mx-auto" />
    </div>
  );
}