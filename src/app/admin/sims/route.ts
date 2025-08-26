import clientPromise from "@/lib/mongodb";  // ✅ import mặc định

export async function GET() {
  try {
    const client = await clientPromise;
    const db = await clientPromise();  // ✅ db trực tiếp từ clientPromise
    const sims = await db.collection("sims").find({}).toArray();

    return Response.json(sims);
  } catch (error) {
    return Response.json({ error: "Failed to fetch sims" }, { status: 500 });
  }
}
