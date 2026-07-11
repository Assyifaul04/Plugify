import { prisma } from "@/lib/prisma";
import {
  PackageIcon,
  UsersIcon,
  MessageSquareWarningIcon,
  DownloadIcon,
  TrendingUpIcon,
} from "lucide-react";
import { ProjectStatus, GamePlatform } from "@prisma/client";
import { Suspense } from "react";

// Import komponen diagram & tabel
import ProjectStatusChart from "@/components/charts/project-status-chart";
import CategoryChart from "@/components/charts/category-chart";
import PlatformChart from "@/components/charts/platform-chart";
import RecentProjects from "@/components/dashboard/recent-projects";
import RecentUsers from "@/components/dashboard/recent-users";

// Loading placeholder
import DashboardLoading from "./loading";

export default async function DashboardPage() {
  // --- Ambil data statistik ---
  const [
    totalPublishedProjects,
    totalProjects,
    totalUsers,
    openReports,
    totalDownloads,
    statusData,
    categoryData,
    platformData,
    recentProjects,
    recentUsers,
  ] = await Promise.all([
    // Total proyek dipublikasikan
    prisma.project.count({ where: { status: ProjectStatus.PUBLISHED } }),
    // Total semua proyek
    prisma.project.count(),
    // Total pengguna
    prisma.user.count(),
    // Laporan terbuka
    prisma.report.count({ where: { status: "OPEN" } }),
    // Total unduhan (sum dari semua proyek)
    prisma.project.aggregate({
      _sum: { downloadCount: true },
    }),
    // Data proyek per status (untuk pie chart)
    prisma.project.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    // Data proyek per kategori (ambil 5 kategori teratas)
    prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: { projects: true },
        },
      },
      orderBy: {
        projects: {
          _count: "desc",
        },
      },
      take: 5,
    }),
    // Data proyek per platform
    prisma.project.groupBy({
      by: ["platform"],
      _count: { platform: true },
    }),
    // 5 proyek terbaru (dengan author)
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true },
        },
      },
    }),
    // 5 pengguna terbaru
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Format data untuk chart status
  const statusChartData = statusData.map((item) => ({
    status: item.status as ProjectStatus,
    count: item._count.status,
  }));

  // Format data untuk chart kategori
  const categoryChartData = categoryData.map((cat) => ({
    name: cat.name,
    count: cat._count.projects,
  }));

  // Format data untuk chart platform
  const platformChartData = platformData.map((item) => ({
    platform: item.platform as GamePlatform,
    count: item._count.platform,
  }));

  // Statistik cards
  const stats = [
    {
      label: "Total Proyek",
      value: totalProjects,
      icon: <PackageIcon className="size-5 text-muted-foreground" />,
      change: `${totalPublishedProjects} publikasi`,
    },
    {
      label: "Total Pengguna",
      value: totalUsers,
      icon: <UsersIcon className="size-5 text-muted-foreground" />,
    },
    {
      label: "Laporan Terbuka",
      value: openReports,
      icon: <MessageSquareWarningIcon className="size-5 text-muted-foreground" />,
      change: openReports > 0 ? "Perlu ditindaklanjuti" : "Tidak ada laporan",
    },
    {
      label: "Total Unduhan",
      value: totalDownloads._sum.downloadCount || 0,
      icon: <DownloadIcon className="size-5 text-muted-foreground" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistik Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col justify-between gap-2 rounded-xl bg-muted/50 p-5 transition hover:bg-muted/70"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              {stat.icon}
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold tabular-nums">
                {stat.value.toLocaleString("id-ID")}
              </span>
              {stat.change && (
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Suspense fallback={<div className="h-[300px] animate-pulse bg-muted/50 rounded-xl" />}>
            <ProjectStatusChart data={statusChartData} />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <Suspense fallback={<div className="h-[300px] animate-pulse bg-muted/50 rounded-xl" />}>
            <CategoryChart data={categoryChartData} />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <Suspense fallback={<div className="h-[300px] animate-pulse bg-muted/50 rounded-xl" />}>
            <PlatformChart data={platformChartData} />
          </Suspense>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<div className="h-[300px] animate-pulse bg-muted/50 rounded-xl" />}>
          <RecentProjects projects={recentProjects} />
        </Suspense>
        <Suspense fallback={<div className="h-[300px] animate-pulse bg-muted/50 rounded-xl" />}>
          <RecentUsers users={recentUsers} />
        </Suspense>
      </div>
    </div>
  );
}