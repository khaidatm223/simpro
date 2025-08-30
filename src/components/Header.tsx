"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Home } from "lucide-react"; // icon ngôi nhà

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-4 font-bold text-lg text-gray-800">
          {/* Logo SimPro + Home icon */}
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 hover:text-blue-600 transition font-bold text-lg text-gray-800"
          >
            <Home className="w-5 h-5" />
            <span>SimPro</span>
          </button>

          {/* Dropdown Hướng dẫn */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="font-bold text-lg text-gray-700 hover:text-blue-600"
            >
              Hướng Dẫn
            </button>

            {open && (
              <div className="absolute left-0 mt-2 w-60 bg-white border rounded-lg shadow-lg z-50">
                <ul className="text-sm text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <Link href="/huong-dan/dang-ky-sim">
                      📑 Hướng dẫn đăng ký sim
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    🔍 Hướng dẫn kiểm tra thông tin sim
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    🖼️ Hướng dẫn bằng hình ảnh
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    ✍️ Bài viết chi tiết
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Hotline */}
        <a
          href="tel:0986666178"
          className="text-ms font-bold text-green-600 hover:text-green-700 transition"
        >
          📞 098.6666.178
        </a>
      </div>
    </header>
  );
}
