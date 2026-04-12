'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Check } from 'lucide-react';

interface VoiceFeedbackProps {
  onAudioReady: (audioBlob: Blob | null) => void;
  maxDuration?: number;
}

export default function VoiceFeedback({ onAudioReady, maxDuration = 60 }: VoiceFeedbackProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Permission denied:', error);
      setPermissionDenied(true);
      return false;
    }
  };

  const startRecording = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        onAudioReady(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setPermissionDenied(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (recordedBlob && !audioRef.current) {
      const url = URL.createObjectURL(recordedBlob);
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setRecordedBlob(null);
    setIsPlaying(false);
    setDuration(0);
    onAudioReady(null);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (permissionDenied) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400 text-sm">
          মাইক্রোফোন অ্যাক্সেস অনুমতি প্রয়োজন। অনুগ্রহ করে ব্রাউজার সেটিংসে মাইক্রোফোন অনুমতি দিন।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!recordedBlob ? (
        <div className="flex flex-col items-center gap-4">
          {isRecording ? (
            <div className="flex items-center gap-4">
              <button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center animate-pulse"
              >
                <Square className="w-6 h-6 text-white" />
              </button>
              <div className="text-center">
                <p className="text-lg font-medium text-red-500 animate-pulse">রেকর্ডিং...</p>
                <p className="text-sm text-gray-500">{formatDuration(duration)} / {formatDuration(maxDuration)}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center transition-all"
            >
              <Mic className="w-6 h-6 text-white" />
            </button>
          )}
          <p className="text-sm text-gray-500">
            {isRecording ? 'রেকর্ডিং বন্ধ করতে বাটনে ট্যাপ করুন' : 'ভয়েস ফিডব্যাক রেকর্ড করতে মাইকে ট্যাপ করুন'}
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={playRecording}
                className="w-12 h-12 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">রেকর্ড করা অডিও</p>
                <p className="text-sm text-gray-500">{formatDuration(duration)}</p>
              </div>
            </div>
            <button
              onClick={deleteRecording}
              className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: isPlaying ? '100%' : '0%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}