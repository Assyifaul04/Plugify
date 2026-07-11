import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// GET: Detail lisensi
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const license = await prisma.license.findUnique({
      where: { id },
      include: {
        _count: { select: { projects: true } },
      },
    });

    if (!license) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    return NextResponse.json(license);
  } catch (error) {
    console.error('Error in GET /api/licenses/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch license' }, { status: 500 });
  }
}

// PUT: Update lisensi (Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { name, spdxId, url } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const existing = await prisma.license.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    // Cek duplikat name (kecuali dirinya sendiri)
    if (name !== existing.name) {
      const duplicateName = await prisma.license.findUnique({
        where: { name },
      });
      if (duplicateName) {
        return NextResponse.json(
          { error: `License with name "${name}" already exists` },
          { status: 409 }
        );
      }
    }

    // Cek duplikat spdxId (kecuali dirinya sendiri)
    if (spdxId && spdxId !== existing.spdxId) {
      const duplicateSpdx = await prisma.license.findUnique({
        where: { spdxId },
      });
      if (duplicateSpdx) {
        return NextResponse.json(
          { error: `SPDX ID "${spdxId}" already exists` },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.license.update({
      where: { id },
      data: {
        name,
        spdxId: spdxId || null,
        url: url || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PUT /api/licenses/[id]:', error);
    return NextResponse.json({ error: 'Failed to update license' }, { status: 500 });
  }
}

// DELETE: Hapus lisensi (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const license = await prisma.license.findUnique({
      where: { id },
      include: { projects: { select: { id: true } } },
    });

    if (!license) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    if (license.projects.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete license that is used by projects',
          count: license.projects.length 
        },
        { status: 409 }
      );
    }

    await prisma.license.delete({ where: { id } });
    return NextResponse.json({ message: 'License deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/licenses/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete license' }, { status: 500 });
  }
}