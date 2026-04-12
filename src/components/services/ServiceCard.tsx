'use client';

import Link from 'next/link';
import { Service } from '@/types';
import { formatCurrency } from '@/utils/bengaliHelper';
import { Zap, Wrench, Hammer, GraduationCap, Package, Star, MapPin } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

const categoryIcon: Record<string, React.ReactNode> = {
  ELECTRICIAN: <Zap className="w-5 h-5" />,
  PLUMBER: <Wrench className="w-5 h-5" />,
  MECHANIC: <Hammer className="w-5 h-5" />,
  DOCTOR: <GraduationCap className="w-5 h-5" />,
  TUTOR: <GraduationCap className="w-5 h-5" />,
  OTHER: <Package className="w-5 h-5" />,
};

const categoryName = {
  ELECTRICIAN: 'ইলেকট্রিশিয়ান',
  PLUMBER: 'মিস্ত্রি',
  MECHANIC: 'মেকানিক',
  DOCTOR: 'ডাক্তার',
  TUTOR: 'টিউটর',
  OTHER: 'অন্যান্য',
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-primary cursor-pointer">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {categoryIcon[service.category]}
              </span>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                {service.user?.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-semibold">
                {service.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="text-sm text-primary dark:text-primary-light mb-2">
            {categoryName[service.category]}
          </p>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {service.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {service.user?.village}
              </span>
            </div>
            <div className="text-primary dark:text-primary-light font-bold">
              {formatCurrency(service.hourlyRate)}/ঘন্টা
            </div>
          </div>

          {!service.isAvailable && (
            <div className="mt-2">
              <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded">
                বর্তমানে বন্ধ
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

