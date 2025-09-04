import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";

export async function GET() {
  const db = await connectToDB();
  const users = await db.collection("users").find(
    {},
    { projection: { password: 0 } } // ẩn mật khẩu
  ).toArray();

  return NextResponse.json(users);
}
