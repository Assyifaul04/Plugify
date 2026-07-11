import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole, GamePlatform, ProjectType } from '@prisma/client';

// GET: Ambil semua loaders
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const platform = searchParams.get('platform') as GamePlatform | null;
    const projectType = searchParams.get('projectType') as ProjectType | null;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (platform) {
      where.platform = platform;
    }

    if (projectType) {
      where.supportedTypes = { has: projectType };
    }

    const loaders = await prisma.loader.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        versions: {
          select: {
            versionId: true,
          },
        },
      },
    });

    // Format response
    const formattedLoaders = loaders.map(loader => ({
      ...loader,
      versionCount: loader.versions.length,
      versions: undefined,
    }));

    return NextResponse.json(formattedLoaders);
  } catch (error) {
    console.error('Error in GET /api/loaders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loaders' },
      { status: 500 }
    );
  }
}

// POST: Buat loader baru (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await req.json();
    const { name, icon, platform, supportedTypes } = body;

    // Validasi input
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Cek duplikat name
    const existing = await prisma.loader.findUnique({
      where: { name },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Loader with this name already exists' },
        { status: 409 }
      );
    }

    // Validasi platform
    if (!platform || !Object.values(GamePlatform).includes(platform)) {
      return NextResponse.json(
        { error: 'Valid platform is required (JAVA or BEDROCK)' },
        { status: 400 }
      );
    }

    // Validasi supportedTypes
    const validProjectTypes = Object.values(ProjectType);
    const validatedTypes = Array.isArray(supportedTypes)
      ? supportedTypes.filter((t: string) => validProjectTypes.includes(t as ProjectType))
      : [];

    const loader = await prisma.loader.create({
      data: {
        name,
        icon: icon || null,
        platform,
        supportedTypes: validatedTypes,
      },
    });

    return NextResponse.json(loader, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/loaders:', error);
    return NextResponse.json(
      { error: 'Failed to create loader' },
      { status: 500 }
    );
  }
}