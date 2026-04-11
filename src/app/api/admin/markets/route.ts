import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// সব মার্কেট পাওয়া
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const admin = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'অ্যাডমিন অ্যাক্সেস প্রয়োজন' },
        { status: 403 }
      );
    }

    const markets = await prisma.market.findMany({
      include: {
        prices: {
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
      orderBy: { village: 'asc' },
    });

    return NextResponse.json({ success: true, data: markets });
  } catch (error) {
    console.error('Get Markets Error:', error);
    return NextResponse.json(
      { success: false, error: 'হাট বাজার লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// নতুন মার্কেট যোগ
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const admin = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'অ্যাডমিন অ্যাক্সেস প্রয়োজন' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { village, marketDay, marketTime, location } = body;

    const market = await prisma.market.create({
      data: {
        village,
        marketDay,
        marketTime,
        location,
      },
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