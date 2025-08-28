import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Sim from "@/models/Sim";

interface Params {
  params: { id: string };
}

// Lấy 1 sim
export async function GET(_req: Request, { params }: Params) {
  await dbConnect();
  const sim = await Sim.findById(params.id);
  return NextResponse.json(sim);
}

// Cập nhật 1 sim
export async function PUT(req: Request, { params }: Params) {
  await dbConnect();
  const body = await req.json();
  const updated = await Sim.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}

// Xóa 1 sim
export async function DELETE(_req: Request, { params }: Params) {
  await dbConnect();
  await Sim.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
