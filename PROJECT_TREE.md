# Project Tree

Generated: 2026-04-15 13:30:33 +06:00
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
│   │   │   ├── layout.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── register
│   │   │       └── page.tsx
│   │   ├── (dashboard)
│   │   │   ├── admin
│   │   │   │   ├── dashboard
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── feedback
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── markets
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── profile
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── services
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── stats
│   │   │   │   │   └── route.ts
│   │   │   │   └── users
│   │   │   │       └── page.tsx
│   │   │   ├── bookings
│   │   │   │   └── page.tsx
│   │   │   ├── feedback
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── market
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── provider
│   │   │   │   ├── dashboard
│   │   │   │   │   └── page.tsx
│   │   │   │   └── profile
│   │   │   │       └── page.tsx
│   │   │   ├── reports
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── services
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── user
│   │   │   │   ├── dashboard
│   │   │   │   │   └── page.tsx
│   │   │   │   └── profile
│   │   │   │       └── page.tsx
│   │   │   └── weather
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   ├── admin
│   │   │   │   ├── markets
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── prices
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── reports
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── services
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── stats
│   │   │   │   │   └── route.ts
│   │   │   │   └── users
│   │   │   │       ├── [id]
│   │   │   │       │   └── route.ts
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
│   │   │       │       └── route.ts
│   │   │   ├── feedback
│   │   │   │   └── route.ts
│   │   │   ├── markets
│   │   │   │   ├── prices
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── notifications
│   │   │   │   └── route.ts
│   │   │   ├── provider
│   │   │   │   └── stats
│   │   │   │       └── route.ts
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
│   │   │   ├── user
│   │   │   │   ├── profile
│   │   │   │   │   └── route.ts
│   │   │   │   ├── stats
│   │   │   │   │   └── route.ts
│   │   │   │   └── upgrade
│   │   │   │       └── route.ts
│   │   │   └── weather
│   │   │       └── route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── agriculture
│   │   │   └── AgriTips.tsx
│   │   ├── common
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── GlobalReadPageButton.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── PWASetup.tsx
│   │   │   ├── ReadPageContent.tsx
│   │   │   ├── SpeakButton.tsx
│   │   │   ├── TextToSpeech.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── ToastContainer.tsx
│   │   │   ├── VoiceButton.tsx
│   │   │   └── VoiceSearch.tsx
│   │   ├── feedback
│   │   │   ├── VoiceFeedback.tsx
│   │   │   └── index.ts
│   │   ├── reports
│   │   │   ├── ReportCard.tsx
│   │   │   ├── ReportForm.tsx
│   │   │   └── ReportStatus.tsx
│   │   ├── services
│   │   │   ├── ServiceBooking.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   └── ServiceFilter.tsx
│   │   ├── ui
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── StatsCardSkeleton.tsx
│   │   │   └── VisuallyHidden.tsx
│   │   └── weather
│   │       └── WeatherCard.tsx
│   ├── contexts
│   │   ├── AuthContext.tsx
│   │   ├── SocketContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks
│   │   ├── useAuth.ts
│   │   ├── useNotification.ts
│   │   ├── useOffline.ts
│   │   ├── useOfflineReport.tsx
│   │   ├── useTextToSpeech.ts
│   │   ├── useToast.ts
│   │   └── useVoice.ts
│   ├── lib
│   │   ├── audioUpload.ts
│   │   ├── auth.ts
│   │   ├── cloudinary.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── types
│   │   └── index.ts
│   └── utils
│       ├── bengaliHelper.ts
│       ├── offlineStorage.ts
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

(End of file - total 161 lines)