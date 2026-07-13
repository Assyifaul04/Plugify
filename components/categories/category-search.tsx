"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";

interface CategorySearchProps {
  initialSearch?: string;
}

export default function CategorySearch({ initialSearch = "" }: CategorySearchProps) {
  const [value, setValue] = useState(initialSearch);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full sm:w-72">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Cari nama atau slug kategori..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="rounded-full border-border bg-muted/40 pl-9 pr-9 shadow-none transition-colors focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/40"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-2.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Hapus pencarian"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}