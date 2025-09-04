import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const db = await connectToDB();
    const users = db.collection("users");

    // tìm user role = superadmin
    const user = await users.findOne({ username, role: "superadmin" });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Superadmin không tồn tại" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Sai mật khẩu" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true, message: "Đăng nhập thành công" });
    res.cookies.set("superadminAuth", "true", { httpOnly: true, path: "/" });

    return res;
  } catch (err) {
    console.error("❌ Error superadmin login:", err);
    return NextResponse.json({ success: false, message: "Lỗi server" }, { status: 500 });
  }
}
