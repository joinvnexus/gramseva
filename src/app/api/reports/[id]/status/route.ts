// src/app/api/reports/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
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

    // চেক করুন ইউজার অ্যাডমিন কিনা
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'শুধু অ্যাডমিন স্ট্যাটাস আপডেট করতে পারেন' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const report = await prisma.report.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('Update Status Error:', error);
    return NextResponse.json(
      { success: false, error: 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}