// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'টোকেন পাওয়া যায়নি' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        verified: true,
        village: true,
        ward: true,
        rating: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'ইউজার পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { user } });

  } catch (error) {
    console.error('Get User Error:', error);
    return NextResponse.json(
      { success: false, error: 'ইউজার তথ্য লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}