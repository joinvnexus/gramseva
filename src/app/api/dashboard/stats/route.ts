// src/app/api/dashboard/stats/route.ts
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

    // ইউজারের রিপোর্ট স্ট্যাটস
    const reports = await prisma.report.findMany({
      where: { userId: payload.id },
      select: { status: true },
    });

    const myReports = reports.length;
    const resolvedReports = reports.filter(r => r.status === 'RESOLVED').length;

    // ইউজারের সার্ভিস স্ট্যাটস (যদি প্রোভাইডার হয়)
    let myServices = 0;
    let totalBookings = 0;

    if (payload.role === 'PROVIDER') {
      myServices = await prisma.service.count({
        where: { userId: payload.id },
      });
      // TODO: বুকিং সিস্টেম যোগ করলে এখানে বুকিং কাউন্ট যোগ করুন
    }

    // সাম্প্রতিক রিপোর্ট
    const recentReports = await prisma.report.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        problemType: true,
        description: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          myReports,
          myServices,
          resolvedReports,
          totalBookings,
        },
        recentReports,
      },
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    return NextResponse.json(
      { success: false, error: 'ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}