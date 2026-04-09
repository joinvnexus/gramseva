'use client';

import Link from 'next/link';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
}

const categoryIcon = {
  ELECTRICIAN: '⚡',
  PLUMBER: '🔧',
  MECHANIC: '🔨',
  DOCTOR: '👨‍⚕️',
  TUTOR: '📚',
  OTHER: '📦',
};

const categoryName = {
  ELECTRICIAN: 'ইলেকট্রিশিয়ান',
  PLUMBER: 'মিস্ত্রি',
  MECHANIC: 'মেকানিক',
  DOCTOR: 'ডাক্তার',
  TUTOR: 'টিউটর',
  OTHER: 'অন্যান্য',
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-primary cursor-pointer">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{categoryIcon[service.category]}</span>
              <h3 className="font-semibold text-lg text-gray-800">
                {service.user?.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-semibold">
                {service.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="text-sm text-primary mb-2">
            {categoryName[service.category]}
          </p>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {service.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-gray-500 text-sm">📍</span>
              <span className="text-sm text-gray-600">{service.user?.village}</span>
            </div>
            <div className="text-primary font-bold">
              ৳{service.hourlyRate}/ঘন্টা
            </div>
          </div>

          {!service.isAvailable && (
            <div className="mt-2">
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                বর্তমানে বন্ধ
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}