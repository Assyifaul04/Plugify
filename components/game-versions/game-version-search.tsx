"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

interface GameVersionSearchProps {
  initialSearch?: string;
  initialPlatform?: string;
}

const PLATFORMS = ["JAVA", "BEDROCK"] as const;

export default function GameVersionSearch({
  initialSearch = "",
  initialPlatform = "",
}: GameVersionSearchProps) {
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

  function handlePlatformChange(platform: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (platform === "ALL") {
      params.delete("platform");
    } else {
      params.set("platform", platform);
    }
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
      <div className="relative w-full sm:w-64">
        <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari versi (cth. 1.20.1)..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select
        defaultValue={initialPlatform || "ALL"}
        onValueChange={handlePlatformChange}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Semua Platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Semua Platform</SelectItem>
          {PLATFORMS.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}