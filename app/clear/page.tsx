"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClearCachePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleClearCache = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/clear-cache", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        setMessage(data.message || "Đã xóa toàn bộ cache Upstash thành công!");
      } else {
        setError(data.error?.message || data.error || "Có lỗi xảy ra khi xóa cache");
      }
    } catch (err) {
      setError("Lỗi kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 sm:py-24 px-6 md:px-12 font-[family-name:var(--font-geist-sans)] bg-slate-50 relative overflow-hidden flex items-center justify-center">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <main className="w-full max-w-md mx-auto relative z-10 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter mb-2 text-slate-900">
            Quản lý <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Cache</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Công cụ này sẽ xóa TOÀN BỘ dữ liệu bộ đệm (cache) đang lưu trong Upstash Redis.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {message && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
              {message}
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <button
            onClick={handleClearCache}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl text-white font-bold shadow-lg transition-all ${
              loading 
                ? "bg-slate-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            {loading ? "Đang xử lý..." : "Xóa tất cả Cache Upstash"}
          </button>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 underline font-medium">
              &larr; Quay lại trang chủ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
