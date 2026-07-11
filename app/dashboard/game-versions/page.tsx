import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

import GameVersionTable from "@/components/game-versions/game-version-table";
import GameVersionSearch from "@/components/game-versions/game-version-search";
import GameVersionPagination from "@/components/game-versions/game-version-pagination";
import GameVersionFormDialog from "@/components/game-versions/game-version-form-dialog";

import Loading from "./loading";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    platform?: string;
  }>;
}

export default async function GameVersionsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");
  const search = params.search || "";
  const platform = params.platform || "";

  const where: any = {};
  
  if (search) {
    where.version = { contains: search, mode: "insensitive" as const };
  }
  
  if (platform) {
    where.platform = platform;
  }

  const [gameVersions, total] = await Promise.all([
    prisma.gameVersion.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { isMajor: "desc" },
        { version: "desc" },
      ],
      select: {
        id: true,
        version: true,
        platform: true,
        isMajor: true,
        isBeta: true,
        releaseDate: true,
        _count: {
          select: {
            versions: true, // jumlah version yang menggunakan game version ini
          },
        },
      },
    }),
    prisma.gameVersion.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Game Versions</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <GameVersionSearch initialSearch={search} initialPlatform={platform} />
        </div>
        <GameVersionFormDialog mode="create" />
      </div>

      <Suspense fallback={<Loading />}>
        <GameVersionTable gameVersions={gameVersions} />
      </Suspense>

      <div className="mt-6">
        <GameVersionPagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}