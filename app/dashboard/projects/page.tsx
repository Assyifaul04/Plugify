import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import DashboardProjectsClient from "./page-client";

interface DashboardProjectsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    type?: string;
    platform?: string;
    status?: string;
  };
}

export default async function DashboardProjectsPage({
  searchParams,
}: DashboardProjectsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = 10;
  const search = searchParams.search || "";
  const type = searchParams.type || "";
  const platform = searchParams.platform || "";
  const status = searchParams.status || "";

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { summary: { contains: search, mode: "insensitive" } },
    ];
  }

  if (type && type !== "ALL") {
    where.type = type;
  }

  if (platform && platform !== "ALL") {
    where.platform = platform;
  }

  if (status && status !== "ALL") {
    where.status = status;
  }

  const [projects, totalCount] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        platform: true,
        status: true,
        iconUrl: true,
        downloadCount: true,
        createdAt: true,
        publishedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            versions: true,
            follows: true,
            reviews: true,
          },
        },
      },
    }),
    prisma.project.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <DashboardProjectsClient
      projects={projects}
      currentPage={page}
      totalPages={totalPages}
      search={search}
      type={type}
      platform={platform}
      status={status}
    />
  );
}