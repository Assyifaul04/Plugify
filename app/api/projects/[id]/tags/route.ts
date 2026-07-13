import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// PUT: Update tags for a project
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { tagIds } = body;

    if (!Array.isArray(tagIds)) {
      return NextResponse.json(
        { error: 'tagIds must be an array' },
        { status: 400 }
      );
    }

    // Cek apakah project ada
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Hapus semua tags yang ada
    await prisma.projectTag.deleteMany({
      where: { projectId: id },
    });

    // Tambahkan tags baru
    if (tagIds.length > 0) {
      await prisma.projectTag.createMany({
        data: tagIds.map((tagId: string) => ({
          projectId: id,
          tagId,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/projects/[id]/tags:', error);
    return NextResponse.json(
      { error: 'Failed to update tags' },
      { status: 500 }
    );
  }
}