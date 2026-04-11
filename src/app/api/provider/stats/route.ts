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

    // প্রোভাইডারের সার্ভিস
    const services = await prisma.service.findMany({
      where: { userId: payload.id },
    });

    // প্রোভাইডারের সার্ভিসে বুকিং
    const bookings = await prisma.booking.findMany({
      where: {
        service: { userId: payload.id }
      },
      include: {
        user: { select: { name: true, phone: true } },
        service: { select: { category: true, hourlyRate: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;

    // মোট আয় ক্যালকুলেশন
    const totalEarnings = bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.service.hourlyRate, 0);

    // রেটিং ক্যালকুলেশন
    const reviews = await prisma.review.findMany({
      where: {
        service: { userId: payload.id }
      }
    });
    
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalServices: services.length,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          averageRating,
          totalEarnings,
        },
        recentBookings: bookings.slice(0, 10),
      },
    });
  } catch (error) {
    console.error('Provider Stats Error:', error);
    return NextResponse.json(
      { success: false, error: 'স্ট্যাটস লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}