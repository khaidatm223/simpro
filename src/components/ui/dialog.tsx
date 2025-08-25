"use client"; // ✨ Thêm ở đầu file
import { useState } from "react";

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-96">{children}</div>
      <button className="absolute top-2 right-2 text-gray-500" onClick={() => onOpenChange(false)}>×</button>
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) { return <div className="mb-2 font-bold">{children}</div>; }
export function DialogContent({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }
export function DialogFooter({ children }: { children: React.ReactNode }) { return <div className="mt-4 flex justify-end gap-2">{children}</div>; }
export function DialogTitle({ children }: { children: React.ReactNode }) { return <h2 className="text-lg font-semibold">{children}</h2>; }
export function DialogDescription({ children }: { children: React.ReactNode }) { return <p className="text-sm text-gray-600">{children}</p>; }
