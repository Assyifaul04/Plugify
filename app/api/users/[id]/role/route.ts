import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { UserRole } from '@prisma/client';

// PATCH /api/users/[id]/role
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user?.role || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = params;
  const body = await req.json();
  const { role } = body;

  if (!role || !Object.values(UserRole).includes(role)) {
    return NextResponse.json(
      { error: 'Role tidak valid. Gunakan: USER, MODERATOR, ADMIN' },
      { status: 400 }
    );
  }

  // Cek apakah user target ada
  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
  }

  // Jangan izinkan mengubah role sendiri (hindari admin mencabut haknya sendiri)
  if (id === session.user.id) {
    return NextResponse.json(
      { error: 'Tidak dapat mengubah role sendiri' },
      { status: 403 }
    );
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengubah role' },
      { status: 500 }
    );
  }
}