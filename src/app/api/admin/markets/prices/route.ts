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