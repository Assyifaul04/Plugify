import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, ProjectType, ProjectStatus } from "@prisma/client";

import ProjectTable from "@/components/projects/project-table";
import ProjectSearch from "@/components/projects/project-search";
import ProjectPagination from "@/components/projects/project-pagination";
import ProjectFormDialog from "@/components/projects/project-form-dialog";

import Loading from "./loading";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    type?: string;
    status?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  // Hanya admin yang bisa akses halaman ini (atau boleh juga moderator? kita batasi admin saja sesuai contoh)
  if (!session?.user?.role || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");
  const search = params.search || "";
  const type = params.type as ProjectType | undefined;
  const status = params.status as ProjectStatus | undefined;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" as const } },
      { slug: { contains: search, mode: "insensitive" as const } },
      { summary: { contains: search, mode: "insensitive" as const } },
    ];
  }

  if (type) {
    where.type = type;
  }

  if (status) {
    where.status = status;
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            versions: true,
            reviews: true,
            follows: true,
          },
        },
      },
    }),
    prisma.project.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Proyek</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <ProjectSearch initialSearch={search} initialType={type} initialStatus={status} />
        </div>
        <ProjectFormDialog mode="create" />
      </div>

      <Suspense fallback={<Loading />}>
        <ProjectTable projects={projects} />
      </Suspense>

      <div className="mt-6">
        <ProjectPagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}