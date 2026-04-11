import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// সব সার্ভিস পাওয়া
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

    const services = await prisma.service.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            village: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Get Services Error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভিস লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}