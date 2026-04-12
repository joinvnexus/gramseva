'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';
import VoiceButton from '@/components/common/VoiceButton';
import VoiceFeedback from '@/components/feedback/VoiceFeedback';
import { uploadAudio } from '@/lib/audioUpload';
import { MessageSquare, Mic, Star, Send } from 'lucide-react';

interface FeedbackItem {
  id: string;
  type: string;
  content: string | null;
  audioUrl: string | null;
  rating: number | null;
  isRead: boolean;
  createdAt: string;
}

export default function FeedbackPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackType, setFeedbackType] = useState<'TEXT' | 'VOICE'>('TEXT');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchMyFeedback();
  }, [isAuthenticated]);

  const fetchMyFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/feedback?my=true', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setFeedbackList(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (feedbackType === 'TEXT' && !content.trim()) {
      alert('অনুগ্রহ করে ফিডব্যাক লিখুন');
      return;
    }
    if (feedbackType === 'VOICE' && !audioBlob) {
      alert('অনুগ্রহ করে ভয়েস রেকর্ড করুন');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      let audioUrl = null;
      if (audioBlob) {
        try {
          audioUrl = await uploadAudio(audioBlob);
        } catch (error) {
          console.error('Audio upload failed:', error);
          alert('অডিও আপলোড করতে সমস্যা হয়েছে');
          setSubmitting(false);
          return;
        }
      }

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: feedbackType,
          content: content || null,
          audioUrl,
          rating: rating || null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('ফিডব্যাক পাঠানো হয়েছে! ধন্যবাদ।');
        setContent('');
        setRating(0);
        setAudioBlob(null);
        setFeedbackType('TEXT');
        fetchMyFeedback();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('ফিডব্যাক পাঠাতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-primary dark:text-primary-light">ফিডব্যাক</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">আপনার মতামত আমাদের জন্য গুরুত্বপূর্ণ</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFeedbackType('TEXT')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              feedbackType === 'TEXT'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            টেক্সট
          </button>
          <button
            onClick={() => setFeedbackType('VOICE')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              feedbackType === 'VOICE'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Mic className="w-4 h-4" />
            ভয়েস
          </button>
        </div>

        {feedbackType === 'TEXT' && (
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="আপনার মতামত লিখুন..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 min-h-[120px] resize-none"
            />
            <div className="absolute bottom-3 right-3">
              <VoiceButton onResult={(text) => setContent(content + ' ' + text)} />
            </div>
          </div>
        )}

        {feedbackType === 'VOICE' && (
          <VoiceFeedback onAudioReady={setAudioBlob} />
        )}

        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">রেটিং দিন:</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={submitFeedback}
          disabled={submitting}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <Loader />
          ) : (
            <>
              <Send className="w-4 h-4" />
              পাঠান
            </>
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">আপনার ফিডব্যাক</h2>
        
        {feedbackList.length === 0 ? (
          <p className="text-center text-gray-500 py-4">কোনো ফিডব্যাক পাওয়া যায়নি</p>
        ) : (
          <div className="space-y-3">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border ${
                  item.isRead
                    ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.type === 'VOICE' ? (
                      <Mic className="w-4 h-4 text-primary" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-primary" />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.type === 'VOICE' ? 'ভয়েস ফিডব্যাক' : 'টেক্সট ফিডব্যাক'}
                    </span>
                  </div>
                  {item.rating && (
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < item.rating!
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {item.content && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.content}</p>
                )}
                
                {item.audioUrl && (
                  <audio controls className="mt-2 w-full h-8" src={item.audioUrl} />
                )}
                
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}