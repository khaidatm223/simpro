"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // kiểm tra cookie có tồn tại không (gọi thử API)
    const checkAuth = async () => {
      const res = await fetch("/api/sims"); // gọi thử API cần auth
      if (res.status === 401) {
        router.push("/login");
      } else {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleChangePassword = async () => {
    const oldPass = prompt("Nhập mật khẩu cũ:");
    const newPass = prompt("Nhập mật khẩu mới:");
    if (!oldPass || !newPass) return;

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
    });

    const data = await res.json();
    alert(data.message);
  };

  if (isChecking) return <p className="p-6">Đang kiểm tra đăng nhập...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">Trang Quản Trị</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleChangePassword}>
            🔑 Đổi mật khẩu
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            🚪 Đăng xuất
          </Button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
