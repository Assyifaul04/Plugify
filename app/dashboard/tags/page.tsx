import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

import TagTable from "@/components/tags/tag-table";
import TagSearch from "@/components/tags/tag-search";
import TagPagination from "@/components/tags/tag-pagination";
import TagFormDialog from "@/components/tags/tag-form-dialog";

import Loading from "./loading";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

export default async function TagsPage({ searchParams }: PageProps) {
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
        { slug: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [tags, total] = await Promise.all([
    prisma.tag.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
    }),
    prisma.tag.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Tag</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <TagSearch initialSearch={search} />
        </div>
        <TagFormDialog mode="create" />
      </div>

      <Suspense fallback={<Loading />}>
        <TagTable tags={tags} />
      </Suspense>

      <div className="mt-6">
        <TagPagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}