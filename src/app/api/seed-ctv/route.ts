import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const db = await connectToDB();
    const { username } = await req.json();
    if (!username) return NextResponse.json({ success: false, message: "username missing" }, { status: 400 });

    const hashedPassword = await bcrypt.hash("123456", 10);
    const exists = await db.collection("users").findOne({ username });
    if (exists) return NextResponse.json({ success: false, message: "CTV đã tồn tại" });

    await db.collection("users").insertOne({
      username,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, message: "CTV created with password 123456" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
