'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTextToSpeechOptions {
  language?: 'bn-BD' | 'en-US';
  rate?: number;
  pitch?: number;
}

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  currentText: string;
  isReady: boolean;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn {
  const { language = 'bn-BD', rate = 0.9, pitch = 1 } = options;
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [isReady, setIsReady] = useState(false);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const initVoices = () => {
        setIsReady(true);
      };
      
      if (window.speechSynthesis.getVoices().length > 0) {
        initVoices();
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', initVoices, { once: true });
      }
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const findBengaliVoice = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const voices = window.speechSynthesis?.getVoices() || [];
    return (
      voices.find((v) => v.lang.startsWith('bn')) ||
      voices.find((v) => v.lang.startsWith('ben')) ||
      voices.find((v) => v.lang.includes('beng')) ||
      null
    );
  }, []);

  const speak = useCallback((text: string) => {
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

    utterance.rate = rate;
    utterance.pitch = pitch;
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
    setCurrentText(text);
    window.speechSynthesis?.speak(utterance);
  }, [isReady, language, rate, pitch, findBengaliVoice]);

  const pause = useCallback(() => {
    if (isSpeaking && !isPaused && typeof window !== 'undefined') {
      window.speechSynthesis?.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (isPaused && typeof window !== 'undefined') {
      window.speechSynthesis?.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText('');
    }
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    currentText,
    isReady,
  };
}