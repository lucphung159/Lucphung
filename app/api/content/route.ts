import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Content } from "@/lib/models/Content";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  await connectDB();
  let content = await Content.findOne({ type: "page_content" }).lean();
  if (!content) {
    content = await Content.create({ type: "page_content" });
    content = content.toObject();
  }
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  const updated = await Content.findOneAndUpdate(
    { type: "page_content" },
    { $set: body },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  return NextResponse.json(updated);
}
