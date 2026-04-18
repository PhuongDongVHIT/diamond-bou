# 💎 Bảng Xếp Hạng Tuyển Chọn Đại Sứ Kim Cương

Dự án Bảng xếp hạng chiến dịch quy mô lớn của đội ngũ sale Diamond Boulevard. Ứng dụng tự động thu thập thống kê video của các nền tảng mạng xã hội (đặc biệt là TikTok), đồng bộ từ Google Sheets, hiển thị thứ hạng theo thời gian thực với độ trễ siêu thấp thông qua cơ chế Redis Caching.

## 🌟 Tính Năng Nổi Bật

- **Real-time Leaderboard**: Hiển thị bảng xếp hạng thành viên với thiết kế thẻ 3D lấp lánh sang trọng.
- **Tự động Parse Links Rút Gọn**: Khi nạp link kiểu `vt.tiktok.com`, ứng dụng ngầm tự hiểu và tìm ra Video ID gốc.
- **Smart Throttle & API Caching**: Gọi API lấy tương tác ngầm với độ tuân thủ Rate Limit cao. Các dữ liệu gọi rồi sẽ lưu trữ tạm ở Upstash Redis trong 1 giờ để tiết kiệm 95% số lượng request của RapidAPI.
- **Tính năng Clear Cache Nhanh**: Tích hợp trang `/clear-cache` quản trị xoá cache chủ động khi cần cập nhật đột phá (yêu cầu khởi động lại chiến dịch).
- **SEO & Social Cards tối ưu**: Tiêu đề trang, favicon đa nền tảng, thiết lập OpenGraph facebook/X chia sẻ link.

---

## 🛠 Tech Stack (Công nghệ sử dụng)

- **Framework**: Next.js 14+ (App Router, Server Actions)
- **Styling**: Tailwind CSS, CSS 3D Glassmorphism
- **Database / Cache**: Upstash Redis (Serverless)
- **Data Source**: Google Sheets Public JSON / gviz
- **Data Fetcher**: RapidAPI (TikTok API V23)

---

## ⚙️ Cài đặt môi trường

Để chạy mô hình web này, bạn cần tiến hành cài đặt Node.js version 18+ trên máy tính, và clone bộ mã nguồn này về ổ đĩa. 

### Bước 1: Cài đặt Node Modules
Từ thư mục của dự án, mở Terminal ra và gõ lệnh cài đặt thư viện:
```bash
npm install
```

### Bước 2: Khởi tạo biến môi trường (.env.local)

Tạo một file `.env.local` ở thư mục gốc lớn nhất và điền 5 key quan trọng sau:

```env
# ==== Cấu hình Tiktok RapidAPI ====
# Mua gói TikTok API tại RapidAPI để thay Token 
RAPIDAPI_HOST=tiktok-api23.p.rapidapi.com
RAPIDAPI_KEY=điền-key-của-bạn-ở-đây

# ==== Cấu Hình Cache Redis Serverless ====
# Đăng ký free tại upstash.com
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=điền-token-cache-của-bạn-vào-đây

# ==== Nguồn Data Google Sheet ====
# Lưu ý: Bảng phải set quyền xem công khai trên mang (Anyone with the link can view)
GOOGLE_SHEET_ID=ID-Cua-Ban-Lay-Tren-Url-Gsheet
```

### Bước 3: Google Sheets Format Template

File Google Sheets bắt buộc có 4 cột cơ bản đầu tiên theo thứ tự trái sang phải như sau:
1. **Cột A**: STT (hoặc rỗng) 
2. **Cột B**: Tên Người Dự Thi
3. **Cột C**: Đơn Vị Công Tác
4. **Cột D**: Link Video (VD: tiktok.com/@user/video/123 hoặc vt.tiktok.com/...)

---

## 🚀 Khởi Chạy Ứng Dụng

Sau khi điền đủ biến môi trường, sử dụng lệnh Dev để chạy Web trên máy trạm:
```bash
npm run dev
```

Chạy môi trường Production (như khi triển khai lên host thật):
```bash
npm run build
npm run start
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

## 💡 Quản trị nâng cao

1. **Thay đổi tốc độ Load API**: Mở file `components/LeaderboardClient.tsx`, tìm dòng logic có chữ `delayTime`. Mặc định đang set nghỉ `3000` mili giây (3 giây) mỗi lượt Fetch người mới để cho an toàn tránh bị cháy API rate limit. Nếu bạn sắm bản trả phí cao của RapidAPI, có thể sửa `3000` thành `100` hoặc chỉnh Fetch kiểu Batch/Song Song.
2. **Quét sạch Cache**: Truy cập theo đường link `http://localhost:3000/clear-cache` và ấn nút Khôi phục để reset trạng thái.

---
*Developed & Optimized in 2026 for Diamond Boulevard Event.*
