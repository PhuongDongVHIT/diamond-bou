import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  
  if (!appId || !appSecret) {
    console.error("Missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET in .env.local");
    return NextResponse.json({ success: false, shares: 0 }, { status: 500 });
  }

  const accessToken = `${appId}|${appSecret}`;
  const fbEndpoint = `https://graph.facebook.com/v19.0/?id=${encodeURIComponent(url)}&fields=engagement&access_token=${accessToken}`;

  try {
    const res = await fetch(fbEndpoint, {
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
      throw new Error(`Facebook API Error: ${res.statusText}`);
    }

    const data = await res.json();
    
    return NextResponse.json({
      success: true,
      shares: data.engagement?.share_count || 0,
      comments: data.engagement?.comment_count || 0,
      reactions: data.engagement?.reaction_count || 0,
    });
  } catch (error) {
    console.error("Error fetching Facebook share count:", error);
    return NextResponse.json({ success: false, shares: 0 }, { status: 500 });
  }
}
