"use client";

import { useEffect, useState, useMemo } from "react";
import { TiktokEntry } from "@/lib/sheet-api";

interface RankedEntry extends TiktokEntry {
  likes: number;
  views: number;
  shares: number;
  comments: number;
  saves: number;
  totalScore: number;
  status: "idle" | "loading" | "success" | "error";
  rank: number;
}

export default function LeaderboardClient({ initialList }: { initialList: TiktokEntry[] }) {
  const [entries, setEntries] = useState<RankedEntry[]>(
    initialList.map(item => ({ 
      ...item, likes: 0, views: 0, shares: 0, comments: 0, saves: 0, totalScore: 0, status: "idle" as const, rank: 0 
    }))
  );
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchAllStats() {
      for (let i = 0; i < initialList.length; i++) {
        if (!isMounted) break;
        
        const item = initialList[i];
        let isCurrentRequestCached = false;
        
        // Cập nhật trạng thái đang tải
        setEntries((prev: RankedEntry[]) => prev.map((e: RankedEntry) => e.url === item.url ? { ...e, status: "loading" as const } : e));
        
        try {
          const res = await fetch(`/api/check-stats?url=${encodeURIComponent(item.url)}&timestamp=${new Date().getTime()}`, { 
            cache: 'no-store', // Ngăn trình duyệt cache
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          const data = await res.json();
          isCurrentRequestCached = data.cached === true;
          
          if (isMounted) {
            if (data.success && data.data) {
              const d = data.data;
              const total = (d.views || 0) + (d.likes || 0) + (d.shares || 0) + (d.comments || 0) + (d.saves || 0);

              setEntries((prev: RankedEntry[]) => prev.map((e: RankedEntry) => e.url === item.url ? { 
                ...e, 
                likes: d.likes || 0,
                views: d.views || 0,
                shares: d.shares || 0, 
                comments: d.comments || 0,
                saves: d.saves || 0,
                totalScore: total,
                status: "success" as const
              } : e));
            } else {
              setEntries((prev: RankedEntry[]) => prev.map((e: RankedEntry) => e.url === item.url ? { ...e, status: "error" as const } : e));
            }
          }
        } catch (error) {
          if (isMounted) {
              setEntries((prev: RankedEntry[]) => prev.map((e: RankedEntry) => e.url === item.url ? { ...e, status: "error" as const } : e));
          }
        }
        
        // Nghỉ 3000ms (3 giây) nếu là API thật để tránh Rate Limit, và lặp NHANH (0ms) nếu là Cache
        if (isMounted && i < initialList.length - 1) {
          const delayTime = isCurrentRequestCached ? 0 : 3000;
          if (delayTime > 0) {
            await new Promise(resolve => setTimeout(resolve, delayTime));
          }
        }
      }
    }
    
    if (initialList.length > 0) {
      fetchAllStats();
    }
    
    return () => {
      isMounted = false;
    };
  }, [initialList]);

  // Sắp xếp danh sách dựa trên TỔNG ĐIỂM cao nhất, bọc bằng useMemo để tối ưu render
  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => b.totalScore - a.totalScore).map((e, index) => ({
      ...e,
      rank: index + 1
    }));
  }, [entries]);

  const formatNumberCompact = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toLocaleString();
  };

  if (initialList.length === 0) {
    return (
      <div className="text-center p-12 bg-white/50 backdrop-blur-md rounded-3xl border border-gray-100">
        <p className="text-gray-500 text-lg font-medium">Hiện không có dữ liệu nào trên Google Sheets hoặc Sheet chưa được công khai cấu trúc.</p>
      </div>
    );
  }

  return (
    <div className="w-full relative group">
      {/* Background glow effect */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-[2rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>

      {/* Main Container */}
      <div className="relative bg-white/90 backdrop-blur-2xl ring-1 ring-gray-900/5 shadow-2xl p-6 sm:p-10 rounded-[2rem] overflow-hidden">
        
        {/* Header Table */}
        <div className="grid grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-gray-500 tracking-wide mb-4 px-2 sm:px-4 hidden md:grid">
          <div className="col-span-1 text-center">Hạng</div>
          <div className="col-span-4 text-left">Người Dự Thi & Đơn Vị</div>
          <div className="col-span-5 text-center">Tham số Tương Tác</div>
          <div className="col-span-2 text-right">Tổng Điểm</div>
        </div>

        <div className="flex flex-col gap-3">
          {sortedEntries.map((entry) => (
            <div 
              key={entry.url} 
              className={`flex flex-wrap md:grid md:grid-cols-12 gap-2 sm:gap-4 items-center p-4 rounded-2xl transition-all duration-300 border ${
                entry.rank === 1 ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-400 shadow-md shadow-yellow-100' :
                entry.rank === 2 ? 'bg-gradient-to-r from-slate-100 to-slate-50 border-slate-300 shadow-md shadow-slate-100' :
                entry.rank === 3 ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300 shadow-md shadow-orange-100' :
                'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200 shadow-sm'
              }`}
            >
              {/* Rank */}
              <div className="w-full md:w-auto md:col-span-1 flex justify-between md:justify-center items-center mb-2 md:mb-0">
                <span className="md:hidden text-xs font-bold text-gray-400">HẠNG:</span>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg border-2 ${
                  entry.rank === 1 ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 text-white border-yellow-200 shadow-yellow-400/40 transform scale-110' :
                  entry.rank === 2 ? 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-white border-slate-200 shadow-slate-400/40' :
                  entry.rank === 3 ? 'bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600 text-white border-orange-200 shadow-orange-400/40' :
                  'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                </div>
              </div>

              {/* Name & Unit */}
              <div className="w-full md:w-auto md:col-span-4 flex flex-col justify-center mb-2 md:mb-0">
                <span className="font-bold text-gray-900 truncate text-base sm:text-lg">{entry.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-gray-500 px-2 py-0.5 bg-gray-200/60 rounded-full truncate max-w-full">
                    {entry.unit}
                  </span>
                  <a 
                    href={entry.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-blue-500 hover:text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.51.34-5.08 1.98-7.1 2.14-2.56 5.8-3.55 8.94-2.5.15.05.28.12.43.18v4.13c-1.2-.55-2.61-.63-3.88-.28-1.32.35-2.45 1.34-2.94 2.61-.43 1.09-.4 2.37.1 3.44.57 1.25 1.83 2.15 3.2 2.29 1.48.16 3.02-.27 4.09-1.28 1.09-1 1.63-2.43 1.68-3.9.06-4.91.04-9.82.04-14.73l-.04-.01z"/></svg>
                    Link
                  </a>
                </div>
              </div>

              {/* Interaction Params */}
              <div className="w-full md:w-auto md:col-span-5 flex flex-wrap justify-between md:justify-center gap-2 sm:gap-4 my-2 md:my-0">
                {entry.status === 'idle' || entry.status === 'loading' ? (
                  <div className="flex w-full items-center justify-center text-gray-400 gap-2 h-12">
                    <svg className="animate-spin h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span className="text-sm font-medium animate-pulse">Đang nạp...</span>
                  </div>
                ) : entry.status === 'error' ? (
                  <div className="w-full text-center flex items-center justify-center h-12">
                    <span className="text-xs text-red-500 font-medium bg-red-50 px-3 py-1 rounded-full border border-red-100">Bị Lỗi/Quá Tải</span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl min-w-[3rem]" title="Lượt Xem (Views)">
                      <span className="text-lg leading-none">👁️</span>
                      <span className="text-xs font-black text-slate-700 mt-1">{formatNumberCompact(entry.views)}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-rose-50 rounded-xl min-w-[3rem]" title="Lượt Tim (Likes)">
                      <span className="text-lg leading-none">❤️</span>
                      <span className="text-xs font-black text-rose-600 mt-1">{formatNumberCompact(entry.likes)}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-blue-50 rounded-xl min-w-[3rem]" title="Bình luận (Comments)">
                      <span className="text-lg leading-none">💬</span>
                      <span className="text-xs font-black text-blue-600 mt-1">{formatNumberCompact(entry.comments)}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-emerald-50 rounded-xl min-w-[3rem]" title="Lưu lại (Saves)">
                      <span className="text-lg leading-none">🔖</span>
                      <span className="text-xs font-black text-emerald-600 mt-1">{formatNumberCompact(entry.saves)}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-purple-50 rounded-xl min-w-[3rem]" title="Chia sẻ (Shares)">
                      <span className="text-lg leading-none">🔁</span>
                      <span className="text-xs font-black text-purple-600 mt-1">{formatNumberCompact(entry.shares)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Total Score */}
              <div className="w-full md:w-auto md:col-span-2 flex justify-between md:justify-end items-center mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                <span className="md:hidden text-xs font-bold text-gray-500">TỔNG ĐIỂM:</span>
                {entry.status === 'success' && (
                   <div className="flex items-center gap-1 sm:gap-2">
                     <span className="text-xl sm:text-2xl lg:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 tracking-tight">
                       {formatNumberCompact(entry.totalScore)}
                     </span>
                     <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-pink-500 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
