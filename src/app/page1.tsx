"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";

interface Sim {
  id: string;
  so: string;
  gia: number;
  nhaMang: string;
  loaiSim: string;
}

// Hàm bỏ dấu tiếng Việt để so sánh loại sim
function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export default function Home() {
  const [sims, setSims] = useState<Sim[]>([]);
  const [keyword, setKeyword] = useState("");
  const [nhaMang, setNhaMang] = useState("");
  const [gia, setGia] = useState("");
  const [loaiSim, setLoaiSim] = useState("");
  const [selectedSim, setSelectedSim] = useState<Sim | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zalo, setZalo] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sendRequest = async (endpoint: string) => {
    // ✅ Kiểm tra nhập bắt buộc
    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Vui lòng nhập họ tên và số điện thoại!");
      return;
    }

    setErrorMsg("");
    setSending(true);

    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simId: selectedSim?.so,
          name,
          phone,
          zalo,
        }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("Có lỗi xảy ra, thử lại sau.");
    }

    setSending(false);
  };



  const handleHold = async () => {
    if (!selectedSim) return;
    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Vui lòng nhập Họ tên và Số điện thoại.");
      return;
    }

    try {
      setSending(true);
      setErrorMsg(null);

      const res = await fetch("/api/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simId: selectedSim.so,
          name,
          phone,
          zalo,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setSelectedSim(null);
      setName("");
      setPhone("");
      setZalo("");
      alert("✅ Đã gửi yêu cầu giữ số. Chúng tôi sẽ liên hệ sớm!");
    } catch (e) {
      console.error(e);
      setErrorMsg("Không gửi được yêu cầu, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };


  // Pagination normal sims
  const [currentPage, setCurrentPage] = useState(1);
  const simsPerPage = 30;

  // Pagination high-end sims
  const [currentHighEndPage, setCurrentHighEndPage] = useState(1);
  const highEndPerPage = 6; // 2 hàng x 3 cột

  useEffect(() => {
    const fetchSims = async () => {
      const res = await fetch("/api/sims?page=1&limit=19999");
      const data = await res.json();
      setSims(data.sims || []);  // ✅ lấy mảng sims
    };
    fetchSims();
  }, []);


  const filtered = sims.filter((sim) => {
    const matchKeyword = keyword ? sim.so.endsWith(keyword) : true;
    const matchNhaMang = nhaMang ? sim.nhaMang === nhaMang : true;
    const matchLoai = loaiSim ? sim.loaiSim === loaiSim : true;
    let matchGia = true;

    if (gia === "1") matchGia = sim.gia < 1_000_000;
    if (gia === "2") matchGia = sim.gia >= 1_000_000 && sim.gia <= 5_000_000;
    if (gia === "3") matchGia = sim.gia > 5_000_000 && sim.gia <= 10_000_000;
    if (gia === "4") matchGia = sim.gia > 10_000_000;

    return matchKeyword && matchNhaMang && matchLoai && matchGia;
  });

  // Tách riêng sim Thượng Lưu
  const highEndSims = filtered.filter(
    (sim) => removeVietnameseTones(sim.loaiSim || "") === "thuong luu"
  );
  const normalSims = filtered.filter(
    (sim) => removeVietnameseTones(sim.loaiSim || "") !== "thuong luu"
  );

  // Lấy trang hiện tại cho High-End
  const totalHighEndPages = Math.ceil(highEndSims.length / highEndPerPage);
  const currentHighEndSims = highEndSims.slice(
    (currentHighEndPage - 1) * highEndPerPage,
    currentHighEndPage * highEndPerPage
  );

  // Lấy trang hiện tại cho Normal Sims
  const totalPages = Math.ceil(normalSims.length / simsPerPage);
  const currentSims = normalSims.slice(
    (currentPage - 1) * simsPerPage,
    currentPage * simsPerPage
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📱 SimPro • Tìm Số Đẹp</h1>

      {/* Tìm kiếm */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="🔍 Tìm đuôi số (ví dụ: 888)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* Bộ lọc */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={nhaMang}
          onChange={(e) => setNhaMang(e.target.value)}
        >
          <option value="">📶 Nhà mạng</option>
          <option value="Viettel">Viettel</option>
          <option value="Vinaphone">Vinaphone</option>
          <option value="Mobifone">Mobifone</option>
          <option value="Vietnamobile">Vietnamobile</option>
        </select>

        <select
          className="border p-2 rounded"
          value={gia}
          onChange={(e) => setGia(e.target.value)}
        >
          <option value="">💰 Khoảng giá</option>
          <option value="1">Dưới 1 triệu</option>
          <option value="2">1–5 triệu</option>
          <option value="3">5–10 triệu</option>
          <option value="4">Trên 10 triệu</option>
        </select>

        <select
          className="border p-2 rounded"
          value={loaiSim}
          onChange={(e) => setLoaiSim(e.target.value)}
        >
          <option value="">🔮 Loại sim</option>
          <option value="Lộc phát">Lộc phát</option>
          <option value="Thần tài">Thần tài</option>
          <option value="Tam hoa">Tam hoa</option>
          <option value="Tứ quý">Tứ quý</option>
          <option value="Ngũ quý">Ngũ quý</option>
          <option value="Năm sinh">Năm sinh</option>
          <option value="Thượng Lưu">Thượng Lưu</option>
        </select>
      </div>

      {/* Sim Thượng Lưu */}
      {highEndSims.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-yellow-600">
            🌟 Sim Thượng Lưu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentHighEndSims.map((sim) => (
              <Card
                key={sim.id}
                className="relative shadow-lg hover:shadow-2xl transition rounded-2xl p-4 bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-300"
              >
                <div className="text-center mb-4">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-red-700 tracking-wider">
                    {sim.so}
                  </h2>
                </div>

                <div className="flex flex-col gap-2 text-left text-gray-800">
                  <p className="font-semibold">📶 {sim.nhaMang}</p>
                  <p className="font-medium">🔮 {sim.loaiSim}</p>
                  <p className="text-sm font-extrabold text-gray-600">
                    💰 Giá: {Number(sim.gia || 0).toLocaleString()} đ
                  </p>
                </div>

                <div className="absolute bottom-4 right-4">
                  <Button
                    size="sm"
                    className="rounded-full px-4 py-2 shadow-md bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => setSelectedSim(sim)}
                  >
                    Giữ số
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination High-End */}
          <div className="flex justify-center mt-4 gap-2">
            <Button
              size="sm"
              disabled={currentHighEndPage === 1}
              onClick={() => setCurrentHighEndPage((p) => p - 1)}
            >
              Prev
            </Button>
            {Array.from({ length: totalHighEndPages }, (_, i) => (
              <Button
                key={i}
                size="sm"
                variant={currentHighEndPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentHighEndPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              size="sm"
              disabled={currentHighEndPage === totalHighEndPages}
              onClick={() => setCurrentHighEndPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Danh sách sim thường */}
      <h2 className="text-2xl font-bold mb-4">📋 Sim Tổng Hợp</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentSims.map((sim) => (
          <Card
            key={sim.id}
            className="relative shadow-md hover:shadow-lg hover:border-blue-400 transition rounded-2xl p-4 bg-gray-70 border border-gray-300"
          >
            <div className="text-center mb-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-red-600 tracking-wider">
                {sim.so}
              </h2>
            </div>

            <div className="flex flex-col gap-2 text-left text-gray-700">
              <p className="font-semibold">📶 {sim.nhaMang}</p>
              <p className="font-medium">🔮 {sim.loaiSim}</p>
              <p className="text-sm font-extrabold text-gray-600">
                💰 Giá: {Number(sim.gia || 0).toLocaleString()} đ
              </p>
            </div>

            <div className="absolute bottom-4 right-4">
              <Button
                size="sm"
                className="rounded-full px-4 py-2 shadow-md bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => setSelectedSim(sim)}
              >
                Giữ số
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Normal Sims */}
      <div className="flex justify-center mt-6 gap-2">
        <Button
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            size="sm"
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* Dialog Giữ số */}
      <Dialog open={!!selectedSim} onOpenChange={() => setSelectedSim(null)}>
        {selectedSim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-1">
                Giữ số {selectedSim.so}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                📶 {selectedSim.nhaMang} • 🔮 {selectedSim.loaiSim} • 💰 {Number(selectedSim.gia || 0).toLocaleString()} đ
              </p>

              <div className="space-y-2">
                <Input
                  placeholder="Họ và tên *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="tel"
                  placeholder="Số điện thoại *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  placeholder="Zalo (tuỳ chọn)"
                  value={zalo}
                  onChange={(e) => setZalo(e.target.value)}
                />

                {errorMsg && (
                  <p className="text-sm text-red-600">{errorMsg}</p>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {/* Giữ số */}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={sending}
                  onClick={handleHold}
                >
                  {sending ? "Đang gửi..." : "Giữ số"}
                </Button>

                {/* Đặt cọc */}
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={sending}
                  onClick={() => sendRequest("deposit")}
                >
                  {sending ? "Đang gửi..." : "Đặt cọc"}
                </Button>

                {/* Thanh toán */}
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={sending}
                  onClick={() => sendRequest("pay")}
                >
                  {sending ? "Đang gửi..." : "Thanh toán"}
                </Button>

                {/* Hủy */}
                <Button
                  className="w-full bg-gray-400 hover:bg-gray-500 text-white"
                  disabled={sending}
                  onClick={() => setSelectedSim(null)}
                >
                  Hủy
                </Button>
              </div>


            </div>
          </div>
        )}
      </Dialog>

    </div>
  );
}
