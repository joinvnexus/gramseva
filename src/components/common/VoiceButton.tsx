'use client';

import { useState, useEffect } from 'react';

interface VoiceButtonProps {
  onResult: (text: string) => void;
  onListening?: (isListening: boolean) => void;
  className?: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function VoiceButton({ onResult, onListening, className = '' }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window)) {
      setSupported(false);
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'bn-BD';

    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
      if (onListening) onListening(false);
    };

    recognitionInstance.onerror = () => {
      setIsListening(false);
      if (onListening) onListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      if (onListening) onListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [onResult, onListening]);

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
        if (onListening) onListening(true);
      } catch (error) {
        console.error('Voice recognition error:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
      if (onListening) onListening(false);
    }
  };

  if (!supported) {
    return null;
  }

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`p-3 rounded-full transition-all ${
        isListening
          ? 'bg-red-500 animate-pulse'
          : 'bg-primary hover:bg-primary-dark'
      } ${className}`}
      title={isListening ? 'শুনছি...' : 'ভয়েসে বলুন'}
    >
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
      {isListening && (
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          বলুন...
        </span>
      )}
    </button>
  );
}