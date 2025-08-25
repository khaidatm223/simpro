// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Web App Tìm Sim Số Đẹp",
  description: "Demo Web App tìm sim số đẹp",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-slate-50 min-h-screen">
        <header className="bg-white shadow sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="font-bold text-lg">SimPro • Tìm Sim Số Đẹp</h1>
            <span className="text-sm text-gray-500">Demo Web-App</span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="border-t mt-8 bg-white/70">
          <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-600 flex justify-between">
            <span>© {new Date().getFullYear()} SimPro. Demo chỉ tư vấn.</span>
            <span>Hỗ trợ: 09xx.xxx.xxx</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
