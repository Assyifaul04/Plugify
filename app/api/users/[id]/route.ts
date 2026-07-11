import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// ✅ FIX: params harus di-await di Next.js 15
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Cek session
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        suspended: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    const isOwner = session.user.id === id;
    const isAdmin = session.user.role === UserRole.ADMIN;

    // Non-admin/non-owner hanya bisa lihat data publik
    if (!isOwner && !isAdmin) {
      const { email, role, suspended, ...publicData } = user;
      return NextResponse.json(publicData);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in GET /api/users/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isOwner = session.user.id === id;
    const isAdmin = session.user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, username, email, bio, image, role } = body;

    // Validasi input
    if (!name && !username && !email && !bio && !image && !role) {
      return NextResponse.json(
        { error: "Tidak ada data yang diupdate" },
        { status: 400 },
      );
    }

    // Cek duplikat username/email
    if (username || email) {
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email }] : []),
          ],
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Username atau email sudah digunakan" },
          { status: 409 },
        );
      }
    }

    // Siapkan data update
    const updateData: any = {
      name,
      username,
      email,
      bio,
      image,
    };

    // Hanya admin yang bisa mengubah role
    if (isAdmin && role) {
      // Validasi role
      if (!Object.values(UserRole).includes(role)) {
        return NextResponse.json(
          { error: "Role tidak valid" },
          { status: 400 },
        );
      }
      updateData.role = role;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error in PUT /api/users/[id]:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Error in DELETE /api/users/[id]:", error);
    return NextResponse.json(
      { error: "Gagal menghapus user" },
      { status: 500 },
    );
  }
}
