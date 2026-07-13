'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
}

// Menghasilkan daftar nomor halaman + posisi ellipsis, mis:
// [1, '...', 4, 5, 6, '...', 20] — selalu tampilkan halaman pertama,
// terakhir, dan beberapa halaman di sekitar currentPage.
function getPageList(current: number, total: number): (number | 'ellipsis')[] {
  const siblingCount = 1;
  const totalNumbers = siblingCount * 2 + 5; // first + last + current + 2 sibling + 2 ellipsis slot

  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => total - (3 + siblingCount * 2) + i + 1
    );
    return [1, 'ellipsis', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  );
  return [1, 'ellipsis', ...middleRange, 'ellipsis', total];
}

export default function UserPagination({ currentPage, totalPages }: UserPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = getPageList(currentPage, totalPages);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            aria-disabled={isFirstPage}
            tabIndex={isFirstPage ? -1 : undefined}
            className={isFirstPage ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                aria-current={page === currentPage ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            aria-disabled={isLastPage}
            tabIndex={isLastPage ? -1 : undefined}
            className={isLastPage ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}