# 🌾 GramSevá - গ্রামসেবা

এটা একটা সম্পূর্ণ ফুল-স্ট্যাক কৃষি সেবা প্ল্যাটফর্ম। এখানে farmersরা সহজে service নিতে পারবে, market price চেক করতে পারবে আর booking করতে পারবে।

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-5A67D8)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

## 🚀 Project Setup (প্রোজেক্ট সেটআপ)

### Prerequisites (পূর্বশর্ত)

- Node.js (v18+)
- PostgreSQL database
- npm / yarn / pnpm

### Installation (ইনস্টলেশন)

```bash
# Clone করুন
git clone https://github.com/yourusername/gramseva.git
cd gramseva

# Dependencies ইনস্টল করুন
npm install

# .env ফাইল বানান
cp .env.example .env
# এগুলো সেট করুন:
# DATABASE_URL="postgresql://user:password@localhost:5432/gramseva"
# JWT_SECRET="your-secret-key"
# NEXT_PUBLIC_API_URL="http://localhost:3000"

# Prisma migration চালান
npx prisma migrate deploy
# অথবা:
# npx prisma migrate dev --name init

# Dev server চালান
npm run dev
```

Open করুন: [http://localhost:3000](http://localhost:3000)

### Build & Deploy

```bash
# Production build
npm run build

# Production mode তে চালান
npm start

# Vercel এ deploy করুন
vercel deploy
```

---

## 💻 Tech Stack (প্রযুক্তি স্ট্যাক)

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT |
| Styling | Tailwind CSS |
| State | React Context |
| API | RESTful API |

---

## 📚 এই প্রোজেক্ট থেকে যা শিখলাম

এই প্রোজেক্ট বানাতে গিয়ে আমি শিখে থাকি:

### 🎯 Core Concepts

- **Next.js 14 App Router** - routing, page structure, layouts
- **TypeScript** - interfaces, types, generics
- **Prisma ORM** - model design, migration, CRUD operations
- **PostgreSQL** - relational database design, relations
- **JWT Authentication** - token based login system
- **RESTful API** - API routes, request/response

### 🎨 Frontend

- **Tailwind CSS** - responsive design
- **PWA** - Service Worker, Manifest, offline support
- **Web Speech API** - voice recognition

### 🛠 Tools

- **Git & GitHub** - version control
- **Vercel** - production deployment

---

## 🏆 Features (বৈশিষ্ট্য)

- 📱 **Mobile Friendly** - responsive design
- 🔒 **Secure** - JWT authentication
- 🚀 **Fast** - SSR + caching
- 🌐 **Offline Support** - PWA feature
- 🎤 **Voice Controlled** - voice search
- 💰 **Market Price Tracker** - agricultural product prices
- 📊 **Dashboard** - stats, reports
- 🛒 **Booking System** - service booking

---

## 📂 Project Structure

```
gramseva/
├── prisma/
│   ├── schema.prisma      # Database models
│   └── migrations/       # Migration files
├── public/
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service Worker
└── src/
    ├── app/            # Next.js App Router
    │   ├── (dashboard)/ # Dashboard pages
    │   └── api/         # API routes
    ├── components/     # React components
    ├── contexts/       # Context API
    ├── hooks/          # Custom hooks
    ├── lib/            # Libraries
    └── utils/          # Utility functions
```

---

## 📜 License

MIT License - দেখুন [LICENSE](LICENSE) file

---

## 🙌 Contributing

এখানে contribute করতে চাইলে PR পাঠান অথবা issue খুলু!

⭐ যদি প্রজেক্টটি ভালো লাগে, star দিন!

---

### 💪 আমার কৃতিত্ব

এই প্রোজেক্ট বানিয়ে আমি একটি পূর্ণাঙ্গ ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন তৈরি করেছি যা:

📱 মোবাইল-ফ্রেন্ডলি | 🔒 সিকিউর | 🚀 ফাস্ট | 🌐 অফলাইন-সাপোর্টেড | 🎤 ভয়েস-কন্ট্রোলড | 🏆 প্রোডাকশন-রেডি