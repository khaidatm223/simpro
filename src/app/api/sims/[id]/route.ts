import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDB();
    const data = await req.json();
    await db.collection("sims").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: data }
    );
    return NextResponse.json({ message: "Sim updated" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDB();
    await db.collection("sims").deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ message: "Sim deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
