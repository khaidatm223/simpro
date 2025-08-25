import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectToDB();
    const sims = await db.collection("sims").find({}).toArray();
    return NextResponse.json(sims);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await connectToDB();
    const data = await req.json();
    await db.collection("sims").insertOne(data);
    return NextResponse.json({ message: "Sim added" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
