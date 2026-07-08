// app/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import {
  PackageIcon,
  UsersIcon,
  MessageSquareWarningIcon,
} from "lucide-react";

export default async function DashboardPage() {
  const [totalProjects, totalUsers, openReports] = await Promise.all([
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count(),
    prisma.report.count({ where: { status: "OPEN" } }),
  ]);

  const stats = [
    {
      label: "Proyek Dipublikasikan",
      value: totalProjects,
      icon: <PackageIcon className="size-5 text-muted-foreground" />,
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
    },
  ];

  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col justify-between gap-3 rounded-xl bg-muted/50 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              {stat.icon}
            </div>
            <span className="text-3xl font-semibold tabular-nums">
              {stat.value.toLocaleString("id-ID")}
            </span>
          </div>
        ))}
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4 md:min-h-min">
        <p className="text-sm text-muted-foreground">
          Selamat datang kembali. Area ini bisa diisi dengan tabel proyek
          terbaru, aktivitas pengguna, atau grafik unduhan.
        </p>
      </div>
    </>
  );
}