"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Category, Loader, GameVersion } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FilterOptions {
  categories: (Category & { _count: { projects: number } })[];
  loaders: (Loader & { _count: { versions: number } })[];
  versions: Pick<GameVersion, "id" | "version" | "isMajor" | "isBeta" | "platform">[];
  platforms: { platform: string; _count: { platform: number } }[];
  types: { type: string; _count: { type: number } }[];
}

interface DiscoverSidebarProps {
  categories: FilterOptions["categories"];
  loaders: FilterOptions["loaders"];
  versions: FilterOptions["versions"];
  platforms: FilterOptions["platforms"];
  types: FilterOptions["types"];
  activeFilters: {
    category: string;
    loader: string;
    version: string;
    platform: string;
    type: string;
  };
}

const platformLabels: Record<string, string> = {
  JAVA: "Java",
  BEDROCK: "Bedrock",
};

const typeLabels: Record<string, string> = {
  MOD: "Mod",
  MODPACK: "Modpack",
  SHADER: "Shader",
  PLUGIN: "Plugin",
  RESOURCE_PACK: "Resource Pack",
  DATA_PACK: "Data Pack",
  MAP: "Map",
};

export default function DiscoverSidebar({
  categories,
  loaders,
  versions,
  platforms,
  types,
  activeFilters,
}: DiscoverSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [versionQuery, setVersionQuery] = useState("");
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [showAllLoaders, setShowAllLoaders] = useState(false);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["category", "loader", "version", "platform", "type", "q", "sort"].forEach((key) =>
      params.delete(key)
    );
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const loadersByPlatform = activeFilters.platform
    ? loaders.filter((l) => l.platform === activeFilters.platform)
    : loaders;

  const versionsByPlatform = activeFilters.platform
    ? versions.filter((v) => v.platform === activeFilters.platform)
    : versions;

  const searchedVersions = versionQuery
    ? versionsByPlatform.filter((v) =>
        v.version.toLowerCase().includes(versionQuery.toLowerCase())
      )
    : versionsByPlatform;

  const visibleVersions = showAllVersions ? searchedVersions : searchedVersions.slice(0, 8);
  const visibleLoaders = showAllLoaders ? loadersByPlatform : loadersByPlatform.slice(0, 6);

  const checkboxClass =
    "h-3.5 w-3.5 border-border data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500";

  const hasActiveFilters = Object.values(activeFilters).some((v) => v && v !== "all");
  const activeFilterCount = Object.values(activeFilters).filter((v) => v && v !== "all").length;

  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5 text-orange-400" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-orange-500/20 px-1.5 py-0.5 text-[10px] text-orange-400">
              {activeFilterCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-orange-400"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Platform Tabs */}
      {platforms.length > 0 && (
        <div className="mb-4 flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5 text-xs">
          {platforms.map((p) => (
            <button
              key={p.platform}
              onClick={() => updateFilter("platform", p.platform)}
              className={cn(
                "rounded-full px-2.5 py-0.5 transition-colors",
                activeFilters.platform === p.platform
                  ? "bg-orange-500 text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {platformLabels[p.platform] || p.platform}
            </button>
          ))}
        </div>
      )}

      <ScrollArea className="max-h-[calc(100vh-300px)] pr-2">
        <Accordion type="multiple" defaultValue={["game-versions", "loaders", "categories", "types"]}>
          {/* Game Versions */}
          <AccordionItem value="game-versions" className="border-border">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
              Game Version
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={versionQuery}
                  onChange={(e) => setVersionQuery(e.target.value)}
                  placeholder="Search version..."
                  className="h-8 border-border bg-card pl-8 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-orange-500"
                />
              </div>
              <div className="space-y-1">
                {visibleVersions.length > 0 ? (
                  visibleVersions.map((v) => (
                    <label
                      key={v.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Checkbox
                        checked={activeFilters.version === v.version}
                        onCheckedChange={() => updateFilter("version", v.version)}
                        className={checkboxClass}
                      />
                      <span>{v.version}</span>
                      {v.isBeta && (
                        <span className="text-[10px] text-yellow-500">β</span>
                      )}
                      {v.isMajor && (
                        <span className="text-[10px] text-orange-400">★</span>
                      )}
                    </label>
                  ))
                ) : (
                  <p className="px-1 text-xs text-muted-foreground">No versions found.</p>
                )}
              </div>
              {searchedVersions.length > 8 && (
                <button
                  onClick={() => setShowAllVersions((s) => !s)}
                  className="px-1 pt-1 text-xs text-muted-foreground transition-colors hover:text-orange-400"
                >
                  {showAllVersions ? "Show less" : `Show all (${searchedVersions.length})`}
                </button>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Loaders */}
          <AccordionItem value="loaders" className="border-border">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
              Loader
            </AccordionTrigger>
            <AccordionContent className="space-y-1">
              {visibleLoaders.length > 0 ? (
                visibleLoaders.map((l) => (
                  <label
                    key={l.id}
                    className="flex cursor-pointer items-center justify-between rounded px-1 py-1 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Checkbox
                        checked={activeFilters.loader === l.name}
                        onCheckedChange={() => updateFilter("loader", l.name)}
                        className={checkboxClass}
                      />
                      {l.icon && <span className="text-sm">{l.icon}</span>}
                      {l.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{l._count.versions}</span>
                  </label>
                ))
              ) : (
                <p className="px-1 text-xs text-muted-foreground">No loaders for this platform.</p>
              )}
              {loadersByPlatform.length > 6 && (
                <button
                  onClick={() => setShowAllLoaders((s) => !s)}
                  className="px-1 pt-1 text-xs text-muted-foreground transition-colors hover:text-orange-400"
                >
                  {showAllLoaders ? "Show less" : `Show all (${loadersByPlatform.length})`}
                </button>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Categories */}
          <AccordionItem value="categories" className="border-border">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
              Category
            </AccordionTrigger>
            <AccordionContent className="space-y-1">
              {categories.length > 0 ? (
                categories.map((c) => (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center justify-between rounded px-1 py-1 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Checkbox
                        checked={activeFilters.category === c.slug}
                        onCheckedChange={() => updateFilter("category", c.slug)}
                        className={checkboxClass}
                      />
                      {c.icon && <span className="text-sm">{c.icon}</span>}
                      {c.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{c._count.projects}</span>
                  </label>
                ))
              ) : (
                <p className="px-1 text-xs text-muted-foreground">No categories available.</p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Types */}
          {types.length > 0 && (
            <AccordionItem value="types" className="border-border">
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                Type
              </AccordionTrigger>
              <AccordionContent className="space-y-1">
                {types.map((t) => (
                  <label
                    key={t.type}
                    className="flex cursor-pointer items-center justify-between rounded px-1 py-1 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Checkbox
                        checked={activeFilters.type === t.type}
                        onCheckedChange={() => updateFilter("type", t.type)}
                        className={checkboxClass}
                      />
                      {typeLabels[t.type] || t.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{t._count.type}</span>
                  </label>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-4 w-full rounded-full border border-dashed border-orange-500/40 bg-orange-500/10 py-2 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/20"
          >
            Clear all filters
          </button>
        )}
      </ScrollArea>
    </div>
  );
}