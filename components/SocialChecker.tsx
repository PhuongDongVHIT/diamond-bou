"use client";

import { useState } from "react";

export default function SocialChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ platform: string; views: number; likes: number; shares: number } | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!url) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/check-stats?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Lỗi kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumberCompact = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 100000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative group">
      {/* Background glow effect */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-300"></div>

      {/* Main Container */}
      <div className="relative bg-white/90 backdrop-blur-2xl ring-1 ring-gray-900/5 shadow-2xl p-8 sm:p-12 rounded-[2rem] overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500">
              Check Tương Tác
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-medium tracking-wide">
              Facebook • TikTok • YouTube
            </p>
          </div>
          <div className="flex space-x-2">
            <span className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-bounce"></span>
            <span className="h-2.5 w-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
            <span className="h-2.5 w-2.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          </div>
        </div>
        
        {/* Input Area */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 z-10 relative">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path></svg>
            </div>
            <input 
              type="text" 
              placeholder="Dán link bài viết hoặc video vào đây..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-11 pr-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-gray-800 placeholder-gray-400 font-medium text-lg"
            />
          </div>
          <button 
            onClick={handleCheck}
            disabled={loading || !url}
            className="group px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold tracking-wide hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl sm:w-auto w-full flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Đang quét
              </span>
            ) : "Phân tích"}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center transform transition-all duration-300">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
            {error}
          </div>
        )}

        {/* Results Dashboard */}
        {result && (
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 transform transition-all duration-500 hover:-translate-y-1">
            
            {/* Card 1: Platform */}
            <div className="flex flex-col justify-center p-5 sm:p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-[1.5rem] border border-blue-100/60 shadow-sm hover:shadow-md transition-all duration-300 min-w-0 overflow-hidden">
              <span className="text-[10px] sm:text-[11px] font-black text-blue-600/70 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 truncate">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                <span className="truncate">Nền Tảng</span>
              </span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-black capitalize text-slate-800 tracking-tight truncate">{result.platform}</span>
            </div>
            
            {/* Card 2: Views */}
            <div className="flex flex-col justify-center p-5 sm:p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[1.5rem] border border-purple-100/60 shadow-sm hover:shadow-md transition-all duration-300 min-w-0 overflow-hidden" title={result.views.toLocaleString()}>
              <span className="text-[10px] sm:text-[11px] font-black text-purple-600/70 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 truncate">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                <span className="truncate">Lượt Xem</span>
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight truncate">
                {formatNumberCompact(result.views)}
              </span>
            </div>

            {/* Card 3: Likes */}
            <div className="flex flex-col justify-center p-5 sm:p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-[1.5rem] border border-rose-100/60 shadow-sm hover:shadow-md transition-all duration-300 min-w-0 overflow-hidden" title={result.likes.toLocaleString()}>
              <span className="text-[10px] sm:text-[11px] font-black text-rose-500/70 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 truncate">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                <span className="truncate">Yêu Thích</span>
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight truncate">
                {formatNumberCompact(result.likes)}
              </span>
            </div>

            {/* Card 4: Shares */}
            <div className="flex flex-col justify-center p-5 sm:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[1.5rem] border border-emerald-100/60 shadow-sm hover:shadow-md transition-all duration-300 min-w-0 overflow-hidden" title={result.shares.toLocaleString()}>
              <span className="text-[10px] sm:text-[11px] font-black text-emerald-600/70 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 truncate">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                <span className="truncate">Chia Sẻ</span>
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight truncate">
                {formatNumberCompact(result.shares)}
              </span>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
