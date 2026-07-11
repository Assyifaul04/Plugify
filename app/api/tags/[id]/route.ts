import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// GET: Detail tag
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: { select: { projects: true } },
      },
    });

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error in GET /api/tags/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
  }
}

// PUT: Update tag (Admin only)
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
    const { name, slug } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Cek duplikat name atau slug kecuali dirinya sendiri
    const duplicate = await prisma.tag.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
        NOT: { id },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: 'Tag with this name or slug already exists' },
        { status: 409 }
      );
    }

    const updated = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PUT /api/tags/[id]:', error);
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

// DELETE: Hapus tag (Admin only)
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

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: { projects: { select: { projectId: true } } },
    });

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    if (tag.projects.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete tag that is used by projects',
          count: tag.projects.length 
        },
        { status: 409 }
      );
    }

    await prisma.tag.delete({ where: { id } });
    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/tags/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}