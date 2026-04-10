//src/components/common/PWASetup.tsx
'use client';

import { useEffect, useState } from 'react';
import { useOffline } from '@/hooks/useOffline';

export default function PWASetup() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const { isOffline } = useOffline();

  useEffect(() => {
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted install');
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  if (!isOffline && !showInstall) return null;

  return (
    <>
      {isOffline && (
        <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm">
          আপনি অফলাইনে আছেন
        </div>
      )}

      {showInstall && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-xl z-50 p-4 border-l-4 border-primary">
          <div className="flex items-start gap-3">
            <div className="text-3xl">📱</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                অ্যাপ ইন্সটল করুন
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                GramSeva অ্যাপ ইন্সটল করে অফলাইনে ব্যবহার করুন
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="bg-primary text-white px-4 py-1 rounded text-sm"
                >
                  ইন্সটল
                </button>
                <button
                  onClick={() => setShowInstall(false)}
                  className="text-gray-500 text-sm px-2"
                >
                  পরে
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

