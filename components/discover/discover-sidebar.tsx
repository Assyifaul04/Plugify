"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Category, Loader, GameVersion, GamePlatform } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

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

const typeLabels: Record<string, string> = {
  MOD: "Mod",
  MODPACK: "Modpack",
  SHADER: "Shader",
  PLUGIN: "Plugin",
  RESOURCE_PACK: "Resource Pack",
  DATA_PACK: "Data Pack",
  MAP: "Map",
};

const platformLabels: Record<string, string> = {
  JAVA: "Java",
  BEDROCK: "Bedrock",
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

  // Loaders & versions difilter berdasarkan platform aktif (kalau ada dipilih)
  const filteredLoaders = activeFilters.platform
    ? loaders.filter((l) => l.platform === activeFilters.platform)
    : loaders;

  const filteredVersions = activeFilters.platform
    ? versions.filter((v) => v.platform === activeFilters.platform)
    : versions;

  const FilterItem = ({
    label,
    value,
    filterKey,
    count,
    active,
    icon,
    subLabel,
  }: {
    label: string;
    value: string;
    filterKey: string;
    count?: number;
    active?: boolean;
    icon?: string;
    subLabel?: string;
  }) => (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border px-3 py-2 transition-colors",
        active
          ? "border-orange-500/40 bg-orange-500/10"
          : "border-zinc-700/50 bg-zinc-800/40 hover:bg-zinc-700/50"
      )}
    >
      <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm">
        <Checkbox
          checked={active || false}
          onCheckedChange={() => updateFilter(filterKey, value)}
          className="h-4 w-4 border-zinc-400 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
        />
        <span className="flex flex-col">
          <span className="flex items-center gap-1 text-zinc-100">
            {icon && <span>{icon}</span>}
            {label}
          </span>
          {subLabel && (
            <span className="text-xs text-zinc-400">{subLabel}</span>
          )}
        </span>
      </label>
      {count !== undefined && (
        <Badge
          variant={active ? "default" : "secondary"}
          className={cn(
            "text-xs font-normal",
            active
              ? "bg-orange-500 text-white"
              : "bg-zinc-700 text-zinc-300"
          )}
        >
          {count}
        </Badge>
      )}
    </div>
  );

  return (
    <div className="sticky top-24 rounded-2xl border border-zinc-700/50 bg-zinc-900/80 p-4 shadow-sm backdrop-blur-sm">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Filters</h2>
          <p className="text-sm text-zinc-400">
            Narrow down by type, loader, and version.
          </p>
        </div>
        <div className="rounded-full bg-orange-500/15 p-2 text-orange-400">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-220px)] pr-3">
        <Accordion type="multiple" defaultValue={["platforms", "game-versions", "categories", "loaders"]}>
          <AccordionItem value="platforms" className="border-zinc-700/50">
            <AccordionTrigger className="text-sm font-medium text-zinc-100 hover:no-underline hover:text-zinc-50">
              Platforms
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              {platforms.map((p) => (
                <FilterItem
                  key={p.platform}
                  label={platformLabels[p.platform] || p.platform}
                  value={p.platform}
                  filterKey="platform"
                  count={p._count.platform}
                  active={activeFilters.platform === p.platform}
                />
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="game-versions" className="border-zinc-700/50">
            <AccordionTrigger className="text-sm font-medium text-zinc-100 hover:no-underline hover:text-zinc-50">
              Game versions
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              {filteredVersions.slice(0, 10).map((v) => (
                <FilterItem
                  key={v.id}
                  label={`${v.version}${v.isMajor ? " ⭐" : ""}${v.isBeta ? " β" : ""}`}
                  value={v.version}
                  filterKey="version"
                  subLabel={platformLabels[v.platform] || v.platform}
                  active={activeFilters.version === v.version}
                />
              ))}
              {filteredVersions.length > 10 && (
                <div className="mt-1 text-xs text-zinc-400">
                  +{filteredVersions.length - 10} more versions
                </div>
              )}
              {filteredVersions.length === 0 && (
                <div className="mt-1 text-xs text-zinc-400">
                  No versions for this platform.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="categories" className="border-zinc-700/50">
            <AccordionTrigger className="text-sm font-medium text-zinc-100 hover:no-underline hover:text-zinc-50">
              Categories
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              {categories.map((c) => (
                <FilterItem
                  key={c.id}
                  label={c.name}
                  value={c.slug}
                  filterKey="category"
                  count={c._count.projects}
                  icon={c.icon ?? undefined}
                  active={activeFilters.category === c.slug}
                />
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="loaders" className="border-zinc-700/50">
            <AccordionTrigger className="text-sm font-medium text-zinc-100 hover:no-underline hover:text-zinc-50">
              Loaders
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              {filteredLoaders.map((l) => (
                <FilterItem
                  key={l.id}
                  label={l.name}
                  value={l.name}
                  filterKey="loader"
                  count={l._count.versions}
                  icon={l.icon ?? undefined}
                  subLabel={platformLabels[l.platform] || l.platform}
                  active={activeFilters.loader === l.name}
                />
              ))}
              {filteredLoaders.length === 0 && (
                <div className="mt-1 text-xs text-zinc-400">
                  No loaders for this platform.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="types" className="border-zinc-700/50">
            <AccordionTrigger className="text-sm font-medium text-zinc-100 hover:no-underline hover:text-zinc-50">
              Project Types
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              {types.map((t) => (
                <FilterItem
                  key={t.type}
                  label={typeLabels[t.type] || t.type}
                  value={t.type}
                  filterKey="type"
                  count={t._count.type}
                  active={activeFilters.type === t.type}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {Object.values(activeFilters).some(Boolean) && (
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              ["category", "loader", "version", "platform", "type"].forEach((key) =>
                params.delete(key)
              );
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="mt-4 w-full rounded-full border border-dashed border-orange-400/40 bg-orange-500/10 py-2 text-sm font-medium text-orange-400 transition hover:bg-orange-500/20"
          >
            Clear all filters
          </button>
        )}
      </ScrollArea>
    </div>
  );
}