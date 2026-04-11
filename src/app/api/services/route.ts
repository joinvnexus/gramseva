// src/app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const village = searchParams.get('village');
    const search = searchParams.get('search');

    const where: any = {
      isAvailable: true,
    };

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (village) {
      where.user = { village };
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            village: true,
            ward: true,
            rating: true,
            phone: true,
          },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { rating: 'desc' },
    });

    console.log('Services query result:', services.length);
    
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Get Services Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'সার্ভিস লোড করতে সমস্যা হয়েছে', details: errorMessage },
      { status: 500 }
    );
  }
}

// নতুন সার্ভিস তৈরি (শুধু PROVIDER)
export async function POST(request: NextRequest) {
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

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.role !== 'PROVIDER') {
      return NextResponse.json(
        { success: false, error: 'শুধু সার্ভিস প্রোভাইডাররা পারবেন' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { category: requestedCategory, description, hourlyRate } = body;

    const category = requestedCategory || user.providerType;

    if (!category || !description || !hourlyRate) {
      return NextResponse.json(
        { success: false, error: 'সব তথ্য পূরণ করুন' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        userId: user.id,
        category,
        description,
        hourlyRate: parseFloat(hourlyRate),
      },
    });

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error('Create Service Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'সার্ভিস তৈরি করতে সমস্যা হয়েছে', details: errorMessage },
      { status: 500 }
    );
  }
}
