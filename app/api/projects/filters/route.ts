import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProjectStatus } from '@prisma/client';

// GET: Ambil semua data filter untuk sidebar
export async function GET(req: NextRequest) {
  try {
    const [categories, loaders, gameVersions, platformCounts, typeCounts] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          _count: {
            select: { projects: true },
          },
        },
      }),
      prisma.loader.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          icon: true,
          platform: true,
          _count: {
            select: { versions: true },
          },
        },
      }),
      prisma.gameVersion.findMany({
        where: {
          versions: {
            some: {
              version: {
                project: {
                  status: ProjectStatus.PUBLISHED,
                },
              },
            },
          },
        },
        orderBy: { version: 'desc' },
        select: {
          id: true,
          version: true,
          isMajor: true,
          isBeta: true,
          platform: true,
        },
      }),
      prisma.project.groupBy({
        by: ['platform'],
        _count: { platform: true },
        where: { status: ProjectStatus.PUBLISHED },
      }),
      prisma.project.groupBy({
        by: ['type'],
        _count: { type: true },
        where: { status: ProjectStatus.PUBLISHED },
      }),
    ]);

    return NextResponse.json({
      categories: categories.filter((c) => c._count.projects > 0),
      loaders: loaders.filter((l) => l._count.versions > 0),
      versions: gameVersions,
      platforms: platformCounts,
      types: typeCounts,
    });
  } catch (error) {
    console.error('Error in GET /api/projects/filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}