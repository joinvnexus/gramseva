# Project Tree

Generated: 2026-04-10 14:01:35 +06:00
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
│   │   │   ├── dashboard
│   │   │   │   └── page.tsx
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
│   │   │   │   │   └── vote
│   │   │   │   │       └── route.ts
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
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── PWASetup.tsx
│   │   │   └── VoiceSearch.tsx
│   │   ├── reports
│   │   └── services
│   │       └── ServiceCard.tsx
│   ├── contexts
│   │   └── AuthContext.tsx
│   ├── hooks
│   ├── lib
│   │   ├── auth.ts
│   │   └── prisma.ts
│   ├── types
│   │   └── index.ts
│   └── utils
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
├── tailwind.config.mjs
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

