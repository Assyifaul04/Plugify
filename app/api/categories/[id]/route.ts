import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// GET: Ambil category by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                slug: true,
                type: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Format response
    const formattedCategory = {
      ...category,
      projects: category.projects.map(p => p.project),
      projectCount: category.projects.length,
    };

    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error('Error in GET /api/categories/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT: Update category
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Cek autentikasi
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Hanya ADMIN yang bisa update category
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, icon, projectTypes } = body;

    // Cek apakah category ada
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Validasi input
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate slug dari name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Cek apakah slug sudah digunakan oleh category lain
    const slugExists = await prisma.category.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (slugExists) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }

    // Validasi projectTypes
    const validProjectTypes = ['MOD', 'MODPACK', 'SHADER', 'PLUGIN', 'RESOURCE_PACK', 'DATA_PACK', 'MAP'];
    const validatedProjectTypes = projectTypes?.filter((type: string) => 
      validProjectTypes.includes(type)
    ) || [];

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        icon: icon || null,
        projectTypes: validatedProjectTypes,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error in PUT /api/categories/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE: Hapus category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Cek autentikasi
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Hanya ADMIN yang bisa delete category
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    // Cek apakah category ada
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        projects: {
          select: {
            projectId: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Cek apakah category masih digunakan oleh project
    if (category.projects.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete category that is used by projects',
          projectCount: category.projects.length 
        },
        { status: 409 }
      );
    }

    // Hapus category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Error in DELETE /api/categories/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}