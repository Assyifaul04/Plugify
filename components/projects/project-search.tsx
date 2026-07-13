// app/dashboard/projects/components/project-filters.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

const PROJECT_TYPES = [
  "MOD",
  "MODPACK",
  "SHADER",
  "PLUGIN",
  "RESOURCE_PACK",
  "DATA_PACK",
  "MAP",
];

const PLATFORMS = ["JAVA", "BEDROCK"];

const STATUSES = [
  "DRAFT",
  "PENDING_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
  "REJECTED",
  "DELISTED",
];

interface ProjectFiltersProps {
  initialSearch: string;
  initialType: string;
  initialPlatform: string;
  initialStatus: string;
}

export default function ProjectFilters({
  initialSearch,
  initialType,
  initialPlatform,
  initialStatus,
}: ProjectFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasFilters = initialSearch || initialType || initialPlatform || initialStatus;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari project..."
          defaultValue={initialSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-10 rounded-lg border-border bg-muted/40 pl-9 pr-9 text-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-orange-600/40 focus-visible:ring-offset-0"
        />
        {initialSearch && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.delete("search");
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Select
        value={initialType || "ALL"}
        onValueChange={(value) => handleFilterChange("type", value)}
      >
        <SelectTrigger className="h-10 w-[150px] rounded-lg border-border bg-muted/40 text-sm focus-visible:ring-2 focus-visible:ring-orange-600/40">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Types</SelectItem>
          {PROJECT_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={initialPlatform || "ALL"}
        onValueChange={(value) => handleFilterChange("platform", value)}
      >
        <SelectTrigger className="h-10 w-[150px] rounded-lg border-border bg-muted/40 text-sm focus-visible:ring-2 focus-visible:ring-orange-600/40">
          <SelectValue placeholder="All Platforms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Platforms</SelectItem>
          {PLATFORMS.map((platform) => (
            <SelectItem key={platform} value={platform}>
              {platform}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={initialStatus || "ALL"}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="h-10 w-[150px] rounded-lg border-border bg-muted/40 text-sm focus-visible:ring-2 focus-visible:ring-orange-600/40">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Status</SelectItem>
          {STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 rounded-full text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 h-3 w-3" />
          Reset
        </Button>
      )}
    </div>
  );
}