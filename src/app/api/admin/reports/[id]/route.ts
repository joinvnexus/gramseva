import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// রিপোর্ট স্ট্যাটাস আপডেট
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
    const { status } = body;

    const updatedReport = await prisma.report.update({
      where: { id },
      data: { status },
    });

    // নোটিফিকেশন তৈরি করুন
    await prisma.notification.create({
      data: {
        userId: updatedReport.userId,
        title: 'রিপোর্ট স্ট্যাটাস আপডেট',
        message: `আপনার রিপোর্ট স্ট্যাটাস পরিবর্তন হয়েছে: ${status}`,
        type: 'REPORT',
        data: { reportId: id, status },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'রিপোর্ট স্ট্যাটাস আপডেট করা হয়েছে',
      data: updatedReport,
    });
  } catch (error) {
    console.error('Update Report Error:', error);
    return NextResponse.json(
      { success: false, error: 'রিপোর্ট আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// রিপোর্ট ডিলিট
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

    await prisma.report.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'রিপোর্ট ডিলিট করা হয়েছে',
    });
  } catch (error) {
    console.error('Delete Report Error:', error);
    return NextResponse.json(
      { success: false, error: 'রিপোর্ট ডিলিট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}