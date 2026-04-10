// src/app/api/reports/[id]/vote/route.ts
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

    // চেক করুন ইউজার আগে ভোট দিয়েছে কিনা
    const existingVote = await prisma.reportUpvote.findUnique({
      where: {
        reportId_userId: {
          reportId: id,
          userId: payload.id,
        },
      },
    });

    if (existingVote) {
      // ভোট রিমুভ করুন (আনভোট)
      await prisma.reportUpvote.delete({
        where: {
          reportId_userId: {
            reportId: id,
            userId: payload.id,
          },
        },
      });

      await prisma.report.update({
        where: { id: id },
        data: { upVotes: { decrement: 1 } },
      });

      return NextResponse.json({ success: true, data: { voted: false } });
    } else {
      // ভোট যোগ করুন
      await prisma.reportUpvote.create({
        data: {
          reportId: id,
          userId: payload.id,
        },
      });

      await prisma.report.update({
        where: { id: id },
        data: { upVotes: { increment: 1 } },
      });

      return NextResponse.json({ success: true, data: { voted: true } });
    }
  } catch (error) {
    console.error('Vote Error:', error);
    return NextResponse.json(
      { success: false, error: 'ভোট দিতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}