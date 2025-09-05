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
  // Đảm bảo totalPages luôn là số >= 1
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);

  const getPages = () => {
    const pages: (number | string)[] = [];

    if (safeTotalPages <= 7) {
      // Nếu ít trang thì show hết
      for (let i = 1; i <= safeTotalPages; i++) pages.push(i);
    } else {
      pages.push(1); // Trang đầu

      if (currentPage > 4) pages.push("...");

      const start = Math.max(2, currentPage - 2);
      const end = Math.min(safeTotalPages - 1, currentPage + 2);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < safeTotalPages - 3) pages.push("...");

      pages.push(safeTotalPages); // Trang cuối
    }

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
          <span key={idx} className="px-2">
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
    </div>
  );
}
