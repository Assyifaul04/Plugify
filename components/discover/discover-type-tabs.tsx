"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const typeTabs = [
  { value: "", label: "All" },
  { value: "MOD", label: "Mods" },
  { value: "RESOURCE_PACK", label: "Resource Packs" },
  { value: "DATA_PACK", label: "Data Packs" },
  { value: "SHADER", label: "Shaders" },
  { value: "MODPACK", label: "Modpacks" },
  { value: "PLUGIN", label: "Plugins" },
];

interface DiscoverTypeTabsProps {
  active: string;
}

export default function DiscoverTypeTabs({ active }: DiscoverTypeTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setType = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("type", value);
    else params.delete("type");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {typeTabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setType(tab.value)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            active === tab.value
              ? "bg-orange-500 text-white"
              : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}