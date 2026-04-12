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
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'অ্যাডমিন অ্যাক্সেস প্রয়োজন' },
        { status: 403 }
      );
    }

    // সমস্ত স্ট্যাটস একসাথে গণনা
    const [
      totalUsers,
      totalProviders,
      totalAdmins,
      totalServices,
      totalReports,
      totalBookings,
      totalMarkets,
      pendingReports,
      processingReports,
      resolvedReports,
      todayBookings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'PROVIDER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.service.count(),
      prisma.report.count(),
      prisma.booking.count(),
      prisma.market.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { status: 'PROCESSING' } }),
      prisma.report.count({ where: { status: 'RESOLVED' } }),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    // আয় গণনা (শুধু কমপ্লিটেড বুকিং থেকে)
    const completedBookings = await prisma.booking.findMany({
      where: { status: 'COMPLETED' },
      include: { service: true },
    });
    
    const thisMonthRevenue = completedBookings
      .filter((b: { createdAt: Date }) => b.createdAt.getMonth() === new Date().getMonth())
      .reduce((sum: number, b: { service: { hourlyRate: number } | null }) => sum + (b.service?.hourlyRate || 0), 0);

    // সাম্প্রতিক কার্যকলাপ
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentReports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: true },
    });

    const recentBookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: true, service: true },
    });

    const userActivities = recentUsers.map((u: typeof recentUsers[number]) => ({
      id: u.id,
      type: 'user' as const,
      title: `নতুন ইউজার রেজিস্ট্রেশন: ${u.name}`,
      user: u.name,
      status: 'ACTIVE',
      createdAt: u.createdAt.toISOString(),
    }));

    const reportActivities = recentReports.map((r: typeof recentReports[number]) => ({
      id: r.id,
      type: 'report' as const,
      title: `নতুন রিপোর্ট: ${r.description.substring(0, 50)}`,
      user: r.user?.name || 'অজানা',
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));

    const bookingActivities = recentBookings.map((b: typeof recentBookings[number]) => ({
      id: b.id,
      type: 'booking' as const,
      title: `${b.user?.name} একটি সার্ভিস বুক করেছেন`,
      user: b.user?.name || 'অজানা',
      status: b.status,
      createdAt: b.createdAt.toISOString(),
    }));

    const recentActivities = [...userActivities, ...reportActivities, ...bookingActivities]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
     .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProviders,
          totalAdmins,
          totalServices,
          totalReports,
          totalBookings,
          totalMarkets,
          pendingReports,
          processingReports,
          resolvedReports,
          todayBookings,
          thisMonthRevenue,
        },
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json(
      { success: false, error: 'স্ট্যাটস লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}