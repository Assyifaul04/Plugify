"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscoverPaginationProps {
  currentPage: number;
  totalPages: number;
  compact?: boolean;
}

export default function DiscoverPagination({
  currentPage,
  totalPages,
  compact = false,
}: DiscoverPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const maxButtons = compact ? 3 : 5;
  let pages: number[] = [];
  if (totalPages <= maxButtons) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (currentPage <= 2) {
    pages = Array.from({ length: maxButtons }, (_, i) => i + 1);
  } else if (currentPage >= totalPages - 1) {
    pages = Array.from({ length: maxButtons }, (_, i) => totalPages - maxButtons + 1 + i);
  } else {
    const half = Math.floor(maxButtons / 2);
    pages = Array.from({ length: maxButtons }, (_, i) => currentPage - half + i);
  }

  const showEllipsis = pages[pages.length - 1] < totalPages - 1;
  const showLast = pages[pages.length - 1] < totalPages;

  return (
    <div className="flex items-center gap-1">
      {!compact && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => goToPage(currentPage - 1)} 
          disabled={currentPage <= 1}
          className="border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={cn(
            "flex items-center justify-center rounded-full text-sm font-medium transition-colors",
            compact ? "h-7 w-7" : "h-9 w-9",
            page === currentPage
              ? "bg-orange-500 text-white"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          {page}
        </button>
      ))}
      {showEllipsis && <span className="px-1 text-muted-foreground">…</span>}
      {showLast && (
        <button
          onClick={() => goToPage(totalPages)}
          className={cn(
            "flex items-center justify-center rounded-full text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            compact ? "h-7 w-7" : "h-9 w-9"
          )}
        >
          {totalPages}
        </button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          "border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground",
          compact ? "h-7 w-7 p-0" : ""
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}