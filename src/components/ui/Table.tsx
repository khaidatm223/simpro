"use client";
import React from "react";

interface TableProps {
  data: any[];
}

export function Table({ data }: TableProps) {
  if (!data.length) return <div>Chưa có dữ liệu.</div>;
  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-slate-300 w-full">
        <thead>
          <tr className="bg-slate-100">
            {headers.map((h) => (
              <th key={h} className="border border-slate-300 px-2 py-1 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50">
              {headers.map((h) => (
                <td key={h} className="border border-slate-300 px-2 py-1">
                  {row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
