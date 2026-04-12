'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Bell, Store, FileText, Wrench, MessageCircle, Check, CheckCheck, Volume2 } from 'lucide-react';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotification({
    enabled: isAuthenticated,
  });
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) setIsOpen(false);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MARKET': return <Store className="w-5 h-5" />;
      case 'REPORT': return <FileText className="w-5 h-5" />;
      case 'SERVICE': return <Wrench className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const handleSpeakNotification = (title: string, message: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speak(`${title}. ${message}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-primary-light rounded-full transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">নোটিফিকেশন</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAsRead()}
                className="text-xs text-primary hover:underline"
              >
                সব মার্ক করুন
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="text-4xl mb-2">🔕</div>
                <p>কোন নোটিফিকেশন নেই</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                    !notif.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notif.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getTypeIcon(notif.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-800 text-sm">
                          {notif.title}
                        </p>
                        <button
                          onClick={(e) => handleSpeakNotification(notif.title, notif.message, e)}
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="শুনুন"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">
                        {notif.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(notif.createdAt).toLocaleString('bn-BD')}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

