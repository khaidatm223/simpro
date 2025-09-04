import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { username, newPassword } = await req.json();

    if (!username || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Thiếu username hoặc mật khẩu mới" },
        { status: 400 }
      );
    }

    const db = await connectToDB();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await db.collection("users").updateOne(
      { username },
      { $set: { password: hashedPassword } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Đã reset mật khẩu!" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
