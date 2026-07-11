import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// DELETE: Hapus tag dari project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; tagId: string }> }
) {
  try {
    const { id, tagId } = await params;
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

    // Cek apakah relasi ada
    const existing = await prisma.projectTag.findUnique({
      where: {
        projectId_tagId: {
          projectId: id,
          tagId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Tag not found on this project' },
        { status: 404 }
      );
    }

    await prisma.projectTag.delete({
      where: {
        projectId_tagId: {
          projectId: id,
          tagId,
        },
      },
    });

    return NextResponse.json({ message: 'Tag removed successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/projects/[id]/tags/[tagId]:', error);
    return NextResponse.json(
      { error: 'Failed to remove tag' },
      { status: 500 }
    );
  }
}