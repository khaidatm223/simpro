// src/app/api/seed-ctv-admin/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    // Kết nối MongoDB
    await connectToDB();

    // Thông tin admin CTV
    const username = "admin";  // hoặc đổi thành tên khác
    const password = "123456";
    const role = "admin";

    // Kiểm tra xem admin đã tồn tại chưa
    const existing = await User.findOne({ username });
    if (!existing) {
      // Hash password
      const hashed = await bcrypt.hash(password, 10);

      // Tạo user mới bằng cách new + save
      const user = new User({ username, password: hashed, role });
      await user.save();
    }

    return NextResponse.json({ success: true, message: "CTV admin created" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to seed CTV admin" });
  }
}
