# 🌾 GramSevá - গ্রামসেবা

এটা একটা সম্পূর্ণ ফুল-স্ট্যাক কৃষি সেবা প্ল্যাটফর্ম। এখানে farmersরা সহজে service নিতে পারবে, market price চেক করতে পারবে আর booking করতে পারবে।

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-5A67D8)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

```bash
# Clone করুন
git clone https://github.com/gramseva/gramseva.git
cd gramseva

# Install করুন
npm install

# Environment সেটআপ (.env ফাইল)
# DATABASE_URL, JWT_SECRET সেট করুন

# Run করুন
npm run dev
```

Open করুন: [http://localhost:3000](http://localhost:3000)

---

## 💻 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT |
| Styling | Tailwind CSS |
| UI | shadcn/ui Components |
| Icons | Lucide React |

---

## 🏆 Features

- 📱 **Mobile Friendly** - responsive design
- 🔒 **Secure** - JWT authentication
- 🚀 **Fast** - SSR + caching
- 🗣️ **Voice Search** - Web Speech API
- 💰 **Market Price** - agricultural product prices
- 📊 **Dashboard** - stats, reports
- 🛒 **Booking** - service booking system
- 👤 **Role-based** - admin, farmer, user profiles

---

## 📂 Project Structure

```
gramseva/
├── prisma/
│   ├── schema.prisma      # Database models
│   └── migrations/       # Migration files
├── public/
│   ├── manifest.json    # PWA manifest
│   └── sw.js         # Service Worker
└── src/
    ├── app/            # Next.js App Router
    │   ├── (dashboard)/ # Dashboard pages
    │   └── api/        # API routes
    ├── components/     # React components
    │   ├── ui/       # Reusable UI components
    │   ├── common/    # Common components
    │   └── forms/     # Form components
    ├── contexts/      # Context API
    ├── hooks/        # Custom hooks
    ├── lib/          # Libraries & utils
    └── types/        # TypeScript types
```

---

## 📜 License

MIT License - দেখুন [LICENSE](LICENSE) file

---

## 🙌 Contributing

এখানে contribute করতে চাইলে PR পাঠান অথবা issue খুলু!

⭐ যদি প্রজেক্টটি ভালো লাগে, star দিন!