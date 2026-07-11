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
import { Search, Sparkles, SlidersHorizontal } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface DiscoverHeaderProps {
  initialQuery: string;
  initialSort: string;
  totalResults: number;
  currentResults: number;
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Downloads" },
  { value: "trending", label: "Trending" },
  { value: "updated", label: "Recently Updated" },
];

export default function DiscoverHeader({
  initialQuery,
  initialSort,
  totalResults,
  currentResults,
}: DiscoverHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 via-zinc-900/50 to-orange-950/30 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-400">
            <Sparkles className="h-4 w-4" />
            Discover your next favorite project
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
            Browse mods, shaders, plugins, and more
          </h2>
          <p className="text-sm text-zinc-400">
            Search across the community and filter by platform, loader, and version.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-300">
          <SlidersHorizontal className="h-4 w-4" />
          <span>{totalResults.toLocaleString()} projects available</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search mods, shaders, plugins..."
            defaultValue={initialQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-11 rounded-full border-white/10 bg-zinc-800/60 pl-10 text-zinc-100 placeholder:text-zinc-500 shadow-sm focus-visible:ring-orange-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 lg:justify-end">
          <p className="text-sm text-zinc-400">
            Showing <span className="font-medium text-zinc-100">{currentResults}</span> of{" "}
            <span className="font-medium text-zinc-100">{totalResults.toLocaleString()}</span> projects
          </p>
          <Select defaultValue={initialSort || "newest"} onValueChange={handleSort}>
            <SelectTrigger className="h-9 w-[160px] border-white/10 bg-zinc-800/60 text-zinc-100 focus:ring-orange-500">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-zinc-900 text-zinc-100">
              {sortOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="focus:bg-orange-500/20 focus:text-orange-400"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}