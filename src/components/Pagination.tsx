"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Nếu chưa mounted (SSR) thì không render phân trang
  if (!mounted) return null;

  const safeTotalPages = Math.max(1, Number(totalPages) || 1);

  const getPages = () => {
    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < safeTotalPages) {
        pages.push(i);
      }
    }

    if (currentPage < safeTotalPages - 2) pages.push("...");

    if (safeTotalPages > 1) pages.push(safeTotalPages);

    return pages;
  };

  return (
    <div className="flex justify-center mt-4 gap-2">
      <Button
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>

      {getPages().map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2">...</span>
        ) : (
          <Button
            key={p}
            size="sm"
            variant={currentPage === p ? "default" : "outline"}
            onClick={() => onPageChange(Number(p))}
          >
            {p}
          </Button>
        )
      )}

      <Button
        size="sm"
        disabled={currentPage === safeTotalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}
