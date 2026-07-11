"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface GameVersionPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function GameVersionPagination({
  currentPage,
  totalPages,
}: GameVersionPaginationProps) {
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
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>

      {pages.map((page, idx) => {
        const prevPage = pages[idx - 1];
        const showEllipsis = prevPage !== undefined && page - prevPage > 1;

        return (
          <div key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="px-2 text-sm text-muted-foreground">...</span>
            )}
            <Button
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => goToPage(page)}
              className={page === currentPage ? "bg-orange-600 hover:bg-orange-500" : ""}
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
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}