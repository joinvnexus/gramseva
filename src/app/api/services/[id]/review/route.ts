// src/app/api/services/[id]/review/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'লগইন করুন' },
        { status: 401 }
      );
    }

    const { verifyToken } = await import('@/lib/auth');
    const payload = verifyToken(token);

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'সঠিক রেটিং দিন (১-৫)' },
        { status: 400 }
      );
    }

    // রিভিউ তৈরি
    const review = await prisma.review.create({
      data: {
        serviceId: id,
        userId: payload.id,
        rating: parseInt(rating),
        comment: comment || null,
      },
    });

    // সার্ভিসের গড় রেটিং আপডেট
    const reviews = await prisma.review.findMany({
      where: { serviceId: id },
    });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.service.update({
      where: { id },
      data: { rating: avgRating },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('Add Review Error:', error);
    return NextResponse.json(
      { success: false, error: 'রিভিউ যোগ করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}