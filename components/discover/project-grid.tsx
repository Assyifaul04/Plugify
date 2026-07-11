"use client";

import { Project, User, Category, Version, GameVersion, Loader } from "@prisma/client";
import ProjectCard from "./project-card";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface ProjectWithRelations extends Project {
  author: Pick<User, "name" | "username" | "image">;
  categories: {
    category: Category;
  }[];
  versions: (Version & {
    gameVersions: { gameVersion: GameVersion }[];
    loaders: { loader: Loader }[];
  })[];
  _count: {
    reviews: number;
  };
}

interface ProjectGridProps {
  projects: ProjectWithRelations[];
  className?: string;
  loading?: boolean;
}

export default function ProjectGrid({ projects, className, loading }: ProjectGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="aspect-video w-full rounded-lg bg-white/10" />
            <div className="mt-3 flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-white/10" />
              </div>
            </div>
            <div className="mt-3 h-4 w-full rounded bg-white/10" />
            <div className="mt-2 flex gap-1">
              <div className="h-5 w-12 rounded-full bg-white/10" />
              <div className="h-5 w-12 rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center transition-colors hover:border-white/20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-4xl">
          <Search className="h-8 w-8 text-orange-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">No projects found</h3>
        <p className="mt-2 max-w-md text-sm text-white/50">
          Try adjusting your filters or search terms to discover more projects.
        </p>
        <button
          onClick={() => {
            const params = new URLSearchParams(window.location.search);
            ["q", "category", "loader", "version", "platform", "type"].forEach((key) =>
              params.delete(key)
            );
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

  // Grid with projects
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}