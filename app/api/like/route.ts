import { NextRequest, NextResponse } from "next/server";
import { incrementLike } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json({ success: false, error: "Missing slug" }, { status: 400 });
  }

  const count = incrementLike(slug);

  return NextResponse.json({
    success: true,
    likes: count,
  });
}
