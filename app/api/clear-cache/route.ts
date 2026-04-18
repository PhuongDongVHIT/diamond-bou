import { NextResponse } from "next/server";

export async function POST() {
  try {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!upstashUrl || !upstashToken) {
      return NextResponse.json({ success: false, error: "Chưa cấu hình Upstash Redis" }, { status: 500 });
    }

    const response = await fetch(`${upstashUrl}/flushdb`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${upstashToken}`
      }
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Đã xóa toàn bộ cache Upstash thành công!" });
    } else {
      const errorData = await response.json();
      return NextResponse.json({ success: false, error: errorData }, { status: 400 });
    }
  } catch (error) {
    console.error("Lỗi khi xóa cache:", error);
    return NextResponse.json({ success: false, error: "Lỗi nội bộ khi xóa cache" }, { status: 500 });
  }
}
