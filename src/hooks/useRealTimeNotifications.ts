'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useNotification } from './useNotification';

const NOTIFICATION_SOUND = '/notification.mp3';

export function useRealTimeNotifications() {
  const { socket, isConnected } = useSocket();
  const { notifications, unreadCount, loading, markAsRead, refetch } = useNotification();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNotificationSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(NOTIFICATION_SOUND);
      }
      audioRef.current.play().catch(() => {});
    } catch {}
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNotification = () => {
      playNotificationSound();
      refetch();
    };

    const handleBookingUpdate = () => {
      playNotificationSound();
      refetch();
    };

    const handleReportUpdate = () => {
      playNotificationSound();
      refetch();
    };

    socket.on('notification', handleNotification);
    socket.on('booking-update', handleBookingUpdate);
    socket.on('report-update', handleReportUpdate);

    return () => {
      socket.off('notification', handleNotification);
      socket.off('booking-update', handleBookingUpdate);
      socket.off('report-update', handleReportUpdate);
    };
  }, [socket, isConnected, playNotificationSound, refetch]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    refetch,
    isConnected,
  };
}
