// src/components/ui/SimTable.tsx
"use client";
import React from "react";

type SimRow = {
  id: string | number;
  number: string;
  carrier?: string;
  type?: string;
  price?: number | string;
  tags?: string;
};

export default function SimTable({
  sims,
  onEdit,
  onDelete,
}: {
  sims: SimRow[];
  onEdit: (sim: SimRow) => void;
  onDelete: (id: string | number) => void;
}) {
  if (!sims || sims.length === 0) {
    return <div className="text-sm text-gray-500">Chưa có sim nào.</div>;
  }

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full divide-y">
        <thead className="bg-slate-100 text-sm">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Số sim</th>
            <th className="px-3 py-2 text-left">Nhà mạng</th>
            <th className="px-3 py-2 text-left">Loại</th>
            <th className="px-3 py-2 text-left">Giá</th>
            <th className="px-3 py-2 text-left">Tags</th>
            <th className="px-3 py-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {sims.map((s, idx) => (
            <tr key={s.id} className="even:bg-white odd:bg-slate-50">
              <td className="px-3 py-2">{idx + 1}</td>
              <td className="px-3 py-2 font-medium">{s.number}</td>
              <td className="px-3 py-2">{s.carrier || "-"}</td>
              <td className="px-3 py-2">{s.type || "-"}</td>
              <td className="px-3 py-2">{s.price ? Number(s.price).toLocaleString("vi-VN") + "đ" : "-"}</td>
              <td className="px-3 py-2">{s.tags || "-"}</td>
              <td className="px-3 py-2">
                <button
                  className="mr-2 px-2 py-1 text-xs rounded bg-yellow-100 hover:bg-yellow-200"
                  onClick={() => onEdit(s)}
                >
                  Sửa
                </button>
                <button
                  className="px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200"
                  onClick={() => onDelete(s.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
