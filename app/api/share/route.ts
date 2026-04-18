import { NextRequest, NextResponse } from "next/server";
import { incrementShare, getStats } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  const { slug, platform } = await req.json();

  if (!slug || !platform) {
    return NextResponse.json({ success: false, error: "Missing slug or platform" }, { status: 400 });
  }

  const count = incrementShare(slug, platform);

  return NextResponse.json({
    success: true,
    platform: platform,
    shares: count,
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ success: false, error: "Missing slug" }, { status: 400 });
  }
  
  const stats = getStats(slug);

  return NextResponse.json({
    success: true,
    fbShares: stats.fbShares,
    tiktokShares: stats.tiktokShares,
  });
}
