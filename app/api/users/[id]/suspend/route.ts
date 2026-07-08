import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { UserRole } from '@prisma/client';

// PATCH /api/users/[id]/suspend
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
  // Terima { suspended: true/false } atau jika tidak ada, toggle
  let suspended = body.suspended;
  if (suspended === undefined) {
    // toggle: ambil status sekarang
    const current = await prisma.user.findUnique({
      where: { id },
      select: { suspended: true },
    });
    if (!current) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }
    suspended = !current.suspended;
  }

  // Cegah suspend diri sendiri
  if (id === session.user.id) {
    return NextResponse.json(
      { error: 'Tidak dapat suspend diri sendiri' },
      { status: 403 }
    );
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { suspended },
    });
    return NextResponse.json({
      message: suspended ? 'User di-suspend' : 'User di-unsuspend',
      user: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengubah status suspend' },
      { status: 500 }
    );
  }
}