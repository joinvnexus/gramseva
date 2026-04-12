// src/app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// বুকিং এর বিস্তারিত দেখা
export async function GET(
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

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, phone: true, village: true },
        },
        service: {
          include: {
            user: {
              select: { name: true, phone: true, village: true },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'বুকিং পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    // চেক করুন ইউজার বা প্রোভাইডার কিনা
    if (booking.userId !== payload.id && booking.service.userId !== payload.id) {
      return NextResponse.json(
        { success: false, error: 'আপনার এই বুকিং দেখার অনুমতি নেই' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Get Booking Error:', error);
    return NextResponse.json(
      { success: false, error: 'বুকিং লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// বুকিং স্ট্যাটাস আপডেট (শুধু প্রোভাইডার)
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
    const body = await request.json();
    const { status } = body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'বুকিং পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    // চেক করুন প্রোভাইডার কিনা
    if (booking.service.userId !== payload.id) {
      return NextResponse.json(
        { success: false, error: 'আপনার এই বুকিং আপডেট করার অনুমতি নেই' },
        { status: 403 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    // নোটিফিকেশন পাঠান ইউজারকে
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: 'বুকিং স্ট্যাটাস আপডেট',
        message: `আপনার বুকিং স্ট্যাটাস পরিবর্তন হয়েছে: ${status}`,
        type: 'SERVICE',
        data: { bookingId: booking.id },
      },
    });

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('Update Booking Error:', error);
    return NextResponse.json(
      { success: false, error: 'বুকিং আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}