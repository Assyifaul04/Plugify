import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil category by slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
      where: { slug },
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
                summary: true,
                iconUrl: true,
                downloadCount: true,
                createdAt: true,
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
    console.error('Error in GET /api/categories/slug/[slug]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}