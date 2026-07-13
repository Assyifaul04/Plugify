// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    // (Opsional) Cek autentikasi & role ADMIN jika hanya admin yang boleh upload
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validasi tipe file (hanya gambar)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validasi ukuran (misal maks 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 2MB' }, { status: 400 });
    }

    // Baca file sebagai buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik (timestamp + nama asli)
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s/g, '_');
    const filename = `${timestamp}-${originalName}`;

    // Tentukan path penyimpanan di public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, filename);

    // Pastikan folder uploads ada
    await mkdir(uploadDir, { recursive: true });

    // Simpan file
    await writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Opsional: batasi ukuran body (Next.js default 4MB, kita bisa ubah)
export const config = {
  api: {
    bodyParser: false, // karena kita pakai formData
  },
};