"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface DiscoverSearchProps {
  initialQuery: string;
}

export default function DiscoverSearch({ initialQuery }: DiscoverSearchProps) {
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

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Cari proyek, author, atau kategori..."
        defaultValue={initialQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-9 pr-10 h-12 text-base"
      />
      {initialQuery && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}