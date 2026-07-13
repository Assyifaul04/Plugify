import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// PUT: Update categories for a project
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
    const { categoryIds } = body;

    if (!Array.isArray(categoryIds)) {
      return NextResponse.json(
        { error: 'categoryIds must be an array' },
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

    // Hapus semua categories yang ada
    await prisma.projectCategory.deleteMany({
      where: { projectId: id },
    });

    // Tambahkan categories baru
    if (categoryIds.length > 0) {
      await prisma.projectCategory.createMany({
        data: categoryIds.map((categoryId: string) => ({
          projectId: id,
          categoryId,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/projects/[id]/categories:', error);
    return NextResponse.json(
      { error: 'Failed to update categories' },
      { status: 500 }
    );
  }
}