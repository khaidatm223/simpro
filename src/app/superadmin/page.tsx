"use client";

import { useState, useEffect } from "react";

export default function SuperadminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [newPasswords, setNewPasswords] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch("/api/auth/check-superadmin")
      .then((res) => {
        if (res.ok) {
          setIsAuth(true);
          return fetch("/api/superadmin/users");
        } else {
          window.location.href = "/superadmin/login";
        }
      })
      .then((res) => res?.json())
      .then((data) => setUsers(data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Đang tải...</p>;
  if (!isAuth) return null;

  const handleReset = async (username: string) => {
    const newPassword = newPasswords[username];
    if (!newPassword) {
      alert("Bạn phải nhập mật khẩu mới!");
      return;
    }
    const res = await fetch("/api/superadmin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, newPassword }),
    });
    const data = await res.json();
    alert(data.message);
    if (data.success) {
      setNewPasswords({ ...newPasswords, [username]: "" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Superadmin Dashboard</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Username</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Đặt mật khẩu mới</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2">
                <input
                  type="password"
                  value={newPasswords[u.username] || ""}
                  onChange={(e) =>
                    setNewPasswords({ ...newPasswords, [u.username]: e.target.value })
                  }
                  className="border rounded px-2 py-1"
                  placeholder="Mật khẩu mới"
                />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleReset(u.username)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Reset
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <button
          onClick={async () => {
            await fetch("/api/auth/superadmin-logout");
            window.location.href = "/superadmin/login";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
