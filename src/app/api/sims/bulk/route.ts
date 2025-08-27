import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const db = await connectToDB();
    const { sims } = await req.json();

    if (!Array.isArray(sims) || sims.length === 0) {
      return NextResponse.json({ error: "No sims provided" }, { status: 400 });
    }

    // Chuẩn hóa dữ liệu
    const docs = sims.map((sim) => ({
      so: sim.so,
      gia: Number(sim.gia) || 0,
      nhaMang: sim.nhaMang || "",
      loaiSim: sim.loaiSim || "",
      tags: sim.tags || [],
    }));

    const result = await db.collection("sims").insertMany(docs);
    return NextResponse.json({
      message: "Bulk insert success",
      insertedCount: result.insertedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
