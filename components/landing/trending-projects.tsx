"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const ranges = ["Hari ini", "Minggu ini", "Bulan ini"] as const;
type Range = (typeof ranges)[number];

const categoryStyles: Record<string, string> = {
  Mod: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Modpack: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  Shader: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Plugin: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Map: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const data: Record<Range, {
  title: string;
  author: string;
  category: string;
  downloads: string;
  change: number;
  gradient: string;
}[]> = {
  "Hari ini": [
    { title: "Sodium", author: "jellysquid3", category: "Mod", downloads: "412K", change: 18.4, gradient: "from-cyan-400 to-cyan-700" },
    { title: "Terralith", author: "stardustlabs", category: "Mod", downloads: "298K", change: 12.1, gradient: "from-emerald-400 to-emerald-700" },
    { title: "Better Minecraft", author: "bacon_donut", category: "Modpack", downloads: "265K", change: -3.2, gradient: "from-orange-400 to-orange-700" },
    { title: "Complementary Shaders", author: "EminGT", category: "Shader", downloads: "201K", change: 6.7, gradient: "from-sky-400 to-sky-700" },
    { title: "EssentialsX", author: "EssentialsX Team", category: "Plugin", downloads: "154K", change: 0, gradient: "from-violet-400 to-violet-700" },
  ],
  "Minggu ini": [
    { title: "Terralith", author: "stardustlabs", category: "Mod", downloads: "1.9M", change: 24.6, gradient: "from-emerald-400 to-emerald-700" },
    { title: "Sodium", author: "jellysquid3", category: "Mod", downloads: "1.6M", change: 9.8, gradient: "from-cyan-400 to-cyan-700" },
    { title: "Xaero's Minimap", author: "xaero96", category: "Mod", downloads: "1.2M", change: 4.3, gradient: "from-lime-400 to-lime-700" },
    { title: "Better Minecraft", author: "bacon_donut", category: "Modpack", downloads: "980K", change: -1.4, gradient: "from-orange-400 to-orange-700" },
    { title: "SkyWars Arena Pack", author: "MapCraftStudio", category: "Map", downloads: "410K", change: 31.2, gradient: "from-amber-400 to-amber-700" },
  ],
  "Bulan ini": [
    { title: "Better Minecraft", author: "bacon_donut", category: "Modpack", downloads: "6.4M", change: 14.9, gradient: "from-orange-400 to-orange-700" },
    { title: "Complementary Shaders", author: "EminGT", category: "Shader", downloads: "5.1M", change: 7.2, gradient: "from-sky-400 to-sky-700" },
    { title: "Terralith", author: "stardustlabs", category: "Mod", downloads: "4.8M", change: 2.5, gradient: "from-emerald-400 to-emerald-700" },
    { title: "EssentialsX", author: "EssentialsX Team", category: "Plugin", downloads: "3.2M", change: -0.6, gradient: "from-violet-400 to-violet-700" },
    { title: "Sodium", author: "jellysquid3", category: "Mod", downloads: "2.9M", change: 5.8, gradient: "from-cyan-400 to-cyan-700" },
  ],
};

function ChangeBadge({ change }: { change: number }) {
  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <TrendingUp className="h-3.5 w-3.5" />
        {change.toFixed(1)}%
      </span>
    );
  }
  if (change < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
        <TrendingDown className="h-3.5 w-3.5" />
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
      <Minus className="h-3.5 w-3.5" />
      Stabil
    </span>
  );
}

export default function TrendingProjects() {
  const [range, setRange] = useState<Range>("Minggu ini");
  const items = data[range];

  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Sedang naik daun
          </h2>

          <div className="flex items-center gap-1 rounded-full border border-border bg-secondary p-1">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  range === r
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {items.map((item, index) => (
            <Link
              key={item.title}
              href={`/mods/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
              className={`group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-accent/50 sm:px-6 ${
                index !== items.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="w-6 shrink-0 text-center text-sm font-bold text-muted-foreground tabular-nums">
                {index + 1}
              </span>

              <div
                className={`h-11 w-11 shrink-0 rounded-lg bg-gradient-to-br ${item.gradient}`}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-card-foreground group-hover:text-primary">
                    {item.title}
                  </h3>
                  <span
                    className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold sm:inline-block ${categoryStyles[item.category]}`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  oleh {item.author}
                </p>
              </div>

              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-sm font-semibold text-card-foreground tabular-nums">
                  {item.downloads}
                </p>
                <p className="text-[11px] text-muted-foreground">unduhan</p>
              </div>

              <div className="w-20 shrink-0 text-right">
                <ChangeBadge change={item.change} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}