# Project Tree

Generated: 2026-04-11 14:32:31 +06:00
Depth: 25
Excluded: node_modules, .next, .git, dist, build, out, .turbo, .vercel, coverage

```text
.
├── prisma
│   ├── migrations
│   │   ├── 20260409070445_init
│   │   │   └── migration.sql
│   │   ├── 20260410050846_add_market_and_notification
│   │   │   └── migration.sql
│   │   ├── 20260410143029_add_booking_model
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── manifest.json
│   ├── next.svg
│   ├── offline.html
│   ├── sw.js
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── register
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)
│   │   │   ├── admin
│   │   │   │   └── page.tsx
│   │   │   ├── bookings
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── market
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── reports
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── services
│   │   │       ├── new
│   │   │   │   └── page.tsx
│   │   │       ├── [id]
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   ├── admin
│   │   │   │   └── stats
│   │   │   │       └── route.ts
│   │   │   ├── auth
│   │   │   │   ├── me
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register
│   │   │   │   │   └── route.ts
│   │   │   │   ├── send-otp
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify-otp
│   │   │   │       └── route.ts
│   │   │   ├── bookings
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── dashboard
│   │   │   │   └── stats
│   │   │   │       └── route.ts
│   │   │   ├── markets
│   │   │   │   ├── prices
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── notifications
│   │   │   │   └── route.ts
│   │   │   ├── reports
│   │   │   │   ├── [id]
│   │   │   │   │   ├── status
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── vote
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── services
│   │   │   │   ├── [id]
│   │   │   │   │   ├── review
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── my
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── user
│   │   │       └── upgrade
│   │   │           └── route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── common
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── PWASetup.tsx
│   │   │   ├── VoiceButton.tsx
│   │   │   └── VoiceSearch.tsx
│   │   ├── reports
│   │   │   ├── ReportCard.tsx
│   │   │   ├── ReportForm.tsx
│   │   │   └── ReportStatus.tsx
│   │   └── services
│   │       ├── ServiceBooking.tsx
│   │       ├── ServiceCard.tsx
│   │       └── ServiceFilter.tsx
│   ├── contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks
│   │   ├── useAuth.ts
│   │   ├── useNotification.ts
│   │   ├── useOffline.ts
│   │   └── useVoice.ts
│   ├── lib
│   │   ├── auth.ts
│   │   ├── cloudinary.ts
│   │   └── prisma.ts
│   ├── types
│   │   └── index.ts
│   └── utils
│       ├── bengaliHelper.ts
│       ├── offlineStorage.ts
│       └── speechHelper.ts
├── .env
├── .env.example
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── prisma.config.ts
├── PROJECT_TREE.md
├── README.md
├── SETUP.md
├── tailwind.config.mjs
├── tsconfig.json
└── tsconfig.tsbuildinfo
```