// src/app/api/services/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            village: true,
            ward: true,
            rating: true,
            verified: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'সার্ভিস পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error('Get Service Error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভিস লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// সার্ভিস আপডেট
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const service = await prisma.service.findUnique({
      where: { id: params.id },
    });

    if (!service || service.userId !== payload.id) {
      return NextResponse.json(
        { success: false, error: 'আপনি এই সার্ভিস আপডেট করতে পারবেন না' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { description, hourlyRate, isAvailable } = body;

    const updated = await prisma.service.update({
      where: { id: params.id },
      data: {
        description: description || undefined,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        isAvailable: isAvailable !== undefined ? isAvailable : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update Service Error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভিস আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}