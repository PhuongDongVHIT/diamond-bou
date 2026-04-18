"use client";

import { useEffect, useState } from "react";

export default function PostStats({ slug, url }: { slug: string; url: string }) {
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [fbShares, setFbShares] = useState(0);
  const [tiktokShares, setTiktokShares] = useState(0);

  useEffect(() => {
    // Fetch View
    fetch("/api/view", {
      method: "POST",
      body: JSON.stringify({ slug }),
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setViews(data.views);
      })
      .catch((err) => console.log("Error loading view count", err));

    // Fetch internal shares for both platforms
    fetch(`/api/share?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFbShares(data.fbShares);
          setTiktokShares(data.tiktokShares);
        }
      })
      .catch((err) => console.log("Error loading share count", err));
  }, [slug]);

  const handleLike = async () => {
    const res = await fetch("/api/like", {
      method: "POST",
      body: JSON.stringify({ slug }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (data.success) {
      setLikes(data.likes);
    }
  };

  const handleShareFacebook = async () => {
    // Tự tăng bộ đếm share nội bộ fb
    const res = await fetch("/api/share", {
      method: "POST",
      body: JSON.stringify({ slug, platform: 'facebook' }),
      headers: { "Content-Type": "application/json" }
    });
    
    const data = await res.json();
    if (data.success) {
      setFbShares(data.shares);
    }

    // Mở popup share fb
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "facebook-share-dialog",
      "width=800,height=600"
    );
  };

  const handleShareTiktok = async () => {
    // Tự tăng bộ đếm share nội bộ tiktok
    const res = await fetch("/api/share", {
      method: "POST",
      body: JSON.stringify({ slug, platform: 'tiktok' }),
      headers: { "Content-Type": "application/json" }
    });
    
    const data = await res.json();
    if (data.success) {
      setTiktokShares(data.shares);
    }

    // TikTok không có Popup Web Sharer giống FB (vì TikTok là định dạng quay video).
    // Giải pháp là copy link vào Clipboard để người dùng tự Paste vào TikTok chat/bio.
    try {
      await navigator.clipboard.writeText(url);
      alert("Đã sao chép link! Bạn có thể dán vào ứng dụng TikTok để chia sẻ.");
    } catch (err) {
      console.error("Lỗi sao chép:", err);
    }
  };

  return (
    <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-xl shadow-sm w-fit border border-gray-100 flex-wrap">
      {/* Lượt View */}
      <div className="flex items-center gap-2 text-gray-600 px-2">
        <span className="text-xl">👁️</span> 
        <span className="font-semibold">{views}</span>
      </div>
      
      {/* Lượt Like */}
      <button 
        onClick={handleLike} 
        className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors cursor-pointer border-l border-gray-200 pl-4"
      >
        <span className="text-xl">❤️</span> 
        <span className="font-semibold">{likes}</span>
      </button>

      {/* Share Facebook */}
      <button 
        onClick={handleShareFacebook}
        className="flex items-center gap-2 text-[#1877F2] hover:text-[#0c59bfc1] transition-colors cursor-pointer border-l border-gray-200 pl-4"
        title="Bấm để Share Facebook"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path></svg>
        <span className="font-semibold">{fbShares}</span> 
      </button>

      {/* Share TikTok */}
      <button 
        onClick={handleShareTiktok}
        className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors cursor-pointer border-l border-gray-200 pl-4"
        title="Sao chép Link chia sẻ lên TikTok"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.51.34-5.08 1.98-7.1 2.14-2.56 5.8-3.55 8.94-2.5.15.05.28.12.43.18v4.13c-1.2-.55-2.61-.63-3.88-.28-1.32.35-2.45 1.34-2.94 2.61-.43 1.09-.4 2.37.1 3.44.57 1.25 1.83 2.15 3.2 2.29 1.48.16 3.02-.27 4.09-1.28 1.09-1 1.63-2.43 1.68-3.9.06-4.91.04-9.82.04-14.73l-.04-.01z"/></svg>
        <span className="font-semibold">{tiktokShares}</span> 
      </button>
    </div>
  );
}
