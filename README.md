# 🌾 GramSevá - গ্রামসেবা

একটি সম্পূর্ণ ফুল-স্ট্যাক কৃষি সেবা প্ল্যাটফর্ম

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-5A67D8)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

## 🚀 প্রজেক্ট সেটআপ

### পূর্বশর্ত

- Node.js (v18+)
- PostgreSQL ডাটাবেজ
- npm / yarn / pnpm

### ইনস্টলেশন

```bash
# রেপোজিটরি ক্লোন করুন
git clone https://github.com/yourusername/gramseva.git
cd gramseva

# ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# .env ফাইল কনফিগার করুন
cp .env.example .env
# নিচের ভেরিয়েবলগুলো সেট করুন:
# DATABASE_URL="postgresql://user:password@localhost:5432/gramseva"
# JWT_SECRET="your-secret-key"
# NEXT_PUBLIC_API_URL="http://localhost:3000"

# প্রিসমা মাইগ্রেশন রান করুন
npx prisma migrate deploy
# অথবা মাইগ্রেশন তৈরি করতে:
# npx prisma migrate dev --name init

# ডেভেলপমেন্ট সার্ভার চালান
npm run dev
```

ওয়েবসাইট ওপেন করুন: [http://localhost:3000](http://localhost:3000)

### বিল্ড ও ডেপ্লয়

```bash
# প্রোডাকশন বিল্ড
npm run build

# প্রোডাকশন মোডে চালান
npm start

# Vercel-এ ডেপ্লয়
vercel deploy
```

---

## 💻 প্রযুক্তি স্ট্যাক

| ক্যাটাগরি | প্রযুক্তি |
|------------|----------|
| ফ্রেমওয়ার্ক | Next.js 14 App Router |
| ভাষা | TypeScript |
| ডাটাবেজ | PostgreSQL |
| ORM | Prisma |
| অথেনটিকেশন | JWT |
| স্টাইলিং | Tailwind CSS |
| স্টেট ম্যানেজমেন্ট | React Context |
| API | RESTful API |

---

## 📚 শেখা বিষয়সমূহ

> এই প্রোজেক্ট বানাতে গিয়ে আমি শিখে থাকি:

### 🎯 কোর কনসেপ্ট

- **Next.js 14 App Router** - রাউটিং, পেজ স্ট্রাকচার, Layouts
- **TypeScript টাইপ সেফটি** - Interfaces, Types, Generics
- **Prisma ORM** - মডেল ডিজাইন, মাইগ্রেশন, CRUD অপারেশন
- **PostgreSQL ডাটাবেজ ডিজাইন** - রিলেশনাল ডাটাবেজ, রিলেশনস
- **JWT অথেনটিকেশন** - টোকেন ভিত্তিক লগইন সিস্টেম
- **RESTful API ডিজাইন** - API রাউট, রিকোয়েস্ট/রেসপন্স

### 🎨 ফ্রন্টএন্ড

- **Tailwind CSS** - রেসপন্সিভ ডিজাইন
- **PWA** - Service Worker, Manifest, অফলাইন সাপোর্ট
- **Web Speech API** - ভয়েস রিকগনিশন

### 🛠 টুলস

- **Git & GitHub** - ভার্সন কন্ট্রোল
- **Vercel ডেপ্লয়��েন্ট** - প্রোডাকশন ডেপ্লয়

---

## 🏆 প্রজেক্টের বৈশিষ্ট্য

- 📱 **মোবাইল-ফ্রেন্ডলি** - রেসপন্সিভ ডিজাইন
- 🔒 **সিকিউর** - JWT অথেনটিকেশন
- 🚀 **ফাস্ট** - SSR + ক্যাশিং
- 🌐 **অফলাইন-সাপোর্টেড** - PWA ফিচার
- 🎤 **ভয়েস-কন্ট্রোলড** - ভয়েস সার্চ
- 💰 **মার্কেট প্রাইস ট্র্যাকার** - কৃষি পণ্যের দাম
- 📊 **ড্যাশবোর্ড** - স্ট্যাটিস, রিপোর্ট
- 🛒 **বুকিং সিস্টেম** - সার্ভিস বুকিং

---

## 📂 প্রজেক্ট স্ট্রাকচার

```
gramseva/
├── prisma/
│   ├── schema.prisma      # ডাটাবেজ মডেল
│   └── migrations/       # মাইগ্রেশন ফাইল
├── public/
│   ├── manifest.json    # PWA ম্যানিফেস্ট
│   └── sw.js          # Service Worker
└── src/
    ├── app/            # Next.js App Router
    │   ├── (dashboard)/ # ড্যাশবোর্ড পেজ
    │   └── api/         # API রাউট
    ├── components/     # React কম্পোনেন্ট
    ├── contexts/       # Context API
    ├── hooks/          # Custom hooks
    ├── lib/            # লাইব্রেরি
    └── utils/          # ইউটিলিটি ফাংশন
```

---

## 📜 লাইসেন্স

MIT License - দেখুন [LICENSE](LICENSE) ফাইল

---

## 🙌 অবদান

যদি আপনি এই প্রজেক্টে অবদান রাখতে চান, তাহলে PR পাঠান অথবা ইস্যু খুলু!

⭐ যদি প্রজেক্টটি ভালো লাগে, একটি স্টার দিন!