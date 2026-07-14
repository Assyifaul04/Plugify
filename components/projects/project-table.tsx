"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProjectRowActions from "./project-row-actions";

export interface ProjectListItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  platform: string;
  status: string;
  iconUrl: string | null;
  downloadCount: string | number;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string | Date;
  publishedAt: string | Date | null;
  _count: {
    versions: number;
    follows: number;
    reviews: number;
  };
}

interface ProjectTableProps {
  projects: ProjectListItem[];
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "border-gray-500/40 bg-gray-500/10 text-gray-500",
  PENDING_REVIEW: "border-yellow-500/40 bg-yellow-500/10 text-yellow-500",
  PUBLISHED: "border-green-500/40 bg-green-500/10 text-green-500",
  ARCHIVED: "border-slate-500/40 bg-slate-500/10 text-slate-500",
  REJECTED: "border-red-500/40 bg-red-500/10 text-red-500",
  DELISTED: "border-purple-500/40 bg-purple-500/10 text-purple-500",
};

const TYPE_BADGE_COLORS: Record<string, string> = {
  MOD: "border-blue-500/40 bg-blue-500/10 text-blue-500",
  MODPACK: "border-purple-500/40 bg-purple-500/10 text-purple-500",
  SHADER: "border-indigo-500/40 bg-indigo-500/10 text-indigo-500",
  PLUGIN: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
  RESOURCE_PACK: "border-pink-500/40 bg-pink-500/10 text-pink-500",
  DATA_PACK: "border-cyan-500/40 bg-cyan-500/10 text-cyan-500",
  MAP: "border-amber-500/40 bg-amber-500/10 text-amber-500",
};

function formatDate(date: string | Date | null) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  // Validasi projects
  if (!projects || !Array.isArray(projects) || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl">
          📦
        </div>
        <p className="text-sm font-medium text-foreground">Belum ada project</p>
        <p className="text-sm text-muted-foreground">
          Project yang dibuat oleh user akan muncul di sini.
        </p>
      </div>
    );
  }

  // Filter dan validasi setiap project
  const validProjects = projects
    .filter((project) => project && typeof project === "object" && project.id)
    .map((project) => ({
      ...project,
      name: project.name || "Unnamed",
      slug: project.slug || "",
      type: project.type || "UNKNOWN",
      platform: project.platform || "UNKNOWN",
      status: project.status || "DRAFT",
      downloadCount: project.downloadCount || 0,
      author: {
        ...project.author,
        name: project.author?.name || project.author?.username || "Unknown",
      },
      _count: {
        versions: project._count?.versions || 0,
        follows: project._count?.follows || 0,
        reviews: project._count?.reviews || 0,
      },
    }));

  if (validProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl">
          ⚠️
        </div>
        <p className="text-sm font-medium text-foreground">Data project tidak valid</p>
        <p className="text-sm text-muted-foreground">
          Tidak ada data project yang valid untuk ditampilkan.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table className="min-w-[960px]">
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-16 py-3.5"></TableHead>
              <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Nama
              </TableHead>
              <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Type
              </TableHead>
              <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Platform
              </TableHead>
              <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Author
              </TableHead>
              <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Dibuat
              </TableHead>
              <TableHead className="py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Versi
              </TableHead>
              <TableHead className="py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Downloads
              </TableHead>
              <TableHead className="py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validProjects.map((project) => (
              <TableRow
                key={project.id}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/60"
              >
                <TableCell className="py-4">
                  {project.iconUrl ? (
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarImage src={project.iconUrl} alt={project.name} />
                      <AvatarFallback className="rounded-lg bg-muted text-xs uppercase">
                        {project.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <span className="text-xs uppercase">
                        {project.name.substring(0, 2)}
                      </span>
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col gap-0.5">
                    {project.slug ? (
                      <Link
                        href={`/admin/projects/${project.slug}`}
                        className="font-medium text-foreground hover:underline underline-offset-2"
                      >
                        {project.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">{project.name}</span>
                    )}
                    {project.organization && (
                      <span className="text-xs text-muted-foreground">
                        {project.organization.name}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className={TYPE_BADGE_COLORS[project.type] || "border-border"}
                  >
                    {project.type}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className={
                      project.platform === "JAVA"
                        ? "rounded-full border-orange-500/40 bg-orange-500/10 text-orange-500"
                        : "rounded-full border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                    }
                  >
                    {project.platform}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className={STATUS_COLORS[project.status] || "border-border"}
                  >
                    {project.status.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={project.author?.image || ""} />
                      <AvatarFallback className="text-xs">
                        {project.author?.name?.substring(0, 2).toUpperCase() ||
                          project.author?.username?.substring(0, 2).toUpperCase() ||
                          "??"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {project.author?.name || project.author?.username || "Unknown"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-sm text-muted-foreground">
                  {formatDate(project.createdAt)}
                </TableCell>
                <TableCell className="py-4 text-center">
                  <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 font-medium">
                    {project._count?.versions || 0}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-center text-sm font-medium">
                  {Number(project.downloadCount || 0).toLocaleString()}
                </TableCell>
                <TableCell className="py-4 text-right">
                  <ProjectRowActions
                    project={{
                      id: project.id || "",
                      name: project.name || "Unnamed",
                      slug: project.slug || "",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}