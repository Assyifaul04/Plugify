// components/projects/project-table.tsx
"use client";

import { Project, User, Category } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  XCircle,
  Clock,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectWithRelations extends Project {
  author: {
    name: string | null;
    username: string | null;
  };
  categories: {
    category: Category;
  }[];
  _count: {
    versions: number;
    reviews: number;
    follows: number;
  };
}

interface ProjectTableProps {
  projects: ProjectWithRelations[];
}

const typeLabels: Record<string, string> = {
  MOD: "Mod",
  MODPACK: "Modpack",
  SHADER: "Shader",
  PLUGIN: "Plugin",
  RESOURCE_PACK: "Resource Pack",
  DATA_PACK: "Data Pack",
  MAP: "Map",
};

const statusLabels: Record<string, string> = {
  PUBLISHED: "Dipublikasikan",
  DRAFT: "Draf",
  PENDING_REVIEW: "Menunggu Review",
  ARCHIVED: "Diarsipkan",
  REJECTED: "Ditolak",
  DELISTED: "Dihapus",
};

const statusColor: Record<string, string> = {
  PUBLISHED: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  DRAFT: "border-white/15 bg-white/5 text-white/60",
  PENDING_REVIEW: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  ARCHIVED: "border-white/10 bg-white/[0.03] text-white/40",
  REJECTED: "border-red-500/30 bg-red-500/10 text-red-400",
  DELISTED: "border-red-500/20 bg-red-500/5 text-red-400/70",
};

const statusIcon: Record<string, React.ReactNode> = {
  PUBLISHED: <CheckCircle className="h-3 w-3" />,
  DRAFT: <Clock className="h-3 w-3" />,
  PENDING_REVIEW: <Clock className="h-3 w-3" />,
  ARCHIVED: <Archive className="h-3 w-3" />,
  REJECTED: <XCircle className="h-3 w-3" />,
  DELISTED: <XCircle className="h-3 w-3" />,
};

export default function ProjectTable({ projects }: ProjectTableProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-white/10 bg-black/60 p-12 text-center">
        <div className="rounded-full bg-white/5 p-3 text-white/30">
          <FolderOpen className="h-5 w-5" />
        </div>
        <p className="text-sm text-white/50">Tidak ada proyek ditemukan</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-white/10 bg-black/60">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-white/50">Nama Proyek</TableHead>
            <TableHead className="text-white/50">Author</TableHead>
            <TableHead className="text-white/50">Tipe</TableHead>
            <TableHead className="text-white/50">Status</TableHead>
            <TableHead className="text-white/50">Kategori</TableHead>
            <TableHead className="text-center text-white/50">Versi</TableHead>
            <TableHead className="text-right text-white/50">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className="border-white/10 hover:bg-white/[0.03]"
            >
              <TableCell className="font-medium">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="text-white hover:text-orange-400 hover:underline"
                >
                  {project.name}
                </Link>
                <div className="text-xs text-white/40">{project.slug}</div>
              </TableCell>
              <TableCell className="text-white/70">
                {project.author.name || project.author.username}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white/70"
                >
                  {typeLabels[project.type] || project.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "flex w-fit items-center gap-1",
                    statusColor[project.status]
                  )}
                >
                  {statusIcon[project.status]}
                  {statusLabels[project.status] || project.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {project.categories.slice(0, 2).map((pc) => (
                    <Badge
                      key={pc.category.id}
                      variant="secondary"
                      className="border-white/10 bg-white/5 text-xs text-white/70"
                    >
                      {pc.category.name}
                    </Badge>
                  ))}
                  {project.categories.length > 2 && (
                    <Badge
                      variant="secondary"
                      className="border-white/10 bg-white/5 text-xs text-white/50"
                    >
                      +{project.categories.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center text-white/70">
                {project._count.versions}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:bg-white/5 hover:text-orange-400"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="border-white/10 bg-black text-white"
                  >
                    <DropdownMenuItem
                      asChild
                      className="focus:bg-orange-500/20 focus:text-orange-400"
                    >
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> Detail
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="focus:bg-orange-500/20 focus:text-orange-400"
                    >
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
                      <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}