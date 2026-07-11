import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole, GamePlatform, ProjectType } from '@prisma/client';

// GET: Ambil loader by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const loader = await prisma.loader.findUnique({
      where: { id },
      include: {
        versions: {
          include: {
            version: {
              select: {
                id: true,
                name: true,
                versionNumber: true,
                projectId: true,
              },
            },
          },
        },
      },
    });

    if (!loader) {
      return NextResponse.json(
        { error: 'Loader not found' },
        { status: 404 }
      );
    }

    // Format response
    const formattedLoader = {
      ...loader,
      versions: loader.versions.map(v => v.version),
      versionCount: loader.versions.length,
    };

    return NextResponse.json(formattedLoader);
  } catch (error) {
    console.error('Error in GET /api/loaders/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loader' },
      { status: 500 }
    );
  }
}

// PUT: Update loader (Admin only)
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

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await req.json();
    const { name, icon, platform, supportedTypes } = body;

    // Cek loader exists
    const existingLoader = await prisma.loader.findUnique({
      where: { id },
    });
    if (!existingLoader) {
      return NextResponse.json(
        { error: 'Loader not found' },
        { status: 404 }
      );
    }

    // Validasi input
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Cek duplikat name (kecuali diri sendiri)
    if (name !== existingLoader.name) {
      const duplicate = await prisma.loader.findFirst({
        where: {
          name,
          NOT: { id },
        },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: 'Loader with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Validasi platform
    if (platform && !Object.values(GamePlatform).includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    // Validasi supportedTypes
    const validProjectTypes = Object.values(ProjectType);
    const validatedTypes = Array.isArray(supportedTypes)
      ? supportedTypes.filter((t: string) => validProjectTypes.includes(t as ProjectType))
      : [];

    const updatedLoader = await prisma.loader.update({
      where: { id },
      data: {
        name,
        icon: icon ?? existingLoader.icon,
        platform: platform || existingLoader.platform,
        supportedTypes: validatedTypes.length ? validatedTypes : existingLoader.supportedTypes,
      },
    });

    return NextResponse.json(updatedLoader);
  } catch (error) {
    console.error('Error in PUT /api/loaders/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update loader' },
      { status: 500 }
    );
  }
}

// DELETE: Hapus loader (Admin only)
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

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    // Cek loader exists
    const loader = await prisma.loader.findUnique({
      where: { id },
      include: {
        versions: {
          select: {
            versionId: true,
          },
        },
      },
    });

    if (!loader) {
      return NextResponse.json(
        { error: 'Loader not found' },
        { status: 404 }
      );
    }

    // Cek apakah loader masih digunakan oleh version
    if (loader.versions.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete loader that is used by versions',
          versionCount: loader.versions.length,
        },
        { status: 409 }
      );
    }

    await prisma.loader.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Loader deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/loaders/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete loader' },
      { status: 500 }
    );
  }
}