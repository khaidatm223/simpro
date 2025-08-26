import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // <- phải await
  const client = await clientPromise;
  const db = await clientPromise();  // ✅ trực tiếp lấy Db;
  const sim = await db.collection("sims").findOne({ _id: new ObjectId(id) });

  return NextResponse.json(sim);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // <- phải await
  const body = await req.json();
  const client = await clientPromise;
  const db = await clientPromise();  // ✅ trực tiếp lấy Db;
  await db.collection("sims").updateOne(
    { _id: new ObjectId(id) },
    { $set: body }
  );

  return NextResponse.json({ message: "Updated successfully" });
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // <- phải await
  const client = await clientPromise;
  const db = await clientPromise();  // ✅ trực tiếp lấy Db;
  await db.collection("sims").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Deleted successfully" });
}
