// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// ইউজারের সব বুকিং পাওয়া
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);

    const bookings = await prisma.booking.findMany({
      where: { userId: payload.id },
      include: {
        service: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
                village: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    return NextResponse.json(
      { success: false, error: 'বুকিং লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// নতুন বুকিং তৈরি
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'লগইন করুন' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const body = await request.json();
    const { serviceId, date, address } = body;

    // ভ্যালিডেশন
    if (!serviceId || !date || !address) {
      return NextResponse.json(
        { success: false, error: 'সব তথ্য পূরণ করুন' },
        { status: 400 }
      );
    }

    // সার্ভিস চেক করুন
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { user: true },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'সার্ভিসটি পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    if (!service.isAvailable) {
      return NextResponse.json(
        { success: false, error: 'সার্ভিসটি বর্তমানে বন্ধ আছে' },
        { status: 400 }
      );
    }

    // বুকিং তৈরি
    const booking = await prisma.booking.create({
      data: {
        userId: payload.id,
        serviceId,
        date: new Date(date),
        address,
        status: 'PENDING',
      },
    });

    // নোটিফিকেশন তৈরি করুন (সার্ভিস প্রোভাইডারকে জানানোর জন্য)
    await prisma.notification.create({
      data: {
        userId: service.userId,
        title: 'নতুন বুকিং',
        message: `${payload.id} নামক ইউজার আপনার সার্ভিস বুক করেছেন`,
        type: 'SERVICE',
        data: { bookingId: booking.id },
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: booking,
      message: 'বুকিং সফল হয়েছে! প্রোভাইডার শীঘ্রই যোগাযোগ করবেন।'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create Booking Error:', error);
    return NextResponse.json(
      { success: false, error: 'বুকিং করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}