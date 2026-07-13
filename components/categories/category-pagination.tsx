"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function CategoryPagination({
  currentPage,
  totalPages,
}: CategoryPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className="rounded-full border-border text-muted-foreground disabled:opacity-40"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>

      {pages.map((page, idx) => {
        const prevPage = pages[idx - 1];
        const showEllipsis = prevPage !== undefined && page - prevPage > 1;

        return (
          <div key={page} className="flex items-center gap-1.5">
            {showEllipsis && (
              <span className="px-1 text-sm text-muted-foreground">···</span>
            )}
            <Button
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => goToPage(page)}
              className={
                page === currentPage
                  ? "rounded-full bg-orange-600 hover:bg-orange-500"
                  : "rounded-full border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              }
            >
              {page}
            </Button>
          </div>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="rounded-full border-border text-muted-foreground disabled:opacity-40"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}