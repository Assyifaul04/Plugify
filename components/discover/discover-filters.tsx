"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Category, Loader, GameVersion } from "@prisma/client";

interface FilterOptions {
  categories: (Category & { _count: { projects: number } })[];
  loaders: (Loader & { _count: { versions: number } })[];
  versions: Pick<GameVersion, "id" | "version" | "isMajor">[];
}

interface DiscoverFiltersProps {
  initialPlatform: string;
  initialType: string;
  initialSort: string;
  initialCategory: string;
  initialLoader: string;
  initialVersion: string;
  categories: FilterOptions["categories"];
  loaders: FilterOptions["loaders"];
  versions: FilterOptions["versions"];
}

const platformOptions = [
  { value: "", label: "All Platforms" },
  { value: "JAVA", label: "Java" },
  { value: "BEDROCK", label: "Bedrock" },
];

const typeOptions = [
  { value: "", label: "All Types" },
  { value: "MOD", label: "Mod" },
  { value: "MODPACK", label: "Modpack" },
  { value: "SHADER", label: "Shader" },
  { value: "PLUGIN", label: "Plugin" },
  { value: "RESOURCE_PACK", label: "Resource Pack" },
  { value: "DATA_PACK", label: "Data Pack" },
  { value: "MAP", label: "Map" },
];

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "popular", label: "Terpopuler" },
  { value: "trending", label: "Tren" },
  { value: "updated", label: "Terupdate" },
];

export default function DiscoverFilters({
  initialPlatform,
  initialType,
  initialSort,
  initialCategory,
  initialLoader,
  initialVersion,
  categories,
  loaders,
  versions,
}: DiscoverFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters =
    initialPlatform ||
    initialType ||
    initialSort !== "newest" ||
    initialCategory ||
    initialLoader ||
    initialVersion;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Sort */}
        <Select defaultValue={initialSort || "newest"} onValueChange={(v) => updateFilter("sort", v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Platform */}
        <Select defaultValue={initialPlatform} onValueChange={(v) => updateFilter("platform", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            {platformOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type */}
        <Select defaultValue={initialType} onValueChange={(v) => updateFilter("type", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tipe" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category */}
        <Select defaultValue={initialCategory} onValueChange={(v) => updateFilter("category", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Loader */}
        <Select defaultValue={initialLoader} onValueChange={(v) => updateFilter("loader", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Loader" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Loader</SelectItem>
            {loaders.map((loader) => (
              <SelectItem key={loader.id} value={loader.name}>
                {loader.icon} {loader.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Game Version */}
        <Select defaultValue={initialVersion} onValueChange={(v) => updateFilter("version", v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Versi Game" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Versi</SelectItem>
            {versions.map((v) => (
              <SelectItem key={v.id} value={v.version}>
                {v.version} {v.isMajor ? "⭐" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear all */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
            <X className="mr-1 h-3 w-3" /> Reset Filter
          </Button>
        )}
      </div>

      {/* Active filters */}
      <div className="flex flex-wrap gap-1">
        {initialCategory && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {categories.find((c) => c.slug === initialCategory)?.name}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => updateFilter("category", "")}
            />
          </Badge>
        )}
        {initialLoader && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {loaders.find((l) => l.name === initialLoader)?.name}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => updateFilter("loader", "")}
            />
          </Badge>
        )}
        {initialVersion && (
          <Badge variant="secondary" className="flex items-center gap-1">
            MC {initialVersion}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => updateFilter("version", "")}
            />
          </Badge>
        )}
        {initialPlatform && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {platformOptions.find((p) => p.value === initialPlatform)?.label}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => updateFilter("platform", "")}
            />
          </Badge>
        )}
        {initialType && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {typeOptions.find((t) => t.value === initialType)?.label}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => updateFilter("type", "")}
            />
          </Badge>
        )}
      </div>
    </div>
  );
}