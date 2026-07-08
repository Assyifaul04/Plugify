"use client";

import Link from "next/link";
import {
  Download,
  Flame,
  ArrowRight,
  Clock,
  Search,
  Heart,
  ChevronDown,
} from "lucide-react";

const categoryStyles: Record<string, string> = {
  Mod: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Modpack: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  Shader: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Plugin: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Map: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const projects = [
  {
    title: "Terralith",
    author: "stardustlabs",
    category: "Mod",
    description:
      "Menambah lebih dari 85 bioma baru dengan generasi dunia yang jauh lebih variatif tanpa mengubah gameplay dasar.",
    downloads: "8.1M",
    likes: "5,638",
    updated: "3 hari lalu",
    version: "1.21.4",
    gradient: "from-emerald-400 via-emerald-500 to-emerald-700",
    featured: true,
  },
  {
    title: "Better Minecraft",
    author: "bacon_donut",
    category: "Modpack",
    description:
      "Modpack all-in-one yang memperkaya survival vanilla dengan ratusan mod berkualitas tanpa terasa berlebihan.",
    downloads: "24.6M",
    likes: "4,546",
    updated: "1 minggu lalu",
    version: "1.21.1",
    gradient: "from-orange-400 via-orange-500 to-orange-700",
    featured: true,
  },
  {
    title: "Complementary Shaders",
    author: "EminGT",
    category: "Shader",
    description:
      "Pencahayaan dan bayangan realistis dengan performa ringan, cocok untuk hardware menengah ke bawah.",
    downloads: "16.3M",
    likes: "1,494",
    updated: "2 minggu lalu",
    version: "1.21.4",
    gradient: "from-sky-400 via-sky-500 to-sky-700",
    featured: true,
  },
];

export default function FeaturedProjects() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-10">
          {/* Left: Text */}
          <div className="max-w-lg">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-500">
              <Flame className="h-3.5 w-3.5" />
              Trending minggu ini
            </div>
            <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Temukan yang kamu mau, cepat dan mudah
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Pencarian Plugify yang cepat dan filter canggih membantu kamu
              menemukan mod, modpack, shader, plugin, dan map yang tepat
              sesuai kebutuhanmu.
            </p>

            <Link
              href="/mods"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-orange-600 dark:hover:text-orange-400"
            >
              Lihat semua proyek
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right: Floating search result panel */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xl dark:shadow-black/40">
              {/* Search bar + sort */}
              <div className="mb-4 flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">leave</span>
                </div>
                <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground">
                  Sort by:{" "}
                  <span className="text-muted-foreground">Relevance</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Result list */}
              <div className="flex flex-col divide-y divide-border">
                {projects.map((project) => (
                  <Link
                    key={project.title}
                    href={`/mods/${project.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="group flex gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div
                      className={`h-14 w-14 shrink-0 rounded-lg bg-gradient-to-br ${project.gradient}`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-card-foreground">
                        {project.title}{" "}
                        <span className="font-normal text-muted-foreground">
                          by {project.author}
                        </span>
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {project.description}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${categoryStyles[project.category]}`}
                        >
                          {project.category}
                        </span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                          MC {project.version}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {project.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {project.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {project.updated}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ambient glow di belakang panel */}
            <div
              className="pointer-events-none absolute -right-10 -top-10 -z-10 h-64 w-64 rounded-full bg-orange-500/15 blur-[100px]"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}