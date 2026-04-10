'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ServiceBooking from '@/components/services/ServiceBooking';
import Loader from '@/components/common/Loader';

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
        alert('রিভিউ দেওয়ার জন্য ধন্যবাদ!');
        setReviewComment('');
        setReviewRating(5);
        fetchService();
      } else {
        alert(data.error || 'রিভিউ দিতে সমস্যা হয়েছে');
      }
    } catch (error) {
      alert('রিভিউ দিতে সমস্যা হয়েছে');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!service) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* সার্ভিস তথ্য */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{categoryIcon[service.category as keyof typeof categoryIcon]}</span>
            <div>
              <h1 className="text-2xl font-bold">{service.user.name}</h1>
              <p className="opacity-90">{categoryName[service.category as keyof typeof categoryName]}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold">{service.rating.toFixed(1)}</span>
              <span className="text-gray-500">({service.reviews.length} রিভিউ)</span>
            </div>
            <div className="text-2xl font-bold text-primary">৳{service.hourlyRate}/ঘন্টা</div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">সার্ভিসের বিবরণ</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">প্রোভাইডারের তথ্য</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span>📍</span> {service.user.village}, ওয়ার্ড {service.user.ward}
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span> {service.user.phone}
              </p>
              {service.user.verified && (
                <p className="text-green-600 flex items-center gap-2">
                  <span>✓</span> ভেরিফাইড প্রোভাইডার
                </p>
              )}
            </div>
          </div>

          {service.isAvailable ? (
            <button
              onClick={() => setShowBooking(true)}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              বুক করুন
            </button>
          ) : (
            <div className="w-full bg-gray-200 text-gray-600 py-3 rounded-lg text-center">
              বর্তমানে সার্ভিসটি বন্ধ আছে
            </div>
          )}
        </div>
      </div>

      {/* রিভিউ সেকশন */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-primary mb-4">রিভিউ</h2>
        
        {/* রিভিউ ফর্ম */}
        {user && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">আপনার রিভিউ দিন</h3>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">রেটিং</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`text-2xl ${star <= reviewRating ? 'text-yellow-500' : 'text-gray-300'}`}
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark disabled:opacity-50"
            >
              {submittingReview ? 'পাঠানো হচ্ছে...' : 'রিভিউ দিন'}
            </button>
          </form>
        )}

        {/* রিভিউ লিস্ট */}
        <div className="space-y-4">
          {service.reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-4">কোন রিভিউ নেই</p>
          ) : (
            service.reviews.map((review) => (
              <div key={review.id} className="border-b pb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{review.user.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
                <p className="text-gray-400 text-xs mt-1">
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
            alert('বুকিং সফল হয়েছে!');
          }}
        />
      )}
    </div>
  );
}