import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

// GET /api/admin/sims
export async function GET() {
  const { simsCollection } = await connectToDB();
  const sims = await simsCollection.find().sort({ so: 1 }).toArray();
  return NextResponse.json(sims);
}

// POST /api/admin/sims
export async function POST(req: NextRequest) {
  const { so, gia, nhaMang, loaiSim, tags } = await req.json();
  if (!so || !gia || !nhaMang || !loaiSim) {
    return NextResponse.json({ error: "Thiếu thông tin sim" }, { status: 400 });
  }

  const { simsCollection } = await connectToDB();
  const exists = await simsCollection.findOne({ so });
  if (exists) return NextResponse.json({ error: "Sim đã tồn tại" }, { status: 400 });

  const result = await simsCollection.insertOne({ so, gia, nhaMang, loaiSim, tags: tags || [] });
  return NextResponse.json(result);
}

// PUT /api/admin/sims/:id
export async function PUT(req: NextRequest) {
  const { id } = req.nextUrl.searchParams;
  const data = await req.json();
  const { simsCollection } = await connectToDB();

  const result = await simsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
  return NextResponse.json(result);
}

// DELETE /api/admin/sims/:id
export async function DELETE(req: NextRequest) {
  const { id } = req.nextUrl.searchParams;
  const { simsCollection } = await connectToDB();

  const result = await simsCollection.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json(result);
}
