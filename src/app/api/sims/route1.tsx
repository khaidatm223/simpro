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

// 👇 Thêm API POST để tạo sim mới
export async function POST(req: Request) {
  try {
    const db = await connectToDB();
    const body = await req.json();

    // body: { so, gia, nhaMang, loaiSim, tags }
    const result = await db.collection("sims").insertOne(body);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
export async function DELETE() {
  try {
    const db = await connectToDB();
    await db.collection("sims").deleteMany({}); // xóa toàn bộ sims
    return NextResponse.json({ message: "Đã xóa tất cả sim" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
