import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/sims/[id]
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = await connectToDB();
  const sim = await db.collection("sims").findOne({ _id: new ObjectId(id) });

  if (!sim) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(sim);
}

// PUT /api/sims/[id]
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const db = await connectToDB();
  await db
    .collection("sims")
    .updateOne({ _id: new ObjectId(id) }, { $set: body });

  const updated = await db.collection("sims").findOne({ _id: new ObjectId(id) });
  return NextResponse.json(updated);
}

// DELETE /api/sims/[id]
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = await connectToDB();
  await db.collection("sims").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Deleted" });
}
