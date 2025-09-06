import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const db = await connectToDB();
    const user = await db.collection("users").findOne({ username, role: "superadmin" });

    if (!user) {
      return NextResponse.json({ success: false, message: "User không tồn tại" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ success: false, message: "Sai mật khẩu" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("superadminAuth", "true", { httpOnly: true, path: "/" });
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, message: "Lỗi server" }, { status: 500 });
  }
}
