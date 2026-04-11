import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// সব ইউজার পাওয়া
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

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        village: true,
        ward: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Get Users Error:', error);
    return NextResponse.json(
      { success: false, error: 'ইউজার লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// ইউজার রোল আপডেট
export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: 'ইউজার আইডি এবং রোল প্রয়োজন' },
        { status: 400 }
      );
    }

    const validRoles = ['USER', 'PROVIDER', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'অবৈধ রোল' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });

    return NextResponse.json({
      success: true,
      message: `ইউজারের রোল পরিবর্তন করা হয়েছে`,
      data: { id: updatedUser.id, role: updatedUser.role },
    });
  } catch (error) {
    console.error('Update User Role Error:', error);
    return NextResponse.json(
      { success: false, error: 'রোল আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}