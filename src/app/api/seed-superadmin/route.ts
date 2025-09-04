import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectToDB();
    const users = db.collection("users");

    // Xóa superadmin cũ (nếu có)
    await users.deleteOne({ username: "superadmin" });

    // Hash mật khẩu 123456
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Thêm superadmin mới
    await users.insertOne({
      username: "superadmin",
      password: hashedPassword,
      role: "superadmin",
    });

    return NextResponse.json({
      success: true,
      message: "Superadmin created with password 123456",
    });
  } catch (err) {
    console.error("❌ Error seeding superadmin:", err);
    return NextResponse.json({ success: false, message: "Error" });
  }
}
