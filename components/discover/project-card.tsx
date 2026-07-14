"use client";

import Link from "next/link";
import Image from "next/image";
import { Project, User, Category, Version, GameVersion, Loader } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Download, Heart, Clock, Blocks } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface ProjectWithRelations extends Project {
  author: Pick<User, "name" | "username" | "image">;
  categories: { category: Category }[];
  versions: (Version & {
    gameVersions: { gameVersion: GameVersion }[];
    loaders: { loader: Loader }[];
  })[];
  _count: { reviews: number };
}

interface ProjectCardProps {
  project: ProjectWithRelations;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const latestVersion = project.versions?.[0];
  const loaders = latestVersion?.loaders?.map((l) => l.loader.name) || [];
  const gameVersions = latestVersion?.gameVersions?.map((gv) => gv.gameVersion.version) || [];
  const categoryTags = project.categories?.map((c) => c.category.name) || [];

  const formatCount = (count: number | undefined | null): string => {
    if (count == null) return "0";
    const num = Number(count);
    if (isNaN(num)) return "0";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  // ✅ Fix: Validasi tanggal sebelum format
  const formatRelativeTime = (date: Date | string | null | undefined): string => {
    if (!date) return "Recently";
    try {
      const parsedDate = typeof date === "string" ? new Date(date) : date;
      if (isNaN(parsedDate.getTime())) return "Recently";
      return formatDistanceToNow(parsedDate, { addSuffix: true, locale: id });
    } catch {
      return "Recently";
    }
  };

  const downloadCount = Number(project.downloadCount) || 0;
  const followCount = project._count?.follows || 0;

  return (
    <Card className="group overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-orange-500/30 hover:bg-accent/50">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="flex items-start gap-4">
          {project.iconUrl ? (
            <Image
              src={project.iconUrl}
              alt={project.name}
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-xl border border-border bg-card object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-xl font-bold text-orange-400">
              {project.name.charAt(0)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold leading-tight text-foreground">
                  {project.name}
                  <span className="ml-2 truncate text-sm font-normal text-muted-foreground">
                    by {project.author?.name || project.author?.username || "Unknown"}
                  </span>
                </h3>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1 text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Download className="h-3.5 w-3.5" />
                    {formatCount(downloadCount)}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="h-3.5 w-3.5" />
                    {formatCount(followCount)}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatRelativeTime(project.createdAt)}
                </span>
              </div>
            </div>

            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {project.summary || "No description available yet."}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {categoryTags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="border-border text-xs font-normal text-muted-foreground">
                  {tag}
                </Badge>
              ))}
              {loaders.slice(0, 2).map((loader) => (
                <Badge
                  key={loader}
                  variant="outline"
                  className="flex items-center gap-1 border-border text-xs font-normal text-muted-foreground"
                >
                  <Blocks className="h-3 w-3" />
                  {loader}
                </Badge>
              ))}
              {loaders.length > 2 && (
                <Badge variant="outline" className="border-border text-xs font-normal text-muted-foreground">
                  +{loaders.length - 2}
                </Badge>
              )}
              {gameVersions.length > 0 && (
                <Badge className="bg-orange-500/15 px-1.5 text-xs font-normal text-orange-400 hover:bg-orange-500/15">
                  MC {gameVersions[0]}
                  {gameVersions.length > 1 && ` +${gameVersions.length - 1}`}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}