import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// GET: Ambil semua lisensi
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { spdxId: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    const licenses = await prisma.license.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });

    return NextResponse.json(licenses);
  } catch (error) {
    console.error('Error in GET /api/licenses:', error);
    return NextResponse.json({ error: 'Failed to fetch licenses' }, { status: 500 });
  }
}

// POST: Buat lisensi baru (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { name, spdxId, url } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Cek duplikat name
    const existingName = await prisma.license.findUnique({
      where: { name },
    });
    if (existingName) {
      return NextResponse.json(
        { error: `License with name "${name}" already exists` },
        { status: 409 }
      );
    }

    // Cek duplikat spdxId (jika ada)
    if (spdxId) {
      const existingSpdx = await prisma.license.findUnique({
        where: { spdxId },
      });
      if (existingSpdx) {
        return NextResponse.json(
          { error: `SPDX ID "${spdxId}" already exists` },
          { status: 409 }
        );
      }
    }

    const license = await prisma.license.create({
      data: {
        name,
        spdxId: spdxId || null,
        url: url || null,
      },
    });

    return NextResponse.json(license, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/licenses:', error);
    return NextResponse.json({ error: 'Failed to create license' }, { status: 500 });
  }
}