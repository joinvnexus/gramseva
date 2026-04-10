# 📋 Project Setup Guide (প্রোজেক্ট সেটআপ গাইড)

## Prerequisites (পূর্বশর্ত)

| Tool | Minimum Version |
|-----|-----------------|
| Node.js | 18.x |
| npm | 9.x+ |
| PostgreSQL | 14.x+ |

---

## Step 1: Clone Repository (রেপো ক্লোন)

```bash
git clone https://github.com/yourusername/gramseva.git
cd gramseva
```

---

## Step 2: Install Dependencies (ডিপেন্ডেন্সি ইনস্টল)

```bash
npm install
```

---

## Step 3: Environment Configuration (এনভায়রনমেন্ট সেটআপ)

`.env` ফাইল তৈরি করুন project root এ:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/gramseva"

# JWT Secret Key
JWT_SECRET="your-super-secret-key-change-in-production"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Cloudinary (Optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## Step 4: Database Setup (ডাটাবেজ সেটআপ)

```bash
# First migration তৈরি করুন
npx prisma migrate dev --name init

# অথবা শুধু prisma client generate করুন
npx prisma generate
```

---

## Step 5: Run Development Server

```bash
npm run dev
```

Browser এ open করুন: **http://localhost:3000**

---

## Production Build (প্রোডাকশন বিল্ড)

```bash
# Build তৈরি করুন
npm run build

# Production এ চালান
npm start
```

---

## Common Issues (সাধারণ সমস্যা)

### ❌ "Cannot find module" error

```bash
npm install
rm -rf .next
npm run dev
```

### ❌ Database Connection Error

- PostgreSQL server চলছে কিনা চেক করুন
- `.env` এ DATABASE_URL সঠিক কিনা দেখুন

### ❌ Prisma Error

```bash
npx prisma studio
```

---

## Useful Commands (উপকারী কমান্ড)

```bash
# Prisma Studio (database visualizer)
npx prisma studio

# Prisma Reset
npx prisma migrate reset

# Type Check
npx tsc --noEmit

# Linting
npm run lint
```

---

## Next Steps (পরবর্তী পদক্ষেপ)

- [ ] Vercel account বানান
- [ ] PostgreSQL host করুন (Railway / Supabase / Neon)
- [ ] Deploy করুন