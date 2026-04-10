// src/app/api/markets/prices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const product = searchParams.get('product');
    const marketId = searchParams.get('marketId');

    const where: any = {};
    if (product) where.product = { contains: product, mode: 'insensitive' };
    if (marketId) where.marketId = marketId;

    const prices = await prisma.price.findMany({
      where,
      include: {
        market: {
          select: { village: true, marketDay: true },
        },
      },
      orderBy: { date: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, data: prices });
  } catch (error) {
    console.error('Get Prices Error:', error);
    return NextResponse.json(
      { success: false, error: 'দরের তথ্য লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

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

    if (!user || (user.role !== 'ADMIN' && user.role !== 'PROVIDER')) {
      return NextResponse.json(
        { success: false, error: 'দর যোগ করার অনুমতি নেই' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { marketId, product, price, unit } = body;

    const priceData = await prisma.price.create({
      data: {
        marketId,
        product,
        price: parseFloat(price),
        unit: unit || 'কেজি',
      },
    });

    return NextResponse.json({ success: true, data: priceData }, { status: 201 });
  } catch (error) {
    console.error('Create Price Error:', error);
    return NextResponse.json(
      { success: false, error: 'দর যোগ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}