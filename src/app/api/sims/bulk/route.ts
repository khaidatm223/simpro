import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const db = await connectToDB();
    const { sims } = await req.json();

    if (!Array.isArray(sims)) {
      return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
    }

    // Đảm bảo tất cả sim đều có owner
    const simsWithOwner = sims.map(sim => ({
      ...sim,
      owner: sim.owner || "unknown", // 👈 giữ lại owner đã gửi từ FE
    }));

    const result = await db.collection("sims").insertMany(simsWithOwner);

    return NextResponse.json({
      success: true,
      insertedCount: result.insertedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
