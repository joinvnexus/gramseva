import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

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

    // নিজেকে ডিলিট করা যাবে না
    if (id === payload.id) {
      return NextResponse.json(
        { success: false, error: 'আপনি নিজেকে ডিলিট করতে পারবেন না' },
        { status: 400 }
      );
    }

    // ইউজার ডিলিট (Cascade automatically handles related records)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'ইউজার ডিলিট করা হয়েছে',
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    return NextResponse.json(
      { success: false, error: 'ইউজার ডিলিট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}