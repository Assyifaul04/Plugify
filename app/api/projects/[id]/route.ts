import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// GET: Ambil project by ID (detail)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
            role: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        license: {
          select: {
            id: true,
            name: true,
            spdxId: true,
            url: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            versionNumber: true,
            name: true,
            channel: true,
            createdAt: true,
            downloadCount: true,
            _count: {
              select: {
                files: true,
              },
            },
          },
        },
        gallery: {
          orderBy: { ordering: 'asc' },
          select: {
            id: true,
            url: true,
            caption: true,
            isCover: true,
          },
        },
        _count: {
          select: {
            versions: true,
            follows: true,
            reviews: true,
            reports: true,
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

    // Log untuk debugging
    console.log('Project data:', {
      id: project.id,
      name: project.name,
      summary: project.summary,
      description: project.description?.substring(0, 50),
      iconUrl: project.iconUrl,
      bannerUrl: project.bannerUrl,
    });

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

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Update project body:', body);

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

    // Cek apakah project ada
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Validasi
    if (!name || !summary || !description || !type || !platform) {
      return NextResponse.json(
        { error: 'Name, summary, description, type, and platform are required' },
        { status: 400 }
      );
    }

    // Generate slug jika name berubah
    let slug = existingProject.slug;
    if (name !== existingProject.name) {
      const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      slug = baseSlug;
      let suffix = 2;
      while (await prisma.project.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      })) {
        slug = `${baseSlug}-${suffix}`;
        suffix++;
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        slug,
        summary,
        description,
        type,
        platform,
        status,
        iconUrl: iconUrl || null,
        bannerUrl: bannerUrl || null,
        sourceUrl: sourceUrl || null,
        issuesUrl: issuesUrl || null,
        wikiUrl: wikiUrl || null,
        discordUrl: discordUrl || null,
        donationUrl: donationUrl || null,
        licenseId: licenseId || null,
        organizationId: organizationId || null,
        publishedAt: status === 'PUBLISHED' && existingProject.status !== 'PUBLISHED' 
          ? new Date() 
          : existingProject.publishedAt,
      },
    });

    return NextResponse.json(project);
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

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cek apakah project ada
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            versions: true,
            follows: true,
            reviews: true,
            reports: true,
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

    // Cek apakah project masih memiliki data terkait
    if (project._count.versions > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete project that has versions',
          count: project._count.versions,
          message: `Project has ${project._count.versions} version(s)`
        },
        { status: 409 }
      );
    }

    // Hapus project (cascade akan menghapus data terkait)
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    console.error('Error in DELETE /api/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}