import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// GET: Daftar tag dari project
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const tags = project.tags.map((pt) => pt.tag);
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error in GET /api/projects/[id]/tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST: Tambahkan tag ke project
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const isAuthor = project.authorId === session.user.id;
    const isAdmin = session.user.role === UserRole.ADMIN;

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { tagName } = body;

    if (!tagName) {
      return NextResponse.json(
        { error: 'tagName is required' },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.findUnique({
      where: { name: tagName },
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Cek apakah sudah ada
    const existing = await prisma.projectTag.findUnique({
      where: {
        projectId_tagId: {
          projectId: id,
          tagId: tag.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Tag already assigned to this project' },
        { status: 409 }
      );
    }

    await prisma.projectTag.create({
      data: {
        projectId: id,
        tagId: tag.id,
      },
    });

    return NextResponse.json(
      { message: 'Tag added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/projects/[id]/tags:', error);
    return NextResponse.json(
      { error: 'Failed to add tag' },
      { status: 500 }
    );
  }
}