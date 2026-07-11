// app/dashboard/users/page.tsx
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// Komponen dari folder global components/users
import UserTable from "@/components/users/user-table";
import UserSearch from "@/components/users/user-search";
import UserFilter from "@/components/users/user-filter";
import UserPagination from "@/components/users/user-pagination";

import Loading from "./loading";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
  }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  // Await searchParams karena berupa Promise di Next.js 15
  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");
  const search = params.search || "";
  const role = params.role as UserRole | undefined;

  // Query langsung ke database
  const where = {
    ...(role && { role }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
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
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Pengguna</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <UserSearch initialSearch={search} />
          <UserFilter initialRole={role} />
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <UserTable users={users} />
      </Suspense>

      <div className="mt-6">
        <UserPagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}