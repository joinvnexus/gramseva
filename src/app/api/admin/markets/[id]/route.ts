import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// মার্কেট স্ট্যাটাস আপডেট
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    const { isActive } = body;

    const updatedMarket = await prisma.market.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      message: `হাট বাজার ${isActive ? 'চালু' : 'বন্ধ'} করা হয়েছে`,
      data: updatedMarket,
    });
  } catch (error) {
    console.error('Update Market Error:', error);
    return NextResponse.json(
      { success: false, error: 'হাট বাজার আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// মার্কেট ডিলিট
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    await prisma.market.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'হাট বাজার ডিলিট করা হয়েছে',
    });
  } catch (error) {
    console.error('Delete Market Error:', error);
    return NextResponse.json(
      { success: false, error: 'হাট বাজার ডিলিট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}