import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Truy Tìm Đại Sứ Kim Cương - Diamond Boulevard | Bảng Xếp Hạng TikTok",
  description: "Sân chơi dành cho những 'gương mặt vàng' của chiến trường sales chính thức khởi động từ 30/03 – 19/04/2026. Trở thành Đại sứ thương hiệu Diamond Boulevard!",
  icons: {
    icon: "/favicon-dxmd-vietnam.png",
    shortcut: "/favicon-dxmd-vietnam.png",
    apple: "/favicon-dxmd-vietnam.png",
  },
  openGraph: {
    title: "Truy Tìm Đại Sứ Kim Cương 💎 | Bảng Xếp Hạng",
    description: "Bạn đã sẵn sàng lên sóng – lên tầm – lên vị thế và trở thành Đại sứ thương hiệu Diamond Boulevard? Xem bảng xếp hạng ngay!",
    type: "website",
    locale: "vi_VN",
    siteName: "Diamond Boulevard",
    images: [
      {
        url: "/cuoc-thi-truy-tim-dai-su-kim-cuong.webp",
        width: 1200,
        height: 630,
        alt: "Truy Tìm Đại Sứ Kim Cương - Diamond Boulevard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Truy Tìm Đại Sứ Kim Cương - Diamond Boulevard",
    description: "Cuộc thi TikTok mở màn chiến trường sales từ 30/03 – 19/04/2026.",
    images: ["/cuoc-thi-truy-tim-dai-su-kim-cuong.webp"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
