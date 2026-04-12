'use client';

import VoiceButton from '@/components/common/VoiceButton';
import { List, Zap, Wrench, Hammer, GraduationCap, Package, Search } from 'lucide-react';

interface ServiceFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const categories = [
  { value: 'ALL', label: 'সব', icon: List },
  { value: 'ELECTRICIAN', label: 'ইলেকট্রিশিয়ান', icon: Zap },
  { value: 'PLUMBER', label: 'মিস্ত্রি', icon: Wrench },
  { value: 'MECHANIC', label: 'মেকানিক', icon: Hammer },
  { value: 'DOCTOR', label: 'ডাক্তার', icon: GraduationCap },
  { value: 'TUTOR', label: 'টিউটর', icon: GraduationCap },
  { value: 'OTHER', label: 'অন্যান্য', icon: Package },
];

export default function ServiceFilter({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}: ServiceFilterProps) {
return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* সার্চ বার */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="সার্চ বা নাম দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-4 pr-20 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <VoiceButton
              onResult={(text) => onSearchChange(text)}
              className="absolute right-10 top-1/2 -translate-y-1/2"
            />
            <span className="absolute right-3 top-2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* ক্যাটাগরি ফিল্টার */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition flex items-center gap-1 ${
                selectedCategory === cat.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
