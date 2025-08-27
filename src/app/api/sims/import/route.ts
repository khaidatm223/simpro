import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const db = await connectToDB();
    const sims = await req.json(); // nhận mảng sim từ client

    if (!Array.isArray(sims)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await db.collection("sims").insertMany(sims);
    return NextResponse.json({ message: "Imported successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
