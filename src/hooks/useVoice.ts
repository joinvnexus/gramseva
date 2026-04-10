'use client';

import { useState, useCallback, useEffect } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface UseVoiceOptions {
  language?: string;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

export function useVoice(options: UseVoiceOptions = {}) {
  const { language = 'bn-BD', onResult, onError } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window)) {
      setSupported(false);
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = language;

    recognitionInstance.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      onResult?.(text);
      setIsListening(false);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError?.(event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [language, onResult, onError]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
        setTranscript('');
      } catch (error) {
        console.error('Failed to start recognition:', error);
        onError?.('Failed to start voice recognition');
      }
    }
  }, [recognition, isListening, onError]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  return {
    isListening,
    transcript,
    supported,
    startListening,
    stopListening,
  };
}