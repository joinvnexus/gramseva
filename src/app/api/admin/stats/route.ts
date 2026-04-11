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

    const [
      totalUsers,
      totalProviders,
      totalServices,
      totalReports,
      totalBookings,
      totalMarkets,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'PROVIDER' } }),
      prisma.service.count(),
      prisma.report.count(),
      prisma.booking.count(),
      prisma.market.count(),
    ]);

    const pendingReports = await prisma.report.count({
      where: { status: 'PENDING' },
    });

    const resolvedReports = await prisma.report.count({
      where: { status: 'RESOLVED' },
    });

    const processingReports = await prisma.report.count({
      where: { status: 'PROCESSING' },
    });

    const thisMonthRevenue = 0;

    const todayBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const stats = {
      totalUsers,
      totalProviders,
      totalAdmins: await prisma.user.count({ where: { role: 'ADMIN' } }),
      totalServices,
      totalReports,
      totalBookings,
      pendingReports,
      processingReports,
      resolvedReports,
      totalMarkets,
      todayBookings,
      thisMonthRevenue,
    };

    const recentActivities = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        role: true,
        createdAt: true,
      },
    }).then(users => users.map(u => ({
      id: u.id,
      type: 'user',
      title: `নতুন ইউজার: ${u.name}`,
      user: u.name,
      status: 'ACTIVE',
      createdAt: u.createdAt.toISOString(),
    })));

    return NextResponse.json({
      success: true,
      data: { stats, recentActivities },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json(
      { success: false, error: 'স্ট্যাটস লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}