// components/projects/project-pagination.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function ProjectPagination({ currentPage, totalPages }: ProjectPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  // Bangun daftar halaman yang ditampilkan, dengan ellipsis kalau terlalu banyak
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const siblingCount = 1;

    const start = Math.max(2, currentPage - siblingCount);
    const end = Math.min(totalPages - 1, currentPage + siblingCount);

    pages.push(1);

    if (start > 2) pages.push("ellipsis");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("ellipsis");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const navButtonClass =
    "h-9 w-9 border-white/10 bg-black/60 text-white hover:bg-orange-500/10 hover:text-orange-400 disabled:opacity-30 disabled:hover:bg-black/60 disabled:hover:text-white";

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={navButtonClass}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1.5">
        {pageNumbers.map((page, idx) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-white/30"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              variant="outline"
              size="icon"
              onClick={() => goToPage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "h-9 w-9 border-white/10 text-sm font-medium",
                page === currentPage
                  ? "border-orange-500 bg-orange-500 text-black hover:bg-orange-400"
                  : "bg-black/60 text-white/70 hover:bg-orange-500/10 hover:text-orange-400"
              )}
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={navButtonClass}
        aria-label="Halaman berikutnya"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}