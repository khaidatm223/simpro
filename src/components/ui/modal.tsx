"use client";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-96 p-4">
        {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
        <div>{children}</div>
        <button
          className="mt-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
