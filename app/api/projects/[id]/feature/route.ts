import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// POST: Feature atau unfeature project
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
    const { featured } = body; // true or false

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { featured },
    });

    return NextResponse.json({
      message: `Project ${featured ? 'featured' : 'unfeatured'} successfully`,
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error in POST /api/projects/[id]/feature:', error);
    return NextResponse.json(
      { error: 'Failed to feature/unfeature project' },
      { status: 500 }
    );
  }
}