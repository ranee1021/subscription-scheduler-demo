"use client";

import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    // 현재 페이지가 끝에 가까우면 시작점 조정
    if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // 현재 페이지가 시작에 가까우면 끝점 조정
    if (currentPage - half <= 1) {
      end = Math.min(totalPages, maxVisiblePages);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push("...");
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center gap-2 ${className || ""}`}>
      {showFirstLast && (
        <Button
          variant="outline"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1"
        >
          «
        </Button>
      )}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1"
      >
        ‹
      </Button>

      {visiblePages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              currentPage === pageNum
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
            aria-label={`페이지 ${pageNum}`}
            aria-current={currentPage === pageNum ? "page" : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1"
      >
        ›
      </Button>
      {showFirstLast && (
        <Button
          variant="outline"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1"
        >
          »
        </Button>
      )}
    </div>
  );
}

