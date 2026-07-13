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

const STATUS_COLORS = {
  DRAFT: "border-gray-500/40 bg-gray-500/10 text-gray-500",
  PENDING_REVIEW: "border-yellow-500/40 bg-yellow-500/10 text-yellow-500",
  PUBLISHED: "border-green-500/40 bg-green-500/10 text-green-500",
  ARCHIVED: "border-slate-500/40 bg-slate-500/10 text-slate-500",
  REJECTED: "border-red-500/40 bg-red-500/10 text-red-500",
  DELISTED: "border-purple-500/40 bg-purple-500/10 text-purple-500",
};

const TYPE_BADGE_COLORS = {
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
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
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

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-14"></TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Nama
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Platform
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Author
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Versi
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Downloads
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/60"
            >
              <TableCell>
                {project.iconUrl ? (
                  <Avatar className="h-9 w-9 rounded-lg">
                    <AvatarImage src={project.iconUrl} alt={project.name} />
                    <AvatarFallback className="rounded-lg bg-muted text-xs uppercase">
                      {project.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <span className="text-xs uppercase">
                      {project.name.substring(0, 2)}
                    </span>
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="font-medium text-foreground hover:text-orange-600 hover:underline"
                  >
                    {project.name}
                  </Link>
                  {project.organization && (
                    <span className="text-xs text-muted-foreground">
                      {project.organization.name}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    TYPE_BADGE_COLORS[project.type as keyof typeof TYPE_BADGE_COLORS] ||
                    "border-border"
                  }
                >
                  {project.type}
                </Badge>
              </TableCell>
              <TableCell>
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
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    STATUS_COLORS[project.status as keyof typeof STATUS_COLORS] ||
                    "border-border"
                  }
                >
                  {project.status.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={project.author.image || ""} />
                    <AvatarFallback className="text-xs">
                      {project.author.name?.substring(0, 2).toUpperCase() ||
                        project.author.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {project.author.name || project.author.username}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 font-medium"
                >
                  {project._count.versions}
                </Badge>
              </TableCell>
              <TableCell className="text-center text-sm font-medium">
                {Number(project.downloadCount).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <ProjectRowActions project={project} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}