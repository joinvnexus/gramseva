// src/app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// সব রিপোর্ট পাওয়া
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const village = searchParams.get('village');

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (village) {
      where.user = { village };
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            village: true,
            phone: true,
          },
        },
        upvotes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // প্রতিটি রিপোর্টের জন্য ভোট কাউন্ট যোগ করুন
    const reportsWithCount = reports.map(report => ({
      ...report,
      upvoteCount: report.upvotes.length,
    }));

    return NextResponse.json({ success: true, data: reportsWithCount });
  } catch (error) {
    console.error('Get Reports Error:', error);
    return NextResponse.json(
      { success: false, error: 'রিপোর্ট লোড করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// নতুন রিপোর্ট তৈরি
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'লগইন করুন' },
        { status: 401 }
      );
    }

    const { verifyToken } = await import('@/lib/auth');
    const payload = verifyToken(token);

    const formData = await request.formData();
    const problemType = formData.get('problemType') as string;
    const description = formData.get('description') as string;
    const lat = formData.get('lat') as string;
    const lng = formData.get('lng') as string;
    const image = formData.get('image') as File | null;

    if (!problemType || !description) {
      return NextResponse.json(
        { success: false, error: 'প্রবলেম টাইপ এবং বিবরণ দিন' },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // ছবি আপলোড (যদি থাকে)
    if (image) {
      // TODO: Cloudinary বা অন্য স্টোরেজ সেটআপ করুন
      // অস্থায়ীভাবে লোকাল স্টোরেজ ব্যবহার করছি
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // এখানে ইমেজ আপলোড লজিক যোগ করুন
    }

    const report = await prisma.report.create({
      data: {
        userId: payload.id,
        problemType: problemType as any,
        description,
        imageUrl,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
      },
    });

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error) {
    console.error('Create Report Error:', error);
    return NextResponse.json(
      { success: false, error: 'রিপোর্ট তৈরি করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}