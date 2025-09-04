"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import * as XLSX from "xlsx";



interface Sim {
  _id: string;
  so: string;
  gia: number;
  nhaMang: string;
  loaiSim: string;
  tags?: string[];
}

export default function AdminPage() {
  const [sims, setSims] = useState<Sim[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination & filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSims, setTotalSims] = useState(0);
  const [search, setSearch] = useState("");
  const [nhaMangFilter, setNhaMangFilter] = useState("");
  const [loaiSimFilter, setLoaiSimFilter] = useState("");

  // Dialog
  const [openForm, setOpenForm] = useState(false);
  const [editingSim, setEditingSim] = useState<Sim | null>(null);

  // Form fields
  const [so, setSo] = useState("");
  const [gia, setGia] = useState(0);
  const [nhaMang, setNhaMang] = useState("");
  const [loaiSim, setLoaiSim] = useState("");
  const [tags, setTags] = useState("");

  // Checkbox chọn nhiều
  const [selectedSimIds, setSelectedSimIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchSims = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      nhaMang: nhaMangFilter,
      loaiSim: loaiSimFilter,
    });
    const res = await fetch(`/api/sims?${params}`);
    const data = await res.json();
    setSims(data.sims || []);
    setTotalPages(data.totalPages || 1);
    setTotalSims(data.total || 0);
    setLoading(false);
  
  };

  useEffect(() => {
    fetchSims();
  }, [page, limit, search, nhaMangFilter, loaiSimFilter]);

  // Thêm / Sửa sim
  const handleSubmit = async () => {
    const simData = {
      so,
      gia,
      nhaMang,
      loaiSim,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingSim) {
        await fetch(`/api/sims/${editingSim._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(simData),
        });
      } else {
        await fetch("/api/sims", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(simData),
        });
      }

      setOpenForm(false);
      setEditingSim(null);
      setSo(""); setGia(0); setNhaMang(""); setLoaiSim(""); setTags("");
      fetchSims();
    } catch (err) {
      console.error("Error saving sim:", err);
    }
  };

  // Xóa 1 sim
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sim này không?")) return;
    await fetch(`/api/sims/${id}`, { method: "DELETE" });
    fetchSims();
  };

  // Xóa nhiều sim
  const handleDeleteSelected = async () => {
    if (selectedSimIds.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${selectedSimIds.length} sim đã chọn không?`)) return;

    await fetch("/api/sims/delete-many", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedSimIds }),
    });

    setSelectedSimIds([]);
    setSelectAll(false);
    fetchSims();
  };

  // Xóa tất cả
  const handleDeleteAll = async () => {
    if (!confirm("Bạn có chắc muốn xóa tất cả sim không?")) return;
    await fetch("/api/sims/delete-many", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: sims.map((s) => s._id) }),
    });
    setSelectedSimIds([]);
    setSelectAll(false);
    fetchSims();
  };

  // Checkbox
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedSimIds([]);
    } else {
      setSelectedSimIds(sims.map((s) => s._id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelect = (id: string) => {
    if (selectedSimIds.includes(id)) {
      setSelectedSimIds(selectedSimIds.filter((i) => i !== id));
    } else {
      setSelectedSimIds([...selectedSimIds, id]);
    }
  };

  // Sửa
  const handleEdit = (sim: Sim) => {
    setEditingSim(sim);
    setSo(sim.so); setGia(sim.gia); setNhaMang(sim.nhaMang);
    setLoaiSim(sim.loaiSim); setTags(sim.tags?.join(",") || "");
    setOpenForm(true);
  };

  // Upload Excel
  const handleUploadExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    const simsToImport = rows.map((row) => ({
      so: String(row.so || "").trim(),
      gia: Number(row.gia) || 0,
      nhaMang: row.nhaMang || "",
      loaiSim: row.loaiSim || "",
      tags: row.tags ? String(row.tags).split(",").map((t) => t.trim()) : [],
    }));

    const res = await fetch("/api/sims/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sims: simsToImport }),
    });

    const result = await res.json();
    alert(`Đã import thành công ${result.insertedCount || 0} sim`);
    fetchSims();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin • Quản trị Sim</h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input placeholder="Tìm số" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Input placeholder="Nhà mạng" value={nhaMangFilter} onChange={(e) => setNhaMangFilter(e.target.value)} />
        <Input placeholder="Loại sim" value={loaiSimFilter} onChange={(e) => setLoaiSimFilter(e.target.value)} />
        <Button onClick={() => setPage(1)} className="sm:w-auto w-full">Lọc</Button>
      </div>


      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Button
          onClick={() => {
            setEditingSim(null);
            setSo(""); setGia(0); setNhaMang(""); setLoaiSim(""); setTags("");
            setOpenForm(true);
          }}
          className="sm:w-auto w-full"
        >
          ➕ Thêm Sim
        </Button>

        <Button variant="destructive" onClick={handleDeleteSelected} className="sm:w-auto w-full">
          🗑️ Xóa nhiều
        </Button>

        <Button
          variant="destructive"
          onClick={async () => {
            if (confirm("Bạn có chắc chắn muốn xóa TẤT CẢ sim không?")) {
              await fetch("/api/sims", { method: "DELETE" });
              fetchSims();
            }
          }}
          className="sm:w-auto w-full"
        >
          🚨 Xóa tất cả
        </Button>

        <label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleUploadExcel}
            className="hidden"
          />
          <Button asChild>
            <span>📂 Import Excel</span>
          </Button>
        </label>

      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Danh sách Sim</h2>
            <span className="text-gray-600">Tổng cộng: {totalSims} sim</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">
                    <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                  </th>
                  <th className="border px-4 py-2">Số Sim</th>
                  <th className="border px-4 py-2">Giá</th>
                  <th className="border px-4 py-2">Nhà Mạng</th>
                  <th className="border px-4 py-2">Loại Sim</th>
                  <th className="border px-4 py-2">Tags</th>
                  <th className="border px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sims.map((sim) => (
                  <tr key={sim._id}>
                    <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedSimIds.includes(sim._id)}
                        onChange={() => toggleSelect(sim._id)}
                      />
                    </td>
                    <td className="border px-4 py-2">{sim.so}</td>
                    <td className="border px-4 py-2">{Number(sim.gia).toLocaleString()} đ</td>
                    <td className="border px-4 py-2">{sim.nhaMang}</td>
                    <td className="border px-4 py-2">{sim.loaiSim}</td>
                    <td className="border px-4 py-2">{sim.tags?.join(", ")}</td>
                    <td className="border px-4 py-2 flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(sim)}>Sửa</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(sim._id)}>Xóa</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
        <span>Trang {page} / {totalPages}</span>
        <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
      </div>

      {/* Dialog Thêm/Sửa */}
      <Dialog open={openForm} onOpenChange={() => setOpenForm(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingSim ? `Sửa Sim ${editingSim.so}` : "Thêm Sim"}
            </h2>
            <Input placeholder="Số sim" value={so} onChange={(e) => setSo(e.target.value)} className="mb-2"/>
            <Input placeholder="Giá" type="number" value={gia} onChange={(e) => setGia(Number(e.target.value))} className="mb-2"/>
            <Input placeholder="Nhà mạng" value={nhaMang} onChange={(e) => setNhaMang(e.target.value)} className="mb-2"/>
            <Input placeholder="Loại sim" value={loaiSim} onChange={(e) => setLoaiSim(e.target.value)} className="mb-2"/>
            <Input placeholder="Tags (ngăn cách bằng ,)" value={tags} onChange={(e) => setTags(e.target.value)} className="mb-2"/>
            <Button className="w-full mb-2" onClick={handleSubmit}>
              {editingSim ? "Cập nhật" : "Thêm"}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setOpenForm(false)}>Hủy</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
