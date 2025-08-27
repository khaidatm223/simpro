// src/app/api/sims/delete-many/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const db = await connectToDB();
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
    }

    // Chuyển tất cả id sang ObjectId
    const objectIds = ids.map((id: string) => new ObjectId(id));

    const result = await db.collection("sims").deleteMany({ _id: { $in: objectIds } });

    return NextResponse.json({ message: `Deleted ${result.deletedCount} sims` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
