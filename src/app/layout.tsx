import "./globals.css";
import { ReactNode } from "react";
import HeaderWrapper from "@/components/HeaderWrapper";

export const metadata = {
  title: "SimPro",
  description: "Demo Web App tìm sim số đẹp",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-slate-50 min-h-screen">
        <HeaderWrapper />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
