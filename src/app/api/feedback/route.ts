// src/app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const { type, content, audioUrl, rating } = await request.json();

    const feedback = await prisma.feedback.create({
      data: {
        userId: payload.id,
        type: type || 'TEXT',
        content: content || null,
        audioUrl: audioUrl || null,
        rating: rating || null,
      },
    });

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Create Feedback Error:', error);
    return NextResponse.json(
      { success: false, error: 'ফিডব্যাক পাঠাতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isRead = searchParams.get('isRead');
    const myFeedback = searchParams.get('my') === 'true';

    const where: any = {};
    
    if (myFeedback) {
      where.userId = payload.id;
    } else if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'শুধু অ্যাডমিন সকল ফিডব্যাক দেখতে পারেন' },
        { status: 403 }
      );
    }
    
    if (type) where.type = type;
    if (isRead !== null) where.isRead = isRead === 'true';

    const feedback = await prisma.feedback.findMany({
      where,
      include: { user: { select: { id: true, name: true, phone: true, village: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Get Feedback Error:', error);
    return NextResponse.json(
      { success: false, error: 'ফিডব্যাক লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'শুধু অ্যাডমিন ফিডব্যাক আপডেট করতে পারেন' },
        { status: 403 }
      );
    }

    const { feedbackId, isRead } = await request.json();

    const feedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { isRead },
    });

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Update Feedback Error:', error);
    return NextResponse.json(
      { success: false, error: 'ফিডব্যাক আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'শুধু অ্যাডমিন ফিডব্যাক ডিলিট করতে পারেন' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const feedbackId = searchParams.get('id');

    if (!feedbackId) {
      return NextResponse.json({ success: false, error: 'ফিডব্যাক আইডি প্রয়োজন' }, { status: 400 });
    }

    await prisma.feedback.delete({ where: { id: feedbackId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Feedback Error:', error);
    return NextResponse.json(
      { success: false, error: 'ফিডব্যাক ডিলিট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}