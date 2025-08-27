import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Lấy chi tiết sim theo ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDB();
    const sim = await db.collection("sims").findOne({ _id: new ObjectId(params.id) });
    return NextResponse.json(sim);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Cập nhật sim
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDB();
    const body = await req.json();
    await db.collection("sims").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    );
    return NextResponse.json({ message: "Updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Xóa sim
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDB();
    await db.collection("sims").deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
