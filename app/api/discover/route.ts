import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProjectStatus, GamePlatform, ProjectType } from "@prisma/client";

interface DiscoverQueryParams {
  q?: string;
  page?: string;
  platform?: string;
  type?: string;
  sort?: string;
  category?: string;
  loader?: string;
  version?: string;
}

export async function getDiscoverPageData(params: DiscoverQueryParams = {}) {
  const page = parseInt(params.page || "1");
  const limit = 12;
  const search = params.q || "";
  const platform = params.platform || "";
  const type = params.type || "";
  const sort = params.sort || "newest";
  const categorySlug = params.category || "";
  const loaderName = params.loader || "";
  const version = params.version || "";

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
              version,
            },
          },
        },
      },
    };
  }

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

  const [projects, total, filterData] = await Promise.all([
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

  const [categories, loaders, gameVersions, platformCounts, typeCounts] = filterData;
  const totalPages = Math.ceil(total / limit);

  return {
    projects,
    total,
    totalPages,
    page,
    limit,
    filterOptions: {
      categories: categories.filter((c) => c._count.projects > 0),
      loaders: loaders.filter((l) => l._count.versions > 0),
      versions: gameVersions,
      platforms: platformCounts,
      types: typeCounts,
    },
  };
}

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const data = await getDiscoverPageData(params);

  return NextResponse.json(data);
}
