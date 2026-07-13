"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface LoaderPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function LoaderPagination({
  currentPage,
  totalPages,
}: LoaderPaginationProps) {
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
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronLeftIcon className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {pages.map((page, idx) => {
        const prevPage = pages[idx - 1];
        const showEllipsis = prevPage !== undefined && page - prevPage > 1;

        return (
          <div key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="px-1 text-sm text-muted-foreground">…</span>
            )}
            <Button
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => goToPage(page)}
              className={
                page === currentPage
                  ? "h-9 w-9 rounded-full bg-orange-600 text-white shadow-sm hover:bg-orange-500"
                  : "h-9 w-9 rounded-full border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
        className="h-9 w-9 rounded-full border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        <ChevronRightIcon className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}