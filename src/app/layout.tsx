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
      <head>
        {/* PWA config */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="bg-slate-50 min-h-screen">
        <header className="bg-white shadow sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="font-bold text-lg">SimPro • Tìm Số Đẹp</h1>
            <span className="text-sm font-bold text-xl text-green-600">
              📞:098.6666.178
            </span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>

        <footer className="border-t mt-8 bg-white/70">
          <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-600 flex justify-between">
            <span>© {new Date().getFullYear()} SimPro. </span>
            <span>Hỗ trợ: 098.6666.178</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
