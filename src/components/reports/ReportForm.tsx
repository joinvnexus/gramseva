'use client';

import { useState } from 'react';
import { MapPin, Droplets, Zap, FileText, ImagePlus, Navigation, Loader2, CheckCircle } from 'lucide-react';

interface ReportFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

const problemTypes = [
  { value: 'ROAD', label: 'রাস্তা', icon: MapPin },
  { value: 'WATER', label: 'পানি', icon: Droplets },
  { value: 'ELECTRICITY', label: 'বিদ্যুৎ', icon: Zap },
  { value: 'OTHER', label: 'অন্যান্য', icon: FileText },
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
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3">
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
                  ? 'bg-primary/10 dark:bg-primary/20 border-2 border-primary'
                  : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <type.icon className={`w-8 h-8 mx-auto mb-2 ${problemType === type.value ? 'text-primary' : 'text-gray-500'}`} />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* বিবরণ */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
          বিস্তারিত বিবরণ <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="যতটা সম্ভব বিস্তারিত জানান..."
          required
        />
      </div>

      {/* ছবি আপলোড */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
          ছবি (ঐচ্ছিক)
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
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
                <ImagePlus className="w-10 h-10 mb-2 text-gray-400" />
                <span className="text-primary">ছবি আপলোড করুন</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG (max 5MB)</span>
              </label>
            </>
          )}
        </div>
      </div>

{/* লোকেশন */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">লোকেশন</label>
        {location ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-3 flex justify-between items-center">
            <div>
              <span className="text-green-700 dark:text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                লোকেশন ডিটেক্ট করা হয়েছে
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ল্যাট: {location.lat.toFixed(4)}, লং: {location.lng.toFixed(4)}
              </p>
            </div>
            <button type="button" onClick={() => setLocation(null)} className="text-red-500 text-sm hover:underline">
              পরিবর্তন
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={getLocation}
            disabled={gettingLocation}
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            {gettingLocation ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                লোকেশন ডিটেক্ট করা হচ্ছে...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Navigation className="w-4 h-4" />
                আমার বর্তমান লোকেশন ব্যবহার করুন
              </span>
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
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            জমা হচ্ছে...
          </span>
        ) : (
          'রিপোর্ট জমা দিন'
        )}
      </button>
    </form>
  );
}