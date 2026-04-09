// src/app/api/services/my/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    
    const services = await prisma.service.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভিস লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}