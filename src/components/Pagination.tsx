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

  const getPages = () => {
    const pages: (number | string)[] = [];

    if (safeTotalPages <= 7) {
      // Nếu ít hơn hoặc bằng 7 trang thì hiển thị hết
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn có trang đầu
      pages.push(1);

      let left = currentPage - 1;
      let right = currentPage + 1;

      // Nếu currentPage gần đầu
      if (currentPage <= 3) {
        left = 2;
        right = 4;
      }
      // Nếu currentPage gần cuối
      else if (currentPage >= safeTotalPages - 2) {
        left = safeTotalPages - 3;
        right = safeTotalPages - 1;
      }

      if (left > 2) {
        pages.push("...");
      }

      for (let i = left; i <= right; i++) {
        if (i > 1 && i < safeTotalPages) {
          pages.push(i);
        }
      }

      if (right < safeTotalPages - 1) {
        pages.push("...");
      }

      // Luôn có trang cuối
      pages.push(safeTotalPages);
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
