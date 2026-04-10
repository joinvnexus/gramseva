'use client';

import { useState } from 'react';

interface ReportFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

const problemTypes = [
  { value: 'ROAD', label: 'রাস্তা', icon: '🛣️' },
  { value: 'WATER', label: 'পানি', icon: '💧' },
  { value: 'ELECTRICITY', label: 'বিদ্যুৎ', icon: '⚡' },
  { value: 'OTHER', label: 'অন্যান্য', icon: '📝' },
];

export default function ReportForm({ onSubmit, loading = false }: ReportFormProps) {
  const [problemType, setProblemType] = useState('ROAD');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGettingLocation(false);
        },
        (error) => {
          console.error('Location error:', error);
          alert('লোকেশন ডিটেক্ট করতে পারেনি');
          setGettingLocation(false);
        }
      );
    } else {
      alert('এই ব্রাউজার লোকেশন সাপোর্ট করে না');
      setGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('problemType', problemType);
    formData.append('description', description);
    if (location) {
      formData.append('lat', location.lat.toString());
      formData.append('lng', location.lng.toString());
    }
    if (image) {
      formData.append('image', image);
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* প্রবলেম টাইপ */}
      <div>
        <label className="block text-gray-700 font-semibold mb-3">
          সমস্যার ধরন <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {problemTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setProblemType(type.value)}
              className={`p-4 rounded-lg text-center transition ${
                problemType === type.value
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* বিবরণ */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          বিস্তারিত বিবরণ <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="যতটা সম্ভব বিস্তারিত জানান..."
          required
        />
      </div>

      {/* ছবি আপলোড */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          ছবি (ঐচ্ছিক)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer inline-flex flex-col items-center">
                <span className="text-4xl mb-2">📸</span>
                <span className="text-primary">ছবি আপলোড করুন</span>
                <span className="text-xs text-gray-500 mt-1">JPG, PNG (max 5MB)</span>
              </label>
            </>
          )}
        </div>
      </div>

      {/* লোকেশন */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">লোকেশন</label>
        {location ? (
          <div className="bg-green-50 border border-green-300 rounded-lg p-3 flex justify-between items-center">
            <div>
              <span className="text-green-700">✓ লোকেশন ডিটেক্ট করা হয়েছে</span>
              <p className="text-xs text-gray-500 mt-1">
                ল্যাট: {location.lat.toFixed(4)}, লং: {location.lng.toFixed(4)}
              </p>
            </div>
            <button type="button" onClick={() => setLocation(null)} className="text-red-500 text-sm">
              পরিবর্তন
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={getLocation}
            disabled={gettingLocation}
            className="w-full py-3 bg-gray-100 rounded-lg text-center hover:bg-gray-200 transition disabled:opacity-50"
          >
            {gettingLocation ? (
              <span className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                লোকেশন ডিটেক্ট করা হচ্ছে...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">📍 আমার বর্তমান লোকেশন ব্যবহার করুন</span>
            )}
          </button>
        )}
      </div>

      {/* সাবমিট বাটন */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
      >
        {loading ? 'জমা হচ্ছে...' : 'রিপোর্ট জমা দিন'}
      </button>
    </form>
  );
}