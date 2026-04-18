import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ success: false, error: "Vui lòng cung cấp URL" }, { status: 400 });
  }

  // 1. Tự động nhận dạng nền tảng chứa link
  let platform = "unknown";
  if (targetUrl.includes("facebook.com") || targetUrl.includes("fb.watch") || targetUrl.includes("fb.com")) {
    platform = "facebook";
  } else if (targetUrl.includes("tiktok.com") || targetUrl.includes("vt.tiktok.com")) {
    platform = "tiktok";
  } else if (targetUrl.includes("youtube.com") || targetUrl.includes("youtu.be")) {
    platform = "youtube";
  }

  if (platform === "unknown") {
    return NextResponse.json({ success: false, error: "Chưa hỗ trợ nền tảng của URL này" }, { status: 400 });
  }

  try {
    // 2. Tùy theo nền tảng mà gọi API tương ứng
    let stats = { views: 0, likes: 0, shares: 0, comments: 0, saves: 0, platform };
    let isCachedSystem = false;

    if (platform === "facebook") {
      // ⚠️ ĐỂ KIỂM TRA ĐƯỢC FACEBOOK POST: 
      // Do Facebook bảo mật rất chặt, bạn BẮT BUỘC phải dùng API Token của App hoặc bên thứ 3.
      // Dưới đây là logic khi gọi thành công (Đang để tĩnh bằng 0 do chưa có Token).

      stats.views = 0;
      stats.likes = 0;
      stats.shares = 0;
      stats.comments = 0;
      stats.saves = 0;

    } else if (platform === "tiktok") {
      let finalUrl = targetUrl;

      // Nếu là dạng link rút gọn của TikTok, ta phải fetch thử để lấy link đích (chứa Video ID)
      if (targetUrl.includes("vt.tiktok.com") || targetUrl.includes("vm.tiktok.com")) {
        try {
          const resRedirect = await fetch(targetUrl, { method: 'HEAD', redirect: "follow" });
          finalUrl = resRedirect.url;
        } catch (e) {
          console.error("Lỗi khi giải mã link short TikTok:", e);
        }
      }

      let videoId = "";
      const match = finalUrl.match(/video\/(\d+)/);
      if (match) {
        videoId = match[1];
      }
      console.log("Resolved TikTok URL:", finalUrl, "-> ID:", videoId);

      if (videoId) {
        isCachedSystem = false;
        const cacheKey = `tiktok_stats_${videoId}`;
        const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
        const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (upstashUrl && upstashToken) {
          try {
            const cacheRes = await fetch(`${upstashUrl}/get/${cacheKey}`, {
              headers: { Authorization: `Bearer ${upstashToken}` }
            });
            const cacheData = await cacheRes.json();
            if (cacheData.result) {
              const cachedStats = JSON.parse(cacheData.result);
              stats.views = cachedStats.views || 0;
              stats.likes = cachedStats.likes || 0;
              stats.shares = cachedStats.shares || 0;
              stats.comments = cachedStats.comments || 0;
              stats.saves = cachedStats.saves || 0;
              isCachedSystem = true;
            }
            console.log("đọc thành công cache");

          } catch (e) {
            console.error("Lỗi đọc cache Upstash:", e);
          }
        }

        if (!isCachedSystem) {
          const options = {
            method: 'GET',
            headers: {
              'x-rapidapi-host': process.env.RAPIDAPI_HOST || '',
              'x-rapidapi-key': process.env.RAPIDAPI_KEY || ''
            }
          };
          const resTk = await fetch(`https://tiktok-api23.p.rapidapi.com/api/post/detail?videoId=${videoId}`, options);
          if (resTk.ok) {
            const tkData = await resTk.json();
            if (tkData?.itemInfo?.itemStruct?.stats) {
              const s = tkData.itemInfo.itemStruct.stats;
              stats.views = Number(s.playCount) || 0;
              stats.likes = Number(s.diggCount) || 0;
              stats.shares = Number(s.shareCount) || 0;
              stats.comments = Number(s.commentCount) || 0;
              stats.saves = Number(s.collectCount) || 0;

              if (upstashUrl && upstashToken) {
                try {
                  // Lưu cache với thời gian hết hạn là định kì (ví dụ 1 tiếng = 3600s)
                  await fetch(`${upstashUrl}/set/${cacheKey}?EX=3600`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${upstashToken}` },
                    body: JSON.stringify({
                      views: stats.views,
                      likes: stats.likes,
                      shares: stats.shares,
                      comments: stats.comments,
                      saves: stats.saves
                    })
                  });
                } catch (e) {
                  console.error("Lỗi lưu cache Upstash:", e);
                }
              }
            }
          } else {
            // Phát hiện lỗi từ Rapid API (ví dụ 429 Too Many Requests)
            console.error("Lỗi từ Rapid API:", resTk.status, resTk.statusText);
            return NextResponse.json({ success: false, error: `Lỗi API TikTok: ${resTk.status}` }, { status: resTk.status === 429 ? 429 : 500 });
          }
        }
      } else {
        return NextResponse.json({ success: false, error: "Không tìm thấy Video ID trong Link Tiktok này." }, { status: 400 });
      }
    } else if (platform === "youtube") {
      stats.views = 0;
      stats.likes = 0;
      stats.shares = 0;
      stats.comments = 0;
      stats.saves = 0;
    }

    return NextResponse.json({
      success: true,
      data: stats,
      cached: isCachedSystem
    });

  } catch (error) {
    console.error(`Lỗi phân tích ${platform}:`, error);
    return NextResponse.json({ success: false, error: "Lỗi nội bộ khi fetch dữ liệu" }, { status: 500 });
  }
}
