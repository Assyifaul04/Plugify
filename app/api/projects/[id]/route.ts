import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole, ProjectStatus } from '@prisma/client';

// GET: Detail project by ID atau slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        license: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        versions: {
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
            files: true,
          },
        },
        gallery: {
          orderBy: { ordering: 'asc' },
        },
        _count: {
          select: {
            follows: true,
            reviews: true,
            reports: true,
          },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
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

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error in GET /api/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT: Update project
export async function PUT(
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

    // Cek permission: hanya author atau admin
    const isAuthor = project.authorId === session.user.id;
    const isAdmin = session.user.role === UserRole.ADMIN;

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
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

    // Siapkan data update
    const updateData: any = {};

    if (name) {
      // Generate slug baru jika nama berubah
      const newSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Cek duplikat slug
      const existing = await prisma.project.findFirst({
        where: {
          slug: newSlug,
          NOT: { id },
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: 'Project with this name already exists' },
          { status: 409 }
        );
      }
      updateData.name = name;
      updateData.slug = newSlug;
    }

    if (summary) updateData.summary = summary;
    if (description) updateData.description = description;
    if (type) updateData.type = type;
    if (platform) updateData.platform = platform;
    if (status) {
      updateData.status = status;
      if (status === ProjectStatus.PUBLISHED && !project.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (iconUrl !== undefined) updateData.iconUrl = iconUrl;
    if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;
    if (sourceUrl !== undefined) updateData.sourceUrl = sourceUrl;
    if (issuesUrl !== undefined) updateData.issuesUrl = issuesUrl;
    if (wikiUrl !== undefined) updateData.wikiUrl = wikiUrl;
    if (discordUrl !== undefined) updateData.discordUrl = discordUrl;
    if (donationUrl !== undefined) updateData.donationUrl = donationUrl;
    if (licenseId !== undefined) updateData.licenseId = licenseId;
    if (organizationId !== undefined) updateData.organizationId = organizationId;

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PUT /api/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE: Hapus project
export async function DELETE(
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

    // Hapus project (cascade akan menghapus relasi)
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}