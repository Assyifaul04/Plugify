"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, LayoutGrid, List } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";
import DiscoverPagination from "./discover-pagination";

interface DiscoverHeaderProps {
  initialQuery: string;
  initialSort: string;
  initialLimit: string;
  totalResults: number;
  currentResults: number;
  currentPage: number;
  totalPages: number;
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most downloads" },
  { value: "trending", label: "Trending" },
  { value: "updated", label: "Recently updated" },
];

const limitOptions = ["10", "20", "50", "100"];

export default function DiscoverHeader({
  initialQuery,
  initialSort,
  initialLimit,
  totalResults,
  currentResults,
  currentPage,
  totalPages,
  view,
  onViewChange,
}: DiscoverHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    updateParam("q", value);
  }, 300);

  return (
    <div className="mb-4 space-y-3">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search mods..."
          defaultValue={initialQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-11 rounded-full border-border bg-card pl-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-orange-500"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Sort by:</span>
          <Select defaultValue={initialSort || "newest"} onValueChange={(v) => updateParam("sort", v)}>
            <SelectTrigger className="h-8 w-auto gap-1 border-none bg-transparent px-1 text-foreground shadow-none hover:text-orange-400 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-card text-foreground">
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="ml-3">View:</span>
          <Select defaultValue={initialLimit || "20"} onValueChange={(v) => updateParam("limit", v)}>
            <SelectTrigger className="h-8 w-auto gap-1 border-none bg-transparent px-1 text-foreground shadow-none hover:text-orange-400 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-card text-foreground">
              {limitOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-1 flex items-center rounded-md border border-border bg-card p-0.5">
            <button
              onClick={() => onViewChange("list")}
              className={cn(
                "rounded p-1 transition-colors",
                view === "list" ? "bg-orange-500/20 text-orange-400" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewChange("grid")}
              className={cn(
                "rounded p-1 transition-colors",
                view === "grid" ? "bg-orange-500/20 text-orange-400" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        <DiscoverPagination currentPage={currentPage} totalPages={totalPages} compact />
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {currentResults} of {totalResults.toLocaleString()} results
      </p>
    </div>
  );
}