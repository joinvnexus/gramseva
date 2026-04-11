import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// সার্ভিস আপডেট (স্ট্যাটাস টগল)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { isAvailable } = body;

    const updatedService = await prisma.service.update({
      where: { id: params.id },
      data: { isAvailable },
    });

    return NextResponse.json({
      success: true,
      message: `সার্ভিস ${isAvailable ? 'চালু' : 'বন্ধ'} করা হয়েছে`,
      data: updatedService,
    });
  } catch (error) {
    console.error('Update Service Error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভিস আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// সার্ভিস ডিলিট
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.service.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'সার্ভিস ডিলিট করা হয়েছে',
    });
  } catch (error) {
    console.error('Delete Service Error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভিস ডিলিট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}