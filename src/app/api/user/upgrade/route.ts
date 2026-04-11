import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const body = await request.json();
    const { providerType } = body; // ✅ নতুন: প্রোভাইডার টাইপ

    if (!providerType) {
      return NextResponse.json(
        { success: false, error: 'সার্ভিসের ধরন নির্বাচন করুন' },
        { status: 400 }
      );
    }

    // চেক করুন ইউজার ইতিমধ্যে প্রোভাইডার কিনা
    const existingUser = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (existingUser?.role === 'PROVIDER') {
      return NextResponse.json(
        { success: false, error: 'আপনি ইতিমধ্যে প্রোভাইডার' },
        { status: 400 }
      );
    }

    // প্রোভাইডারে আপগ্রেড করুন
    const user = await prisma.user.update({
      where: { id: payload.id },
      data: {
        role: 'PROVIDER',
        providerType: providerType as any,
      },
    });

    return NextResponse.json({
      success: true,
      message: `আপনি এখন ${providerType} হিসাবে প্রোভাইডার`,
      data: { role: user.role, providerType: user.providerType },
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json(
      { success: false, error: 'আপগ্রেড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}