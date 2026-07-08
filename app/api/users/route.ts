import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth'; // sesuaikan dengan auth Anda
import { UserRole } from '@prisma/client';

// GET /api/users - daftar user (hanya admin)
export async function GET(req: NextRequest) {
  const session = await getServerSession();
  // Hanya admin yang boleh melihat semua user
  if (!session?.user?.role || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;
  const role = searchParams.get('role') as UserRole | null;
  const search = searchParams.get('search') || '';

  const where = {
    ...(role && { role }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        suspended: true,
        createdAt: true,
        updatedAt: true,
        // jangan tampilkan field sensitif seperti password (tidak ada di model)
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    data: users,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// POST /api/users - buat user baru (hanya admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.role || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { name, username, email, bio, role } = body;

  // validasi sederhana
  if (!email && !username) {
    return NextResponse.json(
      { error: 'Email atau username harus diisi' },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        bio,
        role: role || UserRole.USER,
        // emailVerified bisa diisi null, image default null
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Username atau email sudah terdaftar' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 });
  }
}