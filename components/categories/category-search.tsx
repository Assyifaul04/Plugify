"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

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
      <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Cari nama atau slug kategori..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}