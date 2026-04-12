# 🌾 GramSevá

A full-stack agricultural service platform where farmers can easily book services, check market prices, and manage their agricultural needs.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-5A67D8)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

## 📖 Why This Project?

This project was created to solve real problems faced by farmers in Bangladesh:

- **Service Access** - Farmers often struggle to find reliable agricultural services (pesticides, equipment, experts)
- **Market Prices** - No centralized platform to check current market prices for crops
- **Communication Gap** - No easy way to book services or connect with experts
- **Language Barrier** - Most agricultural platforms are in English, not accessible to local farmers

GramSevá bridges this gap by providing a bilingual (Bengali + English), mobile-friendly platform where farmers can:
- Book agricultural services
- Check real-time market prices
- Access expert advice
- Manage their farming activities

---

## 🎓 What I Learned

Building this project helped me learn:

### Backend
- **Next.js 14 App Router** - File-based routing, layouts, middleware
- **Prisma ORM** - Database modeling, migrations, CRUD operations
- **PostgreSQL** - Relational database design, indexes, queries
- **RESTful API** - API route handlers, request/response handling
- **JWT Authentication** - Token-based auth, protected routes

### Frontend
- **React** - Components, hooks, context
- **TypeScript** - Interfaces, types, generics
- **Tailwind CSS** - Responsive design, custom theme
- **shadcn/ui** - Reusable UI components
- **Web Speech API** - Voice recognition for search

### Tools & Deployment
- **Git** - Version control, branching
- **Vercel** - Production deployment

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/gramseva/gramseva.git
cd gramseva

# Install dependencies
npm install

# Set up environment variables (.env file)
# DATABASE_URL, JWT_SECRET

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

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
| UI Components | shadcn/ui |
| Icons | Lucide React |

---

## 🏆 Features

- 📱 **Mobile Friendly** - Responsive design
- 🔒 **Secure** - JWT authentication
- 🚀 **Fast** - SSR with caching
- 🗣️ **Voice Search** - Web Speech API
- 💰 **Market Price** - Agricultural product prices
- 📊 **Dashboard** - Statistics and reports
- 🛒 **Booking** - Service booking system
- 👤 **Role-based** - Admin, farmer, and user profiles

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
    │   └── api/        # API routes
    ├── components/     # React components
    │   ├── ui/        # Reusable UI components
    │   ├── common/    # Common components
    │   └── forms/     # Form components
    ├── contexts/      # Context API
    ├── hooks/         # Custom hooks
    ├── lib/           # Libraries and utilities
    └── types/         # TypeScript types
```

---

## 📜 License

MIT License - See [LICENSE](LICENSE) file

---

## 🙌 Contributing

Contributions are welcome! Open a PR or create an issue.

If you find this project useful, please give it a ⭐️