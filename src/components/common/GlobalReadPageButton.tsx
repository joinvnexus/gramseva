'use client';

import { useEffect, useState } from 'react';
import { Volume2, X, Pause, Play } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface GlobalReadPageButtonProps {
  pageContent?: string;
  pageTitle?: string;
}

function collectPageContent(): string {
  if (typeof window === 'undefined') return '';
  
  const content: string[] = [];
  
  const headingElements = document.querySelectorAll('h1, h2, h3');
  headingElements.forEach(el => {
    const text = el.textContent?.trim();
    if (text && text.length > 2) {
      content.push(text);
    }
  });

  const paragraphElements = document.querySelectorAll('p, td, th, span');
  paragraphElements.forEach(el => {
    const text = el.textContent?.trim();
    if (text && text.length > 5 && text.length < 200) {
      content.push(text);
    }
  });
  
  return content.join('. ').replace(/\s+/g, ' ').trim();
}

export default function GlobalReadPageButton({ pageContent, pageTitle }: GlobalReadPageButtonProps) {
  const { speak, stop, isSpeaking, isPaused, isReady } = useTextToSpeech();
  const [content, setContent] = useState(pageContent || '');
  const [title, setTitle] = useState(pageTitle);

  useEffect(() => {
    if (!pageContent) {
      setContent(collectPageContent());
    }
  }, [pageContent]);

  useEffect(() => {
    if (!pageTitle && typeof window !== 'undefined') {
      const h1 = document.querySelector('h1');
      if (h1) {
        setTitle(h1.textContent?.trim() || '');
      }
    }
  }, [pageTitle]);

  const handleReadPage = () => {
    if (!content || !isReady) return;

    if (isSpeaking) {
      stop();
    } else {
      const fullText = title || pageTitle ? `${title || pageTitle}. ${content}` : content;
      speak(fullText);
    }
  };

  if (!isReady) return null;

  return (
    <button
      onClick={handleReadPage}
      className={`fixed bottom-20 right-4 z-50 rounded-full shadow-lg transition-all duration-300 ${
        isSpeaking
          ? 'bg-red-500 hover:bg-red-600 text-white w-14 h-14'
          : 'bg-primary hover:bg-primary-dark text-white w-12 h-12'
      }`}
      title={isSpeaking ? 'বন্ধ করুন' : 'পুরো পেজ পড়ুন'}
    >
      {isSpeaking ? (
        isPaused ? (
          <Play className="w-6 h-6 mx-auto" />
        ) : (
          <Pause className="w-6 h-6 mx-auto" />
        )
      ) : (
        <Volume2 className="w-6 h-6 mx-auto" />
      )}
    </button>
  );
}