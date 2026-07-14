import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole, Prisma, ProjectStatus, ProjectType, GamePlatform } from '@prisma/client';
import { serializeBigInts } from '@/lib/serializer';

// GET: Ambil semua projects dengan pagination & filter
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const platform = searchParams.get('platform') || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 10));

    const where: Prisma.ProjectWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type && type !== 'ALL') {
      where.type = type as ProjectType;
    }

    if (platform && platform !== 'ALL') {
      where.platform = platform as GamePlatform;
    }

    if (status && status !== 'ALL') {
      where.status = status as ProjectStatus;
    }

    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          platform: true,
          status: true,
          iconUrl: true,
          downloadCount: true,
          followCount: true,
          createdAt: true,
          publishedAt: true,
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          _count: {
            select: {
              versions: true,
              follows: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    // Serialize semua BigInt fields menggunakan utility function
    const serializedProjects = projects.map(project => serializeBigInts(project));

    return NextResponse.json({
      projects: serializedProjects,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST: Buat project baru
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      summary,
      description,
      type,
      platform,
      status,
      iconUrl,
      bannerUrl,
      sourceUrl,
      issuesUrl,
      wikiUrl,
      discordUrl,
      donationUrl,
      licenseId,
      organizationId,
    } = body;

    // Validasi
    if (!name || !summary || !description || !type || !platform) {
      return NextResponse.json(
        { error: 'Name, summary, description, type, and platform are required' },
        { status: 400 }
      );
    }

    // Generate slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let suffix = 2;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        summary,
        description,
        type: type as ProjectType,
        platform: platform as GamePlatform,
        status: (status as ProjectStatus) || ProjectStatus.DRAFT,
        iconUrl: iconUrl || null,
        bannerUrl: bannerUrl || null,
        sourceUrl: sourceUrl || null,
        issuesUrl: issuesUrl || null,
        wikiUrl: wikiUrl || null,
        discordUrl: discordUrl || null,
        donationUrl: donationUrl || null,
        licenseId: licenseId || null,
        organizationId: organizationId || null,
        authorId: session.user.id,
        publishedAt: status === ProjectStatus.PUBLISHED ? new Date() : null,
      },
    });

    // Serialize semua BigInt fields menggunakan utility function
    const serializedProject = serializeBigInts(project);

    return NextResponse.json(serializedProject, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}