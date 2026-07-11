import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProjectStatus, GamePlatform, ProjectType } from "@prisma/client";
import { Loader2 } from "lucide-react";

import DiscoverSidebar from "@/components/discover/discover-sidebar";
import DiscoverHeader from "@/components/discover/discover-header";
import ProjectGrid from "@/components/discover/project-grid";
import DiscoverPagination from "@/components/discover/discover-pagination";
import DiscoverBanner from "@/components/discover/discover-banner";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    platform?: string;
    type?: string;
    sort?: string;
    category?: string;
    loader?: string;
    version?: string;
  }>;
}

// Helper untuk mengubah BigInt menjadi Number
function serializeProject(project: any) {
  return {
    ...project,
    downloadCount: typeof project.downloadCount === 'bigint'
      ? Number(project.downloadCount)
      : project.downloadCount,
  };
}

export default async function DiscoverPage({ searchParams }: PageProps) {
  try {
    const params = await searchParams;

    const page = parseInt(params.page || "1");
    const limit = 12;
    const search = params.q || "";
    const platform = params.platform || "";
    const type = params.type || "";
    const sort = params.sort || "newest";
    const categorySlug = params.category || "";
    const loaderName = params.loader || "";
    const version = params.version || "";

    // ------------------- WHERE CLAUSE -------------------
    const where: any = {
      status: ProjectStatus.PUBLISHED,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (platform) {
      where.platform = platform as GamePlatform;
    }

    if (type) {
      where.type = type as ProjectType;
    }

    if (categorySlug) {
      where.categories = {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      };
    }

    if (loaderName) {
      where.versions = {
        some: {
          loaders: {
            some: {
              loader: {
                name: loaderName,
              },
            },
          },
        },
      };
    }

    if (version) {
      where.versions = {
        some: {
          gameVersions: {
            some: {
              gameVersion: {
                version: version,
              },
            },
          },
        },
      };
    }

    // ------------------- SORT -------------------
    let orderBy: any = {};
    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "popular":
        orderBy = { downloadCount: "desc" };
        break;
      case "trending":
        orderBy = { followCount: "desc" };
        break;
      case "updated":
        orderBy = { updatedAt: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // ------------------- FETCH DATA -------------------
    const [projectsRaw, total, filterData] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              name: true,
              username: true,
              image: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
          versions: {
            take: 1,
            orderBy: { createdAt: "desc" },
            include: {
              gameVersions: {
                include: {
                  gameVersion: true,
                },
              },
              loaders: {
                include: {
                  loader: true,
                },
              },
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      }),
      prisma.project.count({ where }),
      // Data untuk sidebar filter
      Promise.all([
        prisma.category.findMany({
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            _count: {
              select: { projects: true },
            },
          },
        }),
        prisma.loader.findMany({
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            icon: true,
            platform: true,
            _count: {
              select: { versions: true },
            },
          },
        }),
        prisma.gameVersion.findMany({
          where: {
            versions: {
              some: {
                version: {
                  project: {
                    status: ProjectStatus.PUBLISHED,
                  },
                },
              },
            },
          },
          orderBy: { version: "desc" },
          select: {
            id: true,
            version: true,
            isMajor: true,
            isBeta: true,
            platform: true,
          },
        }),
        prisma.project.groupBy({
          by: ["platform"],
          _count: { platform: true },
        }),
        prisma.project.groupBy({
          by: ["type"],
          _count: { type: true },
        }),
      ]),
    ]);

    // 🔥 Serialize all projects (convert BigInt downloadCount)
    const projects = projectsRaw.map(serializeProject);

    const [categories, loaders, gameVersions, platformCounts, typeCounts] = filterData;

    const totalPages = Math.ceil(total / limit);

    const filterOptions = {
      categories: categories?.filter((c) => c._count.projects > 0) || [],
      loaders: loaders?.filter((l) => l._count.versions > 0) || [],
      versions: gameVersions || [],
      platforms: platformCounts || [],
      types: typeCounts || [],
    };

    // ------------------- RENDER -------------------
    return (
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="mb-6">
          <DiscoverBanner />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full lg:w-64 lg:shrink-0">
            <DiscoverSidebar
              categories={filterOptions.categories}
              loaders={filterOptions.loaders}
              versions={filterOptions.versions}
              platforms={filterOptions.platforms}
              types={filterOptions.types}
              activeFilters={{
                category: categorySlug,
                loader: loaderName,
                version: version,
                platform: platform,
                type: type,
              }}
            />
          </aside>

          <main className="flex-1 min-w-0">
            <Suspense fallback={<div className="h-32 animate-pulse bg-muted/50 rounded-xl" />}>
              <DiscoverHeader
                initialQuery={search}
                initialSort={sort}
                totalResults={total}
                currentResults={projects.length}
              />
            </Suspense>

            <Suspense
              fallback={
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              }
            >
              <ProjectGrid projects={projects} />
            </Suspense>

            {totalPages > 1 && (
              <div className="mt-8">
                <DiscoverPagination currentPage={page} totalPages={totalPages} />
              </div>
            )}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in DiscoverPage:", error);
    return (
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-400">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-300/70">
            Failed to load projects. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}