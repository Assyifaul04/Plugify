"use client";

import { Project, User, Category, Version, GameVersion, Loader } from "@prisma/client";
import ProjectCard from "./project-card";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface ProjectWithRelations extends Project {
  author: Pick<User, "name" | "username" | "image">;
  categories: { category: Category }[];
  versions: (Version & {
    gameVersions: { gameVersion: GameVersion }[];
    loaders: { loader: Loader }[];
  })[];
  _count: { reviews: number };
}

interface ProjectGridProps {
  projects: ProjectWithRelations[];
  className?: string;
  loading?: boolean;
  view?: "list" | "grid";
}

export default function ProjectGrid({ projects, className, loading, view = "list" }: ProjectGridProps) {
  const wrapperClass = view === "grid" 
    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" 
    : "flex flex-col gap-3";

  if (loading) {
    return (
      <div className={wrapperClass}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-card/50" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center transition-colors hover:border-border">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
          <Search className="h-8 w-8 text-orange-400" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">No projects found</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Try adjusting your filters or search terms to discover more projects.
        </p>
        <button
          onClick={() => {
            const params = new URLSearchParams(window.location.search);
            ["q", "category", "loader", "version", "platform", "type"].forEach((key) => params.delete(key));
            params.set("page", "1");
            window.location.search = params.toString();
          }}
          className="mt-4 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400 transition hover:bg-orange-500/20"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className={cn(wrapperClass, className)}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}