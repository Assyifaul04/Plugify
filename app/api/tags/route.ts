import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// GET: Ambil semua tags
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    const tags = await prisma.tag.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error in GET /api/tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

// POST: Buat tag baru (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Cek duplikat name atau slug
    const existing = await prisma.tag.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Tag with this name or slug already exists' },
        { status: 409 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/tags:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}