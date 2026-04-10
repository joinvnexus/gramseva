# 📋 প্রোজেক্ট সেটআপ গাইড

## পূর্বশর্ত

| টুল | ন্যূনতম ভার্সন |
|-----|--------------|
| Node.js | 18.x |
| npm | 9.x+ |
| PostgreSQL | 14.x+ |

---

## ধাপ ১: রেপোজিটরি ক্লোন

```bash
git clone https://github.com/yourusername/gramseva.git
cd gramseva
```

---

## ধাপ ২: ডিপেন্ডেন্সি ইনস্টল

```bash
npm install
```

---

## ধাপ ৩: এনভায়রনমেন্ট কনফিগারেশন

`.env` ফাইল তৈরি করুন প্রজেক্ট রুটে:

```env
# ডাটাবেজ কানেকশন
DATABASE_URL="postgresql://username:password@localhost:5432/gramseva"

# JWT সিক্রেট কী
JWT_SECRET="your-super-secret-key-change-in-production"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"

# ক্লাউডিনারি (অপশনাল)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## ধাপ ৪: ডাটাবেজ সেটআপ

```bash
# প্রথম মাইগ্রেশন তৈরি
npx prisma migrate dev --name init

# অথবা শুধুমাত্র প্রিসমা ক্লায়েন্ট জেনারেট
npx prisma generate
```

---

## ধাপ ৫: ডেভেলপমেন্ট সার্ভার চালান

```bash
npm run dev
```

ব্রাউজারে ওপেন করুন: **http://localhost:3000**

---

## প্রোডাকশন বিল্ড

```bash
# বিল্ড তৈরি
npm run build

# প্রোডাকশন সার্ভার চালান
npm start
```

---

## সাধারণ সমস্যা সমাধান

### ❌ "Cannot find module" এরর

```bash
npm install
rm -rf .next
npm run dev
```

### ❌ ডাটাবেজ কানেকশন এরর

- PostgreSQL সার্ভার চলছে কিনা চেক করুন
- `.env` ফাইলে DATABASE_URL সঠিক কিনা দেখুন

### ❌ Prisma এরর

```bash
npx prisma studio
```

---

## উপকারী কমান্ড

```bash
# Prisma Studio (ডাটাবেজ ভিজুয়ালাইজার)
npx prisma studio

# প্রিসমা রিসেট
npx prisma migrate reset

# টাইপ চেক
npx tsc --noEmit

# লিন্টিং
npm run lint
```

---

## পরবর্তী পদক্ষেপ

- [ ] Vercel অ্যাকাউন্ট তৈরি
- [ ] PostgreSQL ডাটাবেজ হোস্ট করুন (Railway / Supabase / Neon)
- [ ] ডেপ্লয় করুন