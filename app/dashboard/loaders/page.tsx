import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

import LoaderTable from "@/components/loaders/loader-table";
import LoaderSearch from "@/components/loaders/loader-search";
import LoaderPagination from "@/components/loaders/loader-pagination";
import LoaderFormDialog from "@/components/loaders/loader-form-dialog";

import Loading from "./loading";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

export default async function LoadersPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");
  const search = params.search || "";

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [loaders, total] = await Promise.all([
    prisma.loader.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        icon: true,
        platform: true,
        supportedTypes: true,
        _count: {
          select: {
            versions: true, // jumlah version yang menggunakan loader ini
          },
        },
      },
    }),
    prisma.loader.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Loader</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <LoaderSearch initialSearch={search} />
        </div>
        <LoaderFormDialog mode="create" />
      </div>

      <Suspense fallback={<Loading />}>
        <LoaderTable loaders={loaders} />
      </Suspense>

      <div className="mt-6">
        <LoaderPagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}