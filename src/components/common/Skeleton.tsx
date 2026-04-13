'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

const styleId = 'skeleton-shimmer-styles';

interface SkeletonLoaderProps {
  className?: string;
}

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        .animate-shimmer {
          background: linear-gradient(to right, #e5e7eb 8%, #f3f4f6 18%, #e5e7eb 33%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite linear;
        }
        .dark .animate-shimmer {
          background: linear-gradient(to right, #374151 8%, #4b5563 18%, #374151 33%);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div
      className={cn(
        'animate-shimmer rounded-lg',
        className
      )}
    />
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 overflow-hidden border-l-4 border-primary">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SkeletonLoader className="w-8 h-8 rounded-full" />
            <SkeletonLoader className="h-5 w-32" />
          </div>
          <div className="flex items-center gap-1">
            <SkeletonLoader className="w-8 h-8 rounded-full" />
            <SkeletonLoader className="w-12 h-6 rounded" />
          </div>
        </div>
        <SkeletonLoader className="h-4 w-24 mb-2" />
        <SkeletonLoader className="h-4 w-full mb-1" />
        <SkeletonLoader className="h-4 w-3/4 mb-3" />
        <div className="flex items-center justify-between">
          <SkeletonLoader className="h-4 w-20" />
          <SkeletonLoader className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ReportCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <SkeletonLoader className="w-8 h-8 rounded-full" />
            <SkeletonLoader className="h-5 w-20 rounded" />
            <SkeletonLoader className="h-4 w-16" />
            <SkeletonLoader className="w-8 h-8 rounded-full ml-auto" />
          </div>
          <SkeletonLoader className="h-4 w-full mb-1" />
          <SkeletonLoader className="h-4 w-5/6 mb-3" />
          <div className="flex items-center gap-4 flex-wrap">
            <SkeletonLoader className="h-4 w-24" />
            <SkeletonLoader className="h-4 w-20" />
          </div>
          <SkeletonLoader className="h-32 w-full mt-3 rounded" />
        </div>
        <div className="flex flex-col items-center p-3">
          <SkeletonLoader className="w-5 h-5" />
          <SkeletonLoader className="h-4 w-8 mt-1" />
        </div>
      </div>
    </div>
  );
}

export function MarketCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <SkeletonLoader className="h-6 w-32" />
        <SkeletonLoader className="h-5 w-20 rounded" />
      </div>
      <SkeletonLoader className="h-4 w-24 mb-2" />
      <SkeletonLoader className="h-4 w-32" />
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <SkeletonLoader className="h-3 w-20 mb-1" />
        <SkeletonLoader className="h-4 w-40" />
      </div>
    </div>
  );
}

interface TableRowSkeletonProps {
  columns?: number;
}

export function TableRowSkeleton({ columns = 4 }: TableRowSkeletonProps) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <SkeletonLoader className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-4 py-3 text-left">
                  <SkeletonLoader className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: rows }).map((_, index) => (
              <TableRowSkeleton key={index} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SkeletonLoader;
