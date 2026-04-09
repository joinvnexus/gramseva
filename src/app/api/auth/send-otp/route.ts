// src/app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, saveOTP } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.length !== 11) {
      return NextResponse.json(
        { success: false, error: 'সঠিক মোবাইল নম্বর দিন' },
        { status: 400 }
      );
    }

    // ইউজার চেক করুন (রেজিস্টার না থাকলে ক্রিয়েট করুন)
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'এই নম্বরে কোনো একাউন্ট নেই। অনুগ্রহ করে রেজিস্ট্রেশন করুন।' },
        { status: 404 }
      );
    }

    // OTP জেনারেট করুন
    const otp = generateOTP();
    await saveOTP(phone, otp);

    // ডেভেলপমেন্টে কনসোলে OTP দেখান
    console.log(`📱 OTP for ${phone}: ${otp}`);

    // TODO: প্রোডাকশনে SMS সার্ভিস যোগ করুন (Twilio etc)

    return NextResponse.json({
      success: true,
      message: 'OTP পাঠানো হয়েছে',
      // ডেভেলপমেন্টে OTP রিটার্ন করুন (প্রোডাকশনে রিমুভ করবেন)
      dev_otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json(
      { success: false, error: 'OTP পাঠাতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}