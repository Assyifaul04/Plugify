import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma, UserRole } from '@prisma/client';

const VALID_PROJECT_TYPES = [
  'MOD',
  'MODPACK',
  'SHADER',
  'PLUGIN',
  'RESOURCE_PACK',
  'DATA_PACK',
  'MAP',
];

// GET: Ambil categories (dengan pagination)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const projectType = searchParams.get('projectType');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 10));

    const where: Prisma.CategoryWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (projectType) {
      where.projectTypes = { has: projectType };
    }

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { projects: true },
          },
        },
      }),
      prisma.category.count({ where }),
    ]);

    return NextResponse.json({
      categories,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      totalCount,
    });
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

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const icon = typeof body.icon === 'string' ? body.icon.trim() : null;
    const projectTypes = body.projectTypes;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!baseSlug) {
      return NextResponse.json(
        { error: 'Name must contain at least one letter or number' },
        { status: 400 }
      );
    }

    // Cari slug unik: kalau "teknologi" sudah ada, coba "teknologi-2", dst.
    let slug = baseSlug;
    let suffix = 2;
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const validatedProjectTypes = Array.isArray(projectTypes)
      ? projectTypes.filter((type: string) => VALID_PROJECT_TYPES.includes(type))
      : [];

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