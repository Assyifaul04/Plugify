import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// GET: Ambil semua categories
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const projectType = searchParams.get('projectType');

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (projectType) {
      where.projectTypes = { has: projectType };
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      include: {
        projects: {
          select: {
            projectId: true,
          },
        },
      },
    });

    // Format response dengan count projects
    const formattedCategories = categories.map(category => ({
      ...category,
      projectCount: category.projects.length,
      projects: undefined, // Hapus field projects dari response
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST: Buat category baru
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Cek autentikasi
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Hanya ADMIN yang bisa membuat category
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, icon, projectTypes } = body;

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

    // Cek apakah slug sudah ada
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
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

    // Buat category baru
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        icon: icon || null,
        projectTypes: validatedProjectTypes,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}