import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// GET: Detail game version
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gameVersion = await prisma.gameVersion.findUnique({
      where: { id },
      include: {
        _count: { select: { versions: true } },
      },
    });

    if (!gameVersion) {
      return NextResponse.json({ error: 'Game version not found' }, { status: 404 });
    }

    return NextResponse.json(gameVersion);
  } catch (error) {
    console.error('Error in GET /api/game-versions/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch game version' }, { status: 500 });
  }
}

// PUT: Update game version (Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { version, platform, isMajor, isBeta, releaseDate } = body;

    const existing = await prisma.gameVersion.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Game version not found' }, { status: 404 });
    }

    // Cek duplikat versi
    if (version && version !== existing.version) {
      const duplicate = await prisma.gameVersion.findUnique({
        where: { version },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: `Version ${version} already exists` },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.gameVersion.update({
      where: { id },
      data: {
        version: version || existing.version,
        platform: platform || existing.platform,
        isMajor: isMajor !== undefined ? isMajor : existing.isMajor,
        isBeta: isBeta !== undefined ? isBeta : existing.isBeta,
        releaseDate: releaseDate !== undefined 
          ? (releaseDate ? new Date(releaseDate) : null)
          : existing.releaseDate,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PUT /api/game-versions/[id]:', error);
    return NextResponse.json({ error: 'Failed to update game version' }, { status: 500 });
  }
}

// DELETE: Hapus game version (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const gameVersion = await prisma.gameVersion.findUnique({
      where: { id },
      include: { 
        versions: { 
          select: { versionId: true } 
        } 
      },
    });

    if (!gameVersion) {
      return NextResponse.json({ error: 'Game version not found' }, { status: 404 });
    }

    if (gameVersion.versions.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete game version that is used by projects',
          count: gameVersion.versions.length 
        },
        { status: 409 }
      );
    }

    await prisma.gameVersion.delete({ where: { id } });
    return NextResponse.json({ message: 'Game version deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/game-versions/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete game version' }, { status: 500 });
  }
}