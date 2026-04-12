'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ServiceBooking from '@/components/services/ServiceBooking';
import Loader from '@/components/common/Loader';
import { Zap, Wrench, Hammer, Stethoscope, GraduationCap, Package, Star, MapPin, Phone, CheckCircle, Shield, ArrowLeft, X } from 'lucide-react';

interface ServiceDetail {
  id: string;
  category: string;
  description: string;
  hourlyRate: number;
  rating: number;
  isAvailable: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    phone: string;
    village: string;
    ward: number;
    rating: number;
    verified: boolean;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: { name: string };
  }>;
}

const categoryIcon: Record<string, React.ReactNode> = {
  ELECTRICIAN: <Zap className="w-8 h-8" />,
  PLUMBER: <Wrench className="w-8 h-8" />,
  MECHANIC: <Hammer className="w-8 h-8" />,
  DOCTOR: <Stethoscope className="w-8 h-8" />,
  TUTOR: <GraduationCap className="w-8 h-8" />,
  OTHER: <Package className="w-8 h-8" />,
};

const categoryName = {
  ELECTRICIAN: 'ইলেকট্রিশিয়ান',
  PLUMBER: 'মিস্ত্রি',
  MECHANIC: 'মেকানিক',
  DOCTOR: 'ডাক্তার',
  TUTOR: 'টিউটর',
  OTHER: 'অন্যান্য',
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchService();
  }, [params.id]);

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setService(data.data);
      } else {
        router.push('/services');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('রিভিউ দিতে লগইন করুন');
      router.push('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/services/${params.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('রিভিউ দেওয়ার জন্য ধন্যবাদ!');
        setReviewComment('');
        setReviewRating(5);
        fetchService();
      } else {
        alert(data.error || 'রিভিউ দিতে সমস্যা হয়েছে');
      }
    } catch (error) {
      alert('রিভিউ দিতে সমস্যা হয়েছে');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!service) return null;

return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ব্যাক বাটন */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
      >
        <ArrowLeft className="w-4 h-4" />
        ফিরে যান
      </button>

      {/* সার্ভিস তথ্য */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              {categoryIcon[service.category]}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{service.user.name}</h1>
              <p className="opacity-90">{categoryName[service.category as keyof typeof categoryName]}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">{service.rating.toFixed(1)}</span>
              <span className="text-gray-500 dark:text-gray-400">({service.reviews.length} রিভিউ)</span>
            </div>
            <div className="text-2xl font-bold text-primary dark:text-primary-light">৳{service.hourlyRate}/ঘন্টা</div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">সার্ভিসের বিবরণ</h3>
            <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">প্রোভাইডারের তথ্য</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {service.user.village}, ওয়ার্ড {service.user.ward}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {service.user.phone}
              </p>
              {service.user.verified && (
                <p className="text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  ভেরিফাইড প্রোভাইডার
                </p>
              )}
            </div>
          </div>

          {service.isAvailable ? (
            <button
              onClick={() => setShowBooking(true)}
              className="w-full bg-primary dark:bg-primary-dark text-white py-3 rounded-lg font-semibold hover:bg-primary-dark dark:hover:bg-primary transition"
            >
              বুক করুন
            </button>
          ) : (
            <div className="w-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-3 rounded-lg text-center">
              বর্তমানে সার্ভিসটি বন্ধ আছে
            </div>
          )}
        </div>
      </div>

      {/* রিভিউ সেকশন */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
        <h2 className="text-xl font-bold text-primary dark:text-primary-light mb-4">রিভিউ</h2>
        
        {/* রিভিউ ফর্ম */}
        {user && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">আপনার রিভিউ দিন</h3>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">রেটিং</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`text-2xl transition ${star <= reviewRating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="আপনার মতামত দিন..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-primary focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark disabled:opacity-50 transition"
            >
              {submittingReview ? 'পাঠানো হচ্ছে...' : 'রিভিউ দিন'}
            </button>
          </form>
        )}

        {/* রিভিউ লিস্ট */}
        <div className="space-y-4">
          {service.reviews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">কোন রিভিউ নেই</p>
          ) : (
            service.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{review.user.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-700 dark:text-gray-300">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  {new Date(review.createdAt).toLocaleDateString('bn-BD')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* বুকিং মডাল */}
      {showBooking && (
        <ServiceBooking
          serviceId={service.id}
          serviceName={`${service.user.name} - ${categoryName[service.category as keyof typeof categoryName]}`}
          hourlyRate={service.hourlyRate}
          onClose={() => setShowBooking(false)}
          onSuccess={() => {
            setShowBooking(false);
            alert('বুকিং সফল হয়েছে!');
          }}
        />
      )}
    </div>
  );
}