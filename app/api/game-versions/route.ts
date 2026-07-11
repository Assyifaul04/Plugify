import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole, GamePlatform } from '@prisma/client';

// GET: Ambil semua game versions
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const platform = searchParams.get('platform');

    const where: any = {};
    if (search) {
      where.version = { contains: search, mode: 'insensitive' };
    }
    if (platform) {
      where.platform = platform;
    }

    const gameVersions = await prisma.gameVersion.findMany({
      where,
      orderBy: [
        { isMajor: 'desc' },
        { version: 'desc' },
      ],
      include: {
        _count: {
          select: { versions: true },
        },
      },
    });

    return NextResponse.json(gameVersions);
  } catch (error) {
    console.error('Error in GET /api/game-versions:', error);
    return NextResponse.json({ error: 'Failed to fetch game versions' }, { status: 500 });
  }
}

// POST: Buat game version baru (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { version, platform, isMajor, isBeta, releaseDate } = body;

    if (!version) {
      return NextResponse.json({ error: 'Version is required' }, { status: 400 });
    }

    const existing = await prisma.gameVersion.findUnique({
      where: { version },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Version ${version} already exists` },
        { status: 409 }
      );
    }

    const gameVersion = await prisma.gameVersion.create({
      data: {
        version,
        platform: platform || GamePlatform.JAVA,
        isMajor: isMajor ?? true,
        isBeta: isBeta ?? false,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
      },
    });

    return NextResponse.json(gameVersion, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/game-versions:', error);
    return NextResponse.json({ error: 'Failed to create game version' }, { status: 500 });
  }
}