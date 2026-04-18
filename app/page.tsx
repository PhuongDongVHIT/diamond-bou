import { getTiktokList } from "@/lib/sheet-api";
import LeaderboardClient from "@/components/LeaderboardClient";
import Link from "next/link";
import SocialChecker from "@/components/SocialChecker";

export const revalidate = 60;

export default async function Home() {
  const initialList = await getTiktokList();

  return (
    <div className="min-h-screen py-16 sm:py-24 px-6 md:px-12 font-[family-name:var(--font-geist-sans)] bg-slate-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      <main className="w-full max-w-5xl mx-auto relative z-10 flex flex-col gap-12">
        <div>
          <div className="text-center mb-16 pt-4">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-white font-bold text-sm mb-6 border border-slate-700 shadow-sm">
              <span className="text-amber-400">💎</span> 30/03 – 19/04/2026
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 text-slate-900 uppercase leading-tight">
              Truy Tìm <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">Đại Sứ Kim Cương</span>
            </h1>
            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-6">
              Sân chơi dành cho những <span className="font-bold text-amber-500">“gương mặt vàng”</span> của chiến trường sales chính thức khởi động!
              Bạn đã sẵn sàng lên sóng – lên tầm – lên vị thế và trở thành Đại sứ thương hiệu <span className="font-bold text-blue-600">Diamond Boulevard</span>
            </p>
          </div>

          <LeaderboardClient initialList={initialList} />
        </div>

        {/* Vẫn giữ lại Social Checker ở dưới cuối trang */}
        <div className="mt-12 pt-12 border-t border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Trình kiểm tra thủ công</h2>
          </div>
          <SocialChecker />
        </div>
      </main>
    </div>
  );
}
