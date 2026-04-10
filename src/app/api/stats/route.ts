// src/app/api/admin/stats/route.ts
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
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'অ্যাডমিন অ্যাক্সেস প্রয়োজন' },
        { status: 403 }
      );
    }

    const [users, services, reports, markets] = await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
      prisma.report.count(),
      prisma.market.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: { users, services, reports, markets },
    });
  } catch (error) {
    console.error('Stats Error:', error);
    return NextResponse.json(
      { success: false, error: 'স্ট্যাটস লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}