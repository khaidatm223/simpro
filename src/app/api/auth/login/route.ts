import { NextResponse } from "next/server";
import { AuthStore } from "@/lib/authStore";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === AuthStore.username && password === AuthStore.password) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("adminAuth", "true", { httpOnly: true, path: "/" });
    return res;
  }

  return NextResponse.json(
    { success: false, message: "Sai tài khoản hoặc mật khẩu!" },
    { status: 401 }
  );
}
