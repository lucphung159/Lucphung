import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import { Content } from "@/lib/models/Content";
import { verifyToken } from "@/lib/jwt";
import { getDefaultPublicationSections, needsPublicationSeed } from "@/lib/publicationData";

export async function GET() {
  await connectDB();
  let found = await Content.findOne({ type: "page_content" }).lean() as Record<string, unknown> | null;
  if (found && needsPublicationSeed(found.publicationSections)) {
    found = await Content.findOneAndUpdate(
      { type: "page_content" },
      { $set: { publicationSections: getDefaultPublicationSections() } },
      { new: true }
    ).lean() as Record<string, unknown> | null;
  }
  if (found) return NextResponse.json(found);
  const created = await Content.create({
    type: "page_content",
    publicationSections: getDefaultPublicationSections(),
  });
  return NextResponse.json(created.toObject());
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
