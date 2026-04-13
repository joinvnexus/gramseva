'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ServiceBooking from '@/components/services/ServiceBooking';
import Skeleton from '@/components/ui/Skeleton';
import { Zap, Wrench, Hammer, Stethoscope, GraduationCap, Package, Star, MapPin, Phone, CheckCircle, Shield, ArrowLeft, X, MessageCircle, Calendar, Clock, User, ChevronRight } from 'lucide-react';

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

interface SimilarService {
  id: string;
  category: string;
  hourlyRate: number;
  rating: number;
  isAvailable: boolean;
  user: {
    name: string;
    village: string;
  };
}

const categoryIcon: Record<string, React.ReactNode> = {
  ELECTRICIAN: <Zap className="w-10 h-10" />,
  PLUMBER: <Wrench className="w-10 h-10" />,
  MECHANIC: <Hammer className="w-10 h-10" />,
  DOCTOR: <Stethoscope className="w-10 h-10" />,
  TUTOR: <GraduationCap className="w-10 h-10" />,
  OTHER: <Package className="w-10 h-10" />,
};

const categoryName = {
  ELECTRICIAN: 'ইলেকট্রিশিয়ান',
  PLUMBER: 'মিস্ত্রি',
  MECHANIC: 'মেকানিক',
  DOCTOR: 'ডাক্তার',
  TUTOR: 'টিউটর',
  OTHER: 'অন্যান্য',
};

function ServiceCard({ service, onClick }: { service: SimilarService; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {categoryIcon[service.category]}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{service.user.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{service.user.village}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{service.rating.toFixed(1)}</span>
        </div>
        <span className="text-primary dark:text-primary-light font-semibold">৳{service.hourlyRate}/ঘন্টা</span>
      </div>
      {service.isAvailable ? (
        <span className="inline-block mt-2 text-xs text-green-600 dark:text-green-400">✓ সক্রিয়</span>
      ) : (
        <span className="inline-block mt-2 text-xs text-gray-500">বন্ধ</span>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center gap-3 mb-2">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
      <div className="flex justify-between">
        <Skeleton variant="text" width={50} height={16} />
        <Skeleton variant="text" width={60} height={16} />
      </div>
    </div>
  );
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarServices, setSimilarServices] = useState<SimilarService[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
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
        fetchSimilarServices(data.data.category);
      } else {
        router.push('/services');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarServices = async (category: string) => {
    try {
      const response = await fetch(`/api/services?category=${category}&limit=5&excludeId=${params.id}`);
      const data = await response.json();
      if (data.success) {
        setSimilarServices(data.data.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching similar services:', error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleCall = () => {
    if (service?.user.phone) {
      window.location.href = `tel:${service.user.phone}`;
    }
  };

  const handleMessage = () => {
    if (service?.user.phone) {
      window.location.href = `sms:${service.user.phone}`;
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

  const getRatingBreakdown = () => {
    if (!service) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    service.reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        breakdown[review.rating as keyof typeof breakdown]++;
      }
    });
    return breakdown;
  };

  const handleSimilarServiceClick = (id: string) => {
    router.push(`/services/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <Skeleton variant="text" width={100} height={24} />
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <Skeleton height={160} />
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="text" width={80} height={32} />
            </div>
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="text" width="80%" height={16} />
            <Skeleton height={48} />
          </div>
        </div>
      </div>
    );
  }

  if (!service) return null;

  const ratingBreakdown = getRatingBreakdown();
  const totalReviews = service.reviews.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* ব্যাক বাটন */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition"
      >
        <ArrowLeft className="w-4 h-4" />
        ফিরে যান
      </button>

      {/* এনহ্যান্সড হেডার */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
              {categoryIcon[service.category]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{service.user.name}</h1>
                {service.user.verified && (
                  <Shield className="w-5 h-5 text-green-400" />
                )}
              </div>
              <p className="opacity-90 mb-2">{categoryName[service.category as keyof typeof categoryName]}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {service.user.village}, ওয়ার্ড {service.user.ward}
                </div>
              </div>
            </div>
            {/* অ্যাভেইলেবিলিটি স্ট্যাটাস ব্যাজ */}
            <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
              service.isAvailable 
                ? 'bg-green-500/20 text-green-100' 
                : 'bg-red-500/20 text-red-100'
            }`}>
              {service.isAvailable ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">সক্রিয়</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  <span className="font-medium">অনুপলব্ধ</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* অ্যাকশন বাটন */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-3">
            <button
              onClick={handleCall}
              className="flex-1 flex items-center justify-center gap-2 bg-primary dark:bg-primary-dark text-white py-2.5 rounded-lg font-semibold hover:bg-primary-dark dark:hover:bg-primary transition"
            >
              <Phone className="w-5 h-5" />
              কল
            </button>
            {service.user.phone && (
              <button
                onClick={handleMessage}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary dark:bg-secondary-dark text-white py-2.5 rounded-lg font-semibold hover:bg-secondary-dark dark:hover:bg-secondary transition"
              >
                <MessageCircle className="w-5 h-5" />
                মেসেজ
              </button>
            )}
            {service.isAvailable ? (
              <button
                onClick={() => setShowBooking(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <Calendar className="w-5 h-5" />
                বুক করুন
              </button>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-2 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 py-2.5 rounded-lg text-center">
                <Calendar className="w-5 h-5" />
                বুক করুন
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{service.rating.toFixed(1)}</span>
              <span className="text-gray-500 dark:text-gray-400">({totalReviews} রিভিউ)</span>
            </div>
            <div className="text-3xl font-bold text-primary dark:text-primary-light">৳{service.hourlyRate}<span className="text-sm font-normal text-gray-500">/ঘন্টা</span></div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">সার্ভিসের বিবরণ</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{service.description}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">প্রোভাইডারের তথ্য</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
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
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                যোগদান: {new Date(service.createdAt).toLocaleDateString('bn-BD')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* রিভিউ সেকশন */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
        <h2 className="text-xl font-bold text-primary dark:text-primary-light mb-4">রিভিউ ও রেটিং</h2>
        
        {/* রেটিং ব্রেকডাউন */}
        {totalReviews > 0 && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">{service.rating.toFixed(1)}</div>
                <div className="flex justify-center mb-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{totalReviews} রিভিউ</div>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingBreakdown[star as keyof typeof ratingBreakdown];
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-3">{star}</span>
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
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
          {totalReviews === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">কোন রিভিউ নেই</p>
          ) : (
            service.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{review.user.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm ml-10">{review.comment}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 ml-10">
                  {new Date(review.createdAt).toLocaleDateString('bn-BD')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* সিমিলার সার্ভিসেস */}
      {similarServices.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary dark:text-primary-light">অনুরূপ সার্ভিস</h2>
            <button
              onClick={() => router.push(`/services?category=${service.category}`)}
              className="flex items-center gap-1 text-sm text-primary dark:text-primary-light hover:underline"
            >
              সব দেখুন
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {loadingSimilar ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {similarServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => handleSimilarServiceClick(service.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

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
