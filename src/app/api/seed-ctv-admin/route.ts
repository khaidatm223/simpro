import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { Model } from "mongoose";
import { IUser } from "@/types/user"; // giả sử bạn có interface IUser

export async function GET() {
  try {
    await connectToDB();

    const username = "admin";
    const password = "123456";
    const role = "admin";

    // Ép kiểu User để TypeScript hiểu findOne là callable
    const UserModel = User as unknown as Model<IUser>;

    const existing = await UserModel.findOne({ username });
    if (!existing) {
      const hashed = await bcrypt.hash(password, 10);
      const user = new UserModel({ username, password: hashed, role });
      await user.save();
    }

    return NextResponse.json({ success: true, message: "CTV admin created" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to seed CTV admin" });
  }
}
