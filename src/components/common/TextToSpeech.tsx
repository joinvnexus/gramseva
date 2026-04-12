'use client';

import { useEffect, useState, useRef } from 'react';

interface TextToSpeechProps {
  text: string;
  language?: 'bn-BD' | 'en-US';
  autoPlay?: boolean;
  showControls?: boolean;
}

export default function TextToSpeech({
  text,
  language = 'bn-BD',
  autoPlay = false,
  showControls = true,
}: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (autoPlay && text && isReady) {
      speak();
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis?.cancel();
      }
    };
  }, [text, autoPlay, isReady]);

  const findBengaliVoice = () => {
    if (typeof window === 'undefined') return null;
    const voices = window.speechSynthesis?.getVoices() || [];
    return (
      voices.find((v) => v.lang.startsWith('bn')) ||
      voices.find((v) => v.lang.startsWith('ben')) ||
      voices.find((v) => v.lang.includes('beng')) ||
      null
    );
  };

  const speak = () => {
    if (!text || !isReady) return;

    window.speechSynthesis?.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const bengaliVoice = findBengaliVoice();

    if (bengaliVoice) {
      utterance.voice = bengaliVoice;
    } else if (language === 'bn-BD') {
      utterance.lang = 'bn-BD';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis?.speak(utterance);
  };

  const pause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis?.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (isPaused) {
      window.speechSynthesis?.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  if (!showControls) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={isSpeaking ? (isPaused ? resume : pause) : speak}
        disabled={!isReady || !text}
        className={`p-2 rounded-full transition ${
          isSpeaking
            ? 'bg-primary text-white animate-pulse'
            : 'bg-gray-200 dark:bg-gray-700 hover:bg-primary hover:text-white'
        }`}
      >
        {isSpeaking ? (
          isPaused ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        )}
      </button>

      {isSpeaking && (
        <button
          onClick={stop}
          className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z" />
          </svg>
        </button>
      )}

      {isSpeaking && (
        <span className="text-sm text-primary dark:text-primary-light animate-pulse">
          {isPaused ? 'বিরতি' : 'বলছে...'}
        </span>
      )}
    </div>
  );
}