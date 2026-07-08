import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // 👈 import authOptions
import { UserRole } from '@prisma/client';

// GET /api/users/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions); // 👈 tambahkan authOptions
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: { id },
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
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
  }

  const isOwner = session?.user?.id === id;
  const isAdmin = session?.user?.role === UserRole.ADMIN;
  if (!isOwner && !isAdmin) {
    const { email, role, suspended, ...publicData } = user;
    return NextResponse.json(publicData);
  }

  return NextResponse.json(user);
}

// PUT /api/users/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions); // 👈 tambahkan authOptions
  const { id } = params;
  const isOwner = session?.user?.id === id;
  const isAdmin = session?.user?.role === UserRole.ADMIN;

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { name, username, email, bio, image } = body;

  if (username || email) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : []),
        ],
        NOT: { id },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Username atau email sudah digunakan' },
        { status: 409 }
      );
    }
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { name, username, email, bio, image },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengupdate user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions); // 👈 tambahkan authOptions
  if (!session?.user?.role || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = params;
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menghapus user' },
      { status: 500 }
    );
  }
}