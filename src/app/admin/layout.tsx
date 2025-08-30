import { ReactNode } from "react";

export const metadata = {
  title: "Admin Panel",
  description: "Quản trị hệ thống SimPro",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-100 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
