'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import Loader from '@/components/common/Loader';
import { MessageSquare, Mic, Star, Trash2, Check, X } from 'lucide-react';

interface FeedbackItem {
  id: string;
  type: string;
  content: string | null;
  audioUrl: string | null;
  rating: number | null;
  isRead: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    phone: string;
    village: string;
  } | null;
}

export default function AdminFeedbackPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { success, error } = useToast();
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'TEXT' | 'VOICE'>('ALL');
  const [filterRead, setFilterRead] = useState<'ALL' | 'READ' | 'UNREAD'>('ALL');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    fetchFeedback();
  }, [isAuthenticated, user]);

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filterType !== 'ALL') params.append('type', filterType);
      if (filterRead === 'READ') params.append('isRead', 'true');
      if (filterRead === 'UNREAD') params.append('isRead', 'false');

      const response = await fetch(`/api/feedback?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setFeedbackList(data.data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [filterType, filterRead]);

  const markAsRead = async (feedbackId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ feedbackId, isRead: true }),
      });
      const data = await response.json();
      if (data.success) {
        fetchFeedback();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    if (!confirm('এই ফিডব্যাক ডিলিট করতে চান?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/feedback?id=${feedbackId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        success('ফিডব্যাক ডিলিট সফল!');
        fetchFeedback();
      } else {
        error(data.error);
      }
    } catch (err) {
      error('ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  const unreadCount = feedbackList.filter(f => !f.isRead).length;

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-primary-light">ফিডব্যাক ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">সকল ফিডব্যাক দেখুন ও পরিচালনা করুন</p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
            {unreadCount}টি অপঠিত
          </span>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">টাইপ</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full md:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="ALL">সব টাইপ</option>
              <option value="TEXT">টেক্সট</option>
              <option value="VOICE">ভয়েস</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">স্ট্যাটাস</label>
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value as any)}
              className="w-full md:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="ALL">সব স্ট্যাটাস</option>
              <option value="UNREAD">অপঠিত</option>
              <option value="READ">পঠিত</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {feedbackList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">কোনো ফিডব্যাক পাওয়া যায়নি</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className={`p-4 ${!item.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {item.type === 'VOICE' ? (
                        <Mic className="w-5 h-5 text-primary" />
                      ) : (
                        <MessageSquare className="w-5 h-5 text-primary" />
                      )}
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {item.type === 'VOICE' ? 'ভয়েস ফিডব্যাক' : 'টেক্সট ফিডব্যাক'}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        item.isRead 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-600' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {item.isRead ? 'পঠিত' : 'অপঠিত'}
                      </span>
                    </div>

                    {item.user && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        ব্যবহারকারী: {item.user.name} ({item.user.phone}) - {item.user.village}
                      </div>
                    )}

                    {item.content && (
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{item.content}</p>
                    )}

                    {item.audioUrl && (
                      <audio controls className="w-full h-10 mb-2" src={item.audioUrl} />
                    )}

                    {item.rating !== null && item.rating !== undefined && (
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-sm text-gray-500">রেটিং:</span>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (item.rating as number)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!item.isRead && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 dark:hover:bg-green-900/50"
                        title="পঠিত হিসেবে চিহ্নিত করুন"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteFeedback(item.id)}
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50"
                      title="ডিলিট করুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}