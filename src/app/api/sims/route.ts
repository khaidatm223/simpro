// src/app/api/sims/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

// giả sử bạn có cách lấy username + role hiện tại
function getUsername(req: Request) {
  return req.headers.get("x-username") || "unknown";
}
function getRole(req: Request) {
  return req.headers.get("x-role") || "admin";
}
function isSuper(req: Request) {
  return getRole(req) === "superadmin";
}

// GET sims
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

    const owner = searchParams.get("owner") || "";
    if (owner) query.owner = owner;

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

// 👇 Thêm API POST để tạo sim mới/currentUser.username
export async function POST(req: Request) {
  try {
    const db = await connectToDB();
    const body = await req.json();

    // Nếu body là 1 sim hoặc mảng sim
    const sims = Array.isArray(body) ? body : [body];

    // Bổ sung check: nếu thiếu owner thì gán "unknown"
    const username = getUsername(req);

    const simsWithOwner = sims.map((sim) => ({
      ...sim,
      owner: currentUser || "unknown",
    }));


    const result = await db.collection("sims").insertMany(simsWithOwner);

    return NextResponse.json({
      success: true,
      insertedCount: result.insertedCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}


// PUT cập nhật sim
export async function PUT(req: Request) {
  try {
    const db = await connectToDB();
    const body = await req.json(); // body phải có _id + các field muốn update

    const { _id, ...updateData } = body;
    if (!_id) return NextResponse.json({ success: false, message: "_id missing" }, { status: 400 });

    const filter: any = { _id: new (require("mongodb").ObjectId)(_id) };
    if (!isSuper(req)) filter.owner = getUsername(req);

    const result = await db.collection("sims").updateOne(filter, { $set: updateData });
    return NextResponse.json({ success: result.modifiedCount > 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE sim
export async function DELETE(req: Request) {
  try {
    const db = await connectToDB();
    const { ids } = await req.json(); // bulk xóa

    const filter: any = {};
    if (ids && ids.length > 0) filter._id = { $in: ids.map((id: string) => new (require("mongodb").ObjectId)(id)) };
    if (!isSuper(req)) filter.owner = getUsername(req);

    const result = await db.collection("sims").deleteMany(filter);
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
