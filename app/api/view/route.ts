import { NextRequest, NextResponse } from "next/server";
import { incrementView } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json({ success: false, error: "Missing slug" }, { status: 400 });
  }

  const count = incrementView(slug);

  return NextResponse.json({
    success: true,
    views: count,
  });
}
