// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, generateToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'ফোন নম্বর এবং OTP দিন' },
        { status: 400 }
      );
    }

    // OTP ভেরিফাই করুন
    const isValid = await verifyOTP(phone, otp);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'OTP সঠিক নয় বা মেয়াদ উত্তীর্ণ' },
        { status: 400 }
      );
    }

    // ইউজার তথ্য নিন
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        verified: true,
        village: true,
        ward: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'ইউজার পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    // টোকেন জেনারেট করুন
    const token = generateToken({
      id: user.id,
      phone: user.phone,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      message: 'লগইন সফল!',
      data: { user, token },
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      { success: false, error: 'ভেরিফিকেশন করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}