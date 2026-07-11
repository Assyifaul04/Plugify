// components/projects/project-search.tsx
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
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { ProjectType, ProjectStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

interface ProjectSearchProps {
  initialSearch: string;
  initialType?: ProjectType;
  initialStatus?: ProjectStatus;
}

const ALL = "all";

const typeOptions = [
  { value: ALL, label: "Semua Tipe" },
  { value: "MOD", label: "Mod" },
  { value: "MODPACK", label: "Modpack" },
  { value: "SHADER", label: "Shader" },
  { value: "PLUGIN", label: "Plugin" },
  { value: "RESOURCE_PACK", label: "Resource Pack" },
  { value: "DATA_PACK", label: "Data Pack" },
  { value: "MAP", label: "Map" },
];

const statusOptions: { value: string; label: string; dot?: string }[] = [
  { value: ALL, label: "Semua Status" },
  { value: "DRAFT", label: "Draf", dot: "bg-white/40" },
  { value: "PENDING_REVIEW", label: "Menunggu Review", dot: "bg-yellow-400" },
  { value: "PUBLISHED", label: "Dipublikasikan", dot: "bg-orange-500" },
  { value: "ARCHIVED", label: "Diarsipkan", dot: "bg-white/20" },
  { value: "REJECTED", label: "Ditolak", dot: "bg-red-500" },
  { value: "DELISTED", label: "Dihapus", dot: "bg-red-500/60" },
];

export default function ProjectSearch({
  initialSearch,
  initialType,
  initialStatus,
}: ProjectSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== ALL) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const triggerClass =
    "border-white/10 bg-black/60 text-white focus:ring-orange-500 data-[placeholder]:text-white/40";
  const contentClass = "border-white/10 bg-black text-white";
  const itemClass = "focus:bg-orange-500/20 focus:text-orange-400";

  return (
    <div className="flex flex-1 flex-wrap gap-2">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" />
        <Input
          placeholder="Cari proyek..."
          defaultValue={initialSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="border-white/10 bg-black/60 pl-8 pr-8 text-white placeholder:text-white/40 focus-visible:ring-orange-500"
        />
        {initialSearch && (
          <button
            onClick={clearSearch}
            aria-label="Hapus pencarian"
            className="absolute right-2 top-2.5 text-white/40 transition-colors hover:text-orange-400"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Select
        defaultValue={initialType || ALL}
        onValueChange={(value) => handleFilter("type", value)}
      >
        <SelectTrigger className={cn(triggerClass, "w-[150px]")}>
          <SelectValue placeholder="Tipe" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          {typeOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className={itemClass}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={initialStatus || ALL}
        onValueChange={(value) => handleFilter("status", value)}
      >
        <SelectTrigger className={cn(triggerClass, "w-[170px]")}>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className={itemClass}>
              <span className="flex items-center gap-2">
                {opt.dot && (
                  <span className={cn("h-1.5 w-1.5 rounded-full", opt.dot)} />
                )}
                {opt.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}