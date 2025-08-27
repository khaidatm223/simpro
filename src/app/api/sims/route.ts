// src/app/api/sims/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const db = await connectToDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const nhaMang = searchParams.get("nhaMang") || "";
    const loaiSim = searchParams.get("loaiSim") || "";

    const query: any = {};
    if (search) query.so = { $regex: search, $options: "i" };
    if (nhaMang) query.nhaMang = nhaMang;
    if (loaiSim) query.loaiSim = loaiSim;

    const total = await db.collection("sims").countDocuments(query);
    const sims = await db
      .collection("sims")
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      sims,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
