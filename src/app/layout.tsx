import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Hind_Siliguri } from 'next/font/google';
import dynamic from 'next/dynamic';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import PWASetup from '@/components/common/PWASetup';

const SocketProvider = dynamic(() => import('@/contexts/SocketContext').then(mod => mod.SocketProvider));
const ToastContainer = dynamic(() => import('@/components/common/ToastContainer').then(mod => mod.default));

const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GramSeva - গ্রামের হাতে ডিজিটাল বাংলাদেশ',
  description: 'গ্রামের মানুষদের জন্য অল-ইন-ওয়ান সার্ভিস প্ল্যাটফর্ম। মিস্ত্রি, ডাক্তার, রিপোর্টিং, হাট বাজার সব এক জায়গায়।',
  manifest: '/manifest.json',
  themeColor: '#8B5A2B',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${hindSiliguri.className} bg-[#FFF8E7] dark:bg-gray-900 text-gray-800 dark:text-gray-100 antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <ToastProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 w-full">
                    <div className="container mx-auto px-3 sm:px-4 py-4 md:py-6">
                      {children}
                    </div>
                  </main>
                  <Footer />
                  <PWASetup />
                  <ToastContainer />
                </div>
              </ToastProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}