import type { Metadata } from 'next';
import { Hind_Siliguri } from 'next/font/google';
import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import PWASetup from '@/components/common/PWASetup';

const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GramSeva - গ্রামের হাতে ডিজিটাল বাংলাদেশ',
  description: 'গ্রামের মানুষদের জন্য অল-ইন-ওয়ান সার্ভিস প্ল্যাটফর্ম। মিস্ত্রি, ডাক্তার, রিপোর্টিং, হাট বাজার সব এক জায়গায়।',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes',
  themeColor: '#8B5A2B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className={`${hindSiliguri.className} bg-background text-gray-800`}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <PWASetup />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}