import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// GET: Daftar kategori dari project
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        categories: {
          include: {
            category: true,
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

    const categories = project.categories.map((pc) => pc.category);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error in GET /api/projects/[id]/categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST: Tambahkan kategori ke project
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
    const { categorySlug } = body;

    if (!categorySlug) {
      return NextResponse.json(
        { error: 'categorySlug is required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Cek apakah sudah ada
    const existing = await prisma.projectCategory.findUnique({
      where: {
        projectId_categoryId: {
          projectId: id,
          categoryId: category.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Category already assigned to this project' },
        { status: 409 }
      );
    }

    await prisma.projectCategory.create({
      data: {
        projectId: id,
        categoryId: category.id,
      },
    });

    return NextResponse.json(
      { message: 'Category added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/projects/[id]/categories:', error);
    return NextResponse.json(
      { error: 'Failed to add category' },
      { status: 500 }
    );
  }
}