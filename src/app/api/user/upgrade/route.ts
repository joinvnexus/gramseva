// src/app/api/user/upgrade/route.ts
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
    
    const user = await prisma.user.update({
      where: { id: payload.id },
      data: { role: 'PROVIDER' },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'আপনি এখন সার্ভিস প্রোভাইডার',
      data: { role: user.role }
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json(
      { success: false, error: 'আপগ্রেড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}