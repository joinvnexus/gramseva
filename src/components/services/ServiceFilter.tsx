'use client';

interface ServiceFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const categories = [
  { value: 'ALL', label: 'সব', icon: '📋' },
  { value: 'ELECTRICIAN', label: 'ইলেকট্রিশিয়ান', icon: '⚡' },
  { value: 'PLUMBER', label: 'মিস্ত্রি', icon: '🔧' },
  { value: 'MECHANIC', label: 'মেকানিক', icon: '🔨' },
  { value: 'DOCTOR', label: 'ডাক্তার', icon: '👨‍⚕️' },
  { value: 'TUTOR', label: 'টিউটর', icon: '📚' },
  { value: 'OTHER', label: 'অন্যান্য', icon: '📦' },
];

export default function ServiceFilter({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
}: ServiceFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* সার্চ বার */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="সার্ভিস বা নাম দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}