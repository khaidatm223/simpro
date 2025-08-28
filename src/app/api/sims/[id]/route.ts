import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Sim from "@/models/Sim";

// GET /api/sims/[id]
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 👈 Next.js 15 yêu cầu async
  await dbConnect();
  const sim = await Sim.findById(id);
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
  await dbConnect();
  const sim = await Sim.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(sim);
}

// DELETE /api/sims/[id]
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await dbConnect();
  await Sim.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
