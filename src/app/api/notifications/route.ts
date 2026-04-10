// src/app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// ইউজারের নোটিফিকেশন পাওয়া
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const where: any = { userId: payload.id };
    if (unreadOnly) where.isRead = false;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    return NextResponse.json(
      { success: false, error: 'নোটিফিকেশন লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// নোটিফিকেশন রিড মার্ক করা
export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const { notificationId, markAll } = await request.json();

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId: payload.id, isRead: false },
        data: { isRead: true },
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark Read Error:', error);
    return NextResponse.json(
      { success: false, error: 'নোটিফিকেশন আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// নোটিফিকেশন সেন্ড (অ্যাডমিন)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const { verifyToken } = await import('@/lib/auth');
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'শুধু অ্যাডমিন নোটিফিকেশন পাঠাতে পারেন' },
        { status: 403 }
      );
    }

    const { userId, title, message, type, data } = await request.json();

    const notification = await prisma.notification.create({
      data: {
        userId: userId || payload.id,
        title,
        message,
        type: type || 'GENERAL',
        data: data || {},
      },
    });

    // TODO: পুশ নোটিফিকেশন পাঠানোর জন্য FCM কল

    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    console.error('Send Notification Error:', error);
    return NextResponse.json(
      { success: false, error: 'নোটিফিকেশন পাঠাতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}