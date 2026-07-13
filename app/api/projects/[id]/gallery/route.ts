import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// GET: Ambil gallery images
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

    const images = await prisma.galleryImage.findMany({
      where: { projectId: id },
      orderBy: { ordering: 'asc' },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error in GET /api/projects/[id]/gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

// POST: Tambah gallery image
export async function POST(
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
    const { url, caption, isCover, ordering } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Cek apakah project ada
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Jika isCover true, set semua gambar lain menjadi false
    if (isCover) {
      await prisma.galleryImage.updateMany({
        where: { projectId: id },
        data: { isCover: false },
      });
    }

    const image = await prisma.galleryImage.create({
      data: {
        projectId: id,
        url,
        caption: caption || null,
        isCover: isCover || false,
        ordering: ordering || 0,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects/[id]/gallery:', error);
    return NextResponse.json(
      { error: 'Failed to add gallery image' },
      { status: 500 }
    );
  }
}