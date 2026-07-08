"use client";

import { useRef } from "react";
import Link from "next/link";
import { Clock, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const categoryStyles: Record<string, string> = {
  Mod: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Modpack: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  Shader: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Plugin: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Map: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const projects = [
  { title: "Voxel Lighting Redux", author: "nightowl_dev", category: "Shader", time: "12 menit lalu", version: "1.21.4", gradient: "from-sky-400 to-sky-700", isNew: true },
  { title: "Guard Villagers", author: "samo_lego", category: "Mod", time: "48 menit lalu", version: "1.21.4", gradient: "from-emerald-400 to-emerald-700", isNew: true },
  { title: "SurviveTogether Pack", author: "CraftCollective", category: "Modpack", time: "2 jam lalu", version: "1.21.1", gradient: "from-orange-400 to-orange-700", isNew: true },
  { title: "GriefPrevention+", author: "protectcraft", category: "Plugin", time: "5 jam lalu", version: "1.21", gradient: "from-violet-400 to-violet-700", isNew: false },
  { title: "Ocean Ruins Expansion", author: "MapCraftStudio", category: "Map", time: "8 jam lalu", version: "1.20.6", gradient: "from-amber-400 to-amber-700", isNew: false },
  { title: "Dynamic Trees Reborn", author: "ferreusveritas", category: "Mod", time: "1 hari lalu", version: "1.21.4", gradient: "from-lime-400 to-lime-700", isNew: false },
  { title: "Nightfall Shaders", author: "duskvision", category: "Shader", time: "1 hari lalu", version: "1.21.1", gradient: "from-cyan-400 to-cyan-700", isNew: false },
];

export default function NewestProjects() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    scrollerRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-500">
              <Sparkles className="h-3.5 w-3.5" />
              Baru diunggah
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Proyek terbaru
            </h2>
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              aria-label="Sebelumnya"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Berikutnya"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project) => (
            <Link
              key={project.title}
              href={`/mods/${project.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group relative flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-orange-500/40"
            >
              {project.isNew && (
                <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  Baru
                </span>
              )}

              <div className={`h-24 w-full bg-gradient-to-br ${project.gradient}`} />

              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${categoryStyles[project.category]}`}
                  >
                    {project.category}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    MC {project.version}
                  </span>
                </div>

                <h3 className="truncate text-sm font-semibold text-card-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  {project.title}
                </h3>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  oleh {project.author}
                </p>

                <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {project.time}
                </div>
              </div>
            </Link>
          ))}

          <Link
            href="/mods?sort=newest"
            className="flex w-64 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground transition-colors hover:border-orange-500/40 hover:bg-accent hover:text-foreground"
          >
            Lihat semua terbaru
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}