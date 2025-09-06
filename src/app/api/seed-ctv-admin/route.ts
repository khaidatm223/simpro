// src/app/api/seed-ctv-admin/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDB();

    const username = "admin";  // hoặc tên riêng cho từng CTV nếu bạn muốn
    const password = "123456";
    const role = "admin";

    const existing = await User.findOne({ username });
    if (!existing) {
      const hashed = await bcrypt.hash(password, 10);
      await User.create({ username, password: hashed, role });
    }

    return NextResponse.json({ success: true, message: "CTV admin created" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to seed CTV admin" });
  }
}
