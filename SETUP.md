# 📋 Project Setup Guide

## Prerequisites

| Tool | Minimum Version |
|-----|-----------------|
| Node.js | 18.x |
| npm | 9.x+ |
| PostgreSQL | 14.x+ |

---

## Step 1: Clone Repository

```bash
git clone https://github.com/gramseva/gramseva.git
cd gramseva
```

---

## Step 2: Install Dependencies

```bash
npm install
```

---

## Step 3: Environment Configuration

Create a `.env` file in the project root:

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

## Step 4: Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migration (first time)
npx prisma migrate dev --name init
```

---

## Step 5: Run Development Server

```bash
npm run dev
```

Open in browser: **http://localhost:3000**

---

## Production Build

```bash
# Build the project
npm run build

# Run in production mode
npm start
```

---

## Common Issues

### ❌ "Cannot find module" error

```bash
npm install
rm -rf .next
npm run dev
```

### ❌ Database Connection Error

- Check if PostgreSQL server is running
- Verify DATABASE_URL in `.env` is correct

### ❌ Prisma Error

```bash
npx prisma studio
```

---

## Useful Commands

```bash
# Database visualizer
npx prisma studio

# Database reset
npx prisma migrate reset

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

---

## Next Steps

- [ ] Create a Vercel account
- [ ] Set up PostgreSQL hosting (Railway / Supabase / Neon)
- [ ] Deploy the application