import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const body = await request.json();
    const { name, village, ward } = body;

    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: {
        name: name || undefined,
        village: village || undefined,
        ward: ward ? parseInt(ward.toString()) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'প্রোফাইল আপডেট করা হয়েছে',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        village: updatedUser.village,
        ward: updatedUser.ward,
      },
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json(
      { success: false, error: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}