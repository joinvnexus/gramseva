'use client';

import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface SpeakButtonProps {
  text: string;
  language?: 'bn-BD' | 'en-US';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function SpeakButton({
  text,
  language = 'bn-BD',
  size = 'md',
  showLabel = false,
}: SpeakButtonProps) {
  const { speak, stop, isSpeaking, isPaused, isReady } = useTextToSpeech({ language });

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleSpeak = () => {
    if (!isReady) return;
    
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={!isReady}
      className={`inline-flex items-center gap-2 rounded-full transition ${
        isSpeaking
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white'
      } ${sizeClasses[size]} ${
        showLabel ? 'px-4 py-2' : ''
      }`}
      title={isSpeaking ? 'বন্ধ করুন' : 'শুনুন'}
    >
      {!isReady ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : isSpeaking ? (
        isPaused ? (
          <Volume2 className={iconSizes[size]} />
        ) : (
          <Volume2 className={`${iconSizes[size]} animate-pulse`} />
        )
      ) : (
        <VolumeX className={iconSizes[size]} />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isSpeaking ? 'বন্ধ' : 'শুনুন'}
        </span>
      )}
    </button>
  );
}