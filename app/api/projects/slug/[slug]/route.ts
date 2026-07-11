import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Detail project by slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
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
        license: {
          select: {
            id: true,
            name: true,
            spdxId: true,
            url: true,
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
        gallery: {
          orderBy: { ordering: 'asc' },
        },
        team: {
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
        _count: {
          select: {
            follows: true,
            reviews: true,
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

    // Increment download count (optional, bisa dipisah ke endpoint terpisah)
    // await prisma.project.update({
    //   where: { id: project.id },
    //   data: { downloadCount: { increment: 1 } },
    // });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error in GET /api/projects/slug/[slug]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}