import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole, ProjectStatus } from '@prisma/client';

// POST: Publish atau unpublish project
export async function POST(
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
    const { action } = body; // 'publish' or 'unpublish'

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    let newStatus: ProjectStatus;
    let publishedAt: Date | null = null;

    if (action === 'publish') {
      newStatus = ProjectStatus.PUBLISHED;
      publishedAt = new Date();
    } else if (action === 'unpublish') {
      newStatus = ProjectStatus.DRAFT;
      publishedAt = null;
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "publish" or "unpublish"' },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt,
      },
    });

    return NextResponse.json({
      message: `Project ${action === 'publish' ? 'published' : 'unpublished'} successfully`,
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error in POST /api/projects/[id]/publish:', error);
    return NextResponse.json(
      { error: 'Failed to publish/unpublish project' },
      { status: 500 }
    );
  }
}