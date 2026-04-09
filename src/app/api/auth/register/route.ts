// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { phone, name, village, ward } = await request.json();

    const wardNum = parseInt(ward?.toString());
    if (!phone || !name || !village || !wardNum || isNaN(wardNum)) {
      return NextResponse.json(
        { success: false, error: 'সব তথ্য পূরণ করুন' },
        { status: 400 }
      );
    }

    if (phone.length !== 11 || !/^\d{11}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'সঠিক মোবাইল নম্বর দিন' },
        { status: 400 }
      );
    }

    // চেক করুন ইউজার আগে থেকে আছে কিনা
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'এই নম্বরে আগে থেকে একাউন্ট আছে' },
        { status: 400 }
      );
    }

    // নতুন ইউজার তৈরি করুন
    const user = await prisma.user.create({
      data: {
        phone,
        name,
        village,
        ward: wardNum,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'রেজিস্ট্রেশন সফল! এখন লগইন করুন।',
      data: { id: user.id, phone: user.phone },
    });

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json(
      { success: false, error: 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}