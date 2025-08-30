"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Nếu là trang admin thì không render Header
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Header />;
}
