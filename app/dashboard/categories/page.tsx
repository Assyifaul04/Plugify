// app/dashboard/categories/page.tsx
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// Komponen dari folder global components/categories
import CategoryTable from "@/components/categories/category-table";
import CategorySearch from "@/components/categories/category-search";
import CategoryPagination from "@/components/categories/category-pagination";
import CategoryFormDialog from "@/components/categories/category-form-dialog";

import Loading from "./loading";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  // Await searchParams karena berupa Promise di Next.js 15
  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");
  const search = params.search || "";

  // Query langsung ke database
  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { slug: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        projectTypes: true, // Ambil langsung field projectTypes
        _count: {
          select: {
            projects: true, // Hanya count projects
          },
        },
      },
    }),
    prisma.category.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Manajemen Kategori
        </h1>
        <p className="text-sm text-muted-foreground">
          {total > 0
            ? `${total} kategori terdaftar${search ? ` untuk "${search}"` : ""}`
            : "Kelola kategori untuk mengelompokkan project."}
        </p>
      </div>

      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:w-auto">
          <CategorySearch initialSearch={search} />
        </div>
        <CategoryFormDialog mode="create" />
      </div>

      <Suspense fallback={<Loading />}>
        <CategoryTable categories={categories} />
      </Suspense>

      {totalPages > 1 && (
        <div className="mt-6">
          <CategoryPagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}