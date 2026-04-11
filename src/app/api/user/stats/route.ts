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

    // রিপোর্ট স্ট্যাটস
    const reports = await prisma.report.findMany({
      where: { userId: payload.id },
    });
    
    const totalReports = reports.length;
    const resolvedReports = reports.filter(r => r.status === 'RESOLVED').length;
    const pendingReports = reports.filter(r => r.status === 'PENDING').length;

    // বুকিং স্ট্যাটস
    const bookings = await prisma.booking.findMany({
      where: { userId: payload.id },
    });
    
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;

    // আপভোট স্ট্যাটস
    const upvotes = await prisma.reportUpvote.findMany({
      where: { userId: payload.id },
    });

    // সাম্প্রতিক কার্যকলাপ
    const recentReports = await prisma.report.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        description: true,
        status: true,
        createdAt: true,
      },
    });

    const recentBookings = await prisma.booking.findMany({
      where: { userId: payload.id },
      include: {
        service: {
          select: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentActivities = [
      ...recentReports.map(r => ({
        id: r.id,
        type: 'report' as const,
        title: r.description.substring(0, 50),
        status: r.status,
        date: r.createdAt.toISOString(),
      })),
      ...recentBookings.map(b => ({
        id: b.id,
        type: 'booking' as const,
        title: `${b.service.category} সার্ভিস বুকিং`,
        status: b.status,
        date: b.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
     .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalReports,
          resolvedReports,
          pendingReports,
          totalBookings,
          completedBookings,
          upvotedReports: upvotes.length,
        },
        recentActivities,
      },
    });
  } catch (error) {
    console.error('User Stats Error:', error);
    return NextResponse.json(
      { success: false, error: 'স্ট্যাটস লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}