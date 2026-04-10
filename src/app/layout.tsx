import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import PWASetup from "@/components/common/PWASetup";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "GramSeva - গ্রামের হাতে ডিজিটাল বাংলাদেশ",
  description:
    "গ্রামের মানুষদের জন্য অল-ইন-ওয়ান সার্ভিস প্ল্যাটফর্ম। মিস্ত্রি, ডাক্তার, রিপোর্টিং, হাট বাজার সব এক জায়গায়।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
            <Footer />
            <PWASetup />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
