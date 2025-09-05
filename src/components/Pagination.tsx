"use client";
import React from "react";
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
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  if (safeTotalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];

    // Luôn có trang đầu
    pages.push(1);

    // Nếu currentPage > 3 → chèn "..."
    if (currentPage > 3) {
      pages.push("...");
    }

    // Lấy khoảng currentPage-1, currentPage, currentPage+1
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < safeTotalPages) {
        pages.push(i);
      }
    }

    // Nếu currentPage < totalPages - 2 → chèn "..."
    if (currentPage < safeTotalPages - 2) {
      pages.push("...");
    }

    // Luôn có trang cuối
    if (safeTotalPages > 1) {
      pages.push(safeTotalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-wrap justify-center mt-4 gap-2 items-center">
      <Button
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>

      {getPages().map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2 text-gray-500">
            ...
          </span>
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

      <span className="text-sm text-gray-500 px-2">
        Trang {currentPage}/{safeTotalPages}
      </span>
    </div>
  );
}
