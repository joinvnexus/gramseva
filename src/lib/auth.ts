// src/lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface JWTPayload {
  id: string;
  phone: string;
  role: string;
}

// JWT টোকেন জেনারেট
export function generateToken(user: { id: string; phone: string; role: string }): string {
  return jwt.sign(
    { id: user.id, phone: user.phone, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// JWT টোকেন ভেরিফাই
export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

// OTP জেনারেট (6 ডিজিট)
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// OTP সংরক্ষণ
export async function saveOTP(phone: string, otp: string): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(process.env.OTP_EXPIRY_MINUTES || '5'));

  await prisma.user.update({
    where: { phone },
    data: {
      otp,
      otpExpiresAt: expiresAt,
    },
  });
}

// OTP ভেরিফাই
export async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user || !user.otp || !user.otpExpiresAt) {
    return false;
  }

  if (user.otp !== otp) {
    return false;
  }

  if (user.otpExpiresAt < new Date()) {
    return false;
  }

  // OTP ইউজ করার পর ক্লিয়ার করুন
  await prisma.user.update({
    where: { phone },
    data: {
      otp: null,
      otpExpiresAt: null,
      verified: true,
    },
  });

  return true;
}