"use client";

import { useState } from "react";
import Modal from "./ui/modal";

interface Sim {
  id: number;
  number: string;
  carrier: string;
  price: number;
  type: string;
}

interface SimCardProps {
  sim: Sim;
  onSaveCustomer: (sim: Sim, customer: { name: string; phone: string; zalo?: string }) => void;
}

export default function SimCard({ sim, onSaveCustomer }: SimCardProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zalo, setZalo] = useState("");

  const handleSubmit = () => {
    if (!name || !phone) {
      alert("Vui lòng nhập đầy đủ Tên và SĐT");
      return;
    }
    onSaveCustomer(sim, { name, phone, zalo });
    setOpen(false);
    setName(""); setPhone(""); setZalo("");
    alert(`Đã giữ số ${sim.number} thành công!`);
  };

  return (
    <>
      <div className="border rounded p-4 bg-white shadow">
        <h2 className="text-lg font-bold">{sim.number}</h2>
        <p>Nhà mạng: {sim.carrier}</p>
        <p>Loại sim: {sim.type}</p>
        <p>Giá: {sim.price.toLocaleString("vi-VN")}đ</p>
        <button
          className="mt-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => setOpen(true)}
        >
          Giữ số
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Giữ số ${sim.number}`}>
        <div className="flex flex-col gap-2">
          <input
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            placeholder="Zalo (tùy chọn)"
            value={zalo}
            onChange={(e) => setZalo(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSubmit}
          >
            Xác nhận giữ số
          </button>
        </div>
      </Modal>
    </>
  );
}
