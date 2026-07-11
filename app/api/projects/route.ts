// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole, ProjectStatus, GamePlatform, ProjectType } from '@prisma/client';

// Helper untuk convert BigInt ke Number
function serializeProject(project: any) {
  return {
    ...project,
    downloadCount: Number(project.downloadCount || 0),
    // jika ada field BigInt lain, tambahkan di sini
  };
}

// GET: Daftar project dengan filter & pagination
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const platform = searchParams.get('platform') as GamePlatform | null;
    const type = searchParams.get('type') as ProjectType | null;
    const status = searchParams.get('status') as ProjectStatus | null;
    const categorySlug = searchParams.get('category') || '';
    const loaderName = searchParams.get('loader') || '';
    const version = searchParams.get('version') || '';
    const sort = searchParams.get('sort') || 'newest';

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (platform) where.platform = platform;
    if (type) where.type = type;
    if (status) where.status = status;

    if (categorySlug) {
      where.categories = {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      };
    }

    if (loaderName) {
      where.versions = {
        some: {
          loaders: {
            some: {
              loader: {
                name: loaderName,
              },
            },
          },
        },
      };
    }

    if (version) {
      where.versions = {
        some: {
          gameVersions: {
            some: {
              gameVersion: {
                version: version,
              },
            },
          },
        },
      };
    }

    // Sorting
    let orderBy: any = {};
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'popular':
        orderBy = { downloadCount: 'desc' };
        break;
      case 'trending':
        orderBy = { followCount: 'desc' };
        break;
      case 'updated':
        orderBy = { updatedAt: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
          versions: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: {
              gameVersions: {
                include: {
                  gameVersion: true,
                },
              },
              loaders: {
                include: {
                  loader: true,
                },
              },
            },
          },
          _count: {
            select: {
              reviews: true,
              follows: true,
            },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    // Serialize projects (convert BigInt to Number)
    const serializedProjects = projects.map(serializeProject);

    return NextResponse.json({
      data: serializedProjects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST: Buat project baru (hanya user yang login)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
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
      categories, // array of category slugs
      tags, // array of tag slugs (optional)
    } = body;

    // Validasi wajib
    if (!name || !summary || !description || !type) {
      return NextResponse.json(
        { error: 'Name, summary, description, and type are required' },
        { status: 400 }
      );
    }

    // Generate slug dari name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Cek duplikat slug
    const existing = await prisma.project.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Project with this name already exists' },
        { status: 409 }
      );
    }

    // Siapkan data untuk create
    const projectData: any = {
      slug,
      name,
      summary,
      description,
      type,
      platform: platform || GamePlatform.JAVA,
      status: status || ProjectStatus.DRAFT,
      iconUrl,
      bannerUrl,
      sourceUrl,
      issuesUrl,
      wikiUrl,
      discordUrl,
      donationUrl,
      licenseId,
      organizationId,
      authorId: session.user.id,
    };

    // Jika status PUBLISHED, set publishedAt
    if (status === ProjectStatus.PUBLISHED) {
      projectData.publishedAt = new Date();
    }

    // Buat project
    const project = await prisma.project.create({
      data: projectData,
    });

    // Tambahkan kategori jika ada
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const categoryConnections = await Promise.all(
        categories.map(async (slug: string) => {
          const category = await prisma.category.findUnique({
            where: { slug },
          });
          if (!category) {
            throw new Error(`Category with slug "${slug}" not found`);
          }
          return { categoryId: category.id };
        })
      );

      await prisma.projectCategory.createMany({
        data: categoryConnections.map((conn) => ({
          projectId: project.id,
          categoryId: conn.categoryId,
        })),
      });
    }

    // Tambahkan tag jika ada
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagConnections = await Promise.all(
        tags.map(async (name: string) => {
          const tag = await prisma.tag.findUnique({
            where: { name },
          });
          if (!tag) {
            throw new Error(`Tag with name "${name}" not found`);
          }
          return { tagId: tag.id };
        })
      );

      await prisma.projectTag.createMany({
        data: tagConnections.map((conn) => ({
          projectId: project.id,
          tagId: conn.tagId,
        })),
      });
    }

    // Ambil project yang sudah jadi dengan relasi
    const created = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        author: {
          select: { id: true, name: true, username: true },
        },
        categories: {
          include: { category: true },
        },
        tags: {
          include: { tag: true },
        },
      },
    });

    // Serialize before send
    const serialized = serializeProject(created);
    return NextResponse.json(serialized, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}