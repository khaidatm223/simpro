"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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

  // Dialog trạng thái
  const [openForm, setOpenForm] = useState(false);
  const [editingSim, setEditingSim] = useState<Sim | null>(null);

  // Form fields
  const [so, setSo] = useState("");
  const [gia, setGia] = useState(0);
  const [nhaMang, setNhaMang] = useState("");
  const [loaiSim, setLoaiSim] = useState("");
  const [tags, setTags] = useState("");

  // Lấy danh sách sim
  const fetchSims = async () => {
    setLoading(true);
    const res = await fetch("/api/sims");
    const data = await res.json();
    setSims(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSims();
  }, []);

  // Thêm / Sửa sim
  const handleSubmit = async () => {
    const simData = {
      so,
      gia,
      nhaMang,
      loaiSim,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (editingSim) {
      // Sửa
      await fetch(`/api/sims/${editingSim._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simData),
      });
    } else {
      // Thêm
      await fetch("/api/sims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simData),
      });
    }

    setOpenForm(false);
    setEditingSim(null);
    setSo("");
    setGia(0);
    setNhaMang("");
    setLoaiSim("");
    setTags("");
    fetchSims();
  };

  // Xóa sim
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sim này không?")) return;
    await fetch(`/api/sims/${id}`, { method: "DELETE" });
    fetchSims();
  };

  // Mở form để sửa
  const handleEdit = (sim: Sim) => {
    setEditingSim(sim);
    setSo(sim.so);
    setGia(sim.gia);
    setNhaMang(sim.nhaMang);
    setLoaiSim(sim.loaiSim);
    setTags(sim.tags?.join(",") || "");
    setOpenForm(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin • Quản trị Sim</h1>
      <Button className="mb-4" onClick={() => setOpenForm(true)}>
        Thêm Sim
      </Button>

      {loading ? (
        <p>Đang tải danh sách sim...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
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
      )}

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
