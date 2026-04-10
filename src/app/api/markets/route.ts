// src/app/api/markets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const village = searchParams.get('village');
    const day = searchParams.get('day');

    const where: any = { isActive: true };
    if (village) where.village = { contains: village, mode: 'insensitive' };
    if (day) where.marketDay = day;

    const markets = await prisma.market.findMany({
      where,
      include: {
        prices: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
      orderBy: { village: 'asc' },
    });

    return NextResponse.json({ success: true, data: markets });
  } catch (error) {
    console.error('Get Markets Error:', error);
    return NextResponse.json(
      { success: false, error: 'হাট বাজারের তথ্য লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// নতুন হাট বাজার যোগ (শুধু অ্যাডমিন)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const { verifyToken } = await import('@/lib/auth');
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'শুধু অ্যাডমিন হাট বাজার যোগ করতে পারেন' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { village, marketDay, marketTime, location } = body;

    const market = await prisma.market.create({
      data: { village, marketDay, marketTime, location },
    });

    return NextResponse.json({ success: true, data: market }, { status: 201 });
  } catch (error) {
    console.error('Create Market Error:', error);
    return NextResponse.json(
      { success: false, error: 'হাট বাজার তৈরি করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}