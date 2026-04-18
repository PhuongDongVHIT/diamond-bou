export interface TiktokEntry {
  name: string;
  unit: string;
  url: string;
}

export async function getTiktokList(): Promise<TiktokEntry[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID || '10Tza0inZjqfrs7bRLzq7Z1r-6mWhk-HITGnDDVVkP_0';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  try {
    const response = await fetch(url, { next: { revalidate: 60 } }); // Cache kết quả 60s
    const text = await response.text();

    let json;
    try {
      // Cắt bỏ phần text thừa của Google để lấy đúng chuẩn JSON: 
      // "/*O_o*/\ngoogle.visualization.Query.setResponse({\"version\":\"...\"});"
      const match = text.match(/google\.visualization\.Query\.setResponse\((.+)\);/);
      if (match && match[1]) {
        json = JSON.parse(match[1]);
      } else {
        // Dự phòng cách bóc tách chuỗi thủ công cũ
        const jsonString = text.substring(47).slice(0, -2);
        json = JSON.parse(jsonString);
      }
    } catch (parseError) {
      console.error("Lỗi parse JSON từ Google Sheets:", parseError);
      return [];
    }

    if (!json?.table?.rows) {
      return [];
    }

    const objectList = json.table.rows.map((row: any) => {
      // Chỉ lấy Tên (Cột B), Đơn vị (Cột C), và Link (Cột D)
      // Các ô null thì fallback thành chuỗi rỗng hoặc giá trị nặc danh
      return {
        name: row.c?.[1]?.v || "Ẩn danh",
        unit: row.c?.[2]?.v || "Cá nhân",
        url: row.c?.[3]?.v || ""
      };
    });

    // Lọc ra các dòng bị trống Link, không phải link tiktok và xóa các dòng TRÙNG LẶP URL
    const seenUrls = new Set<string>();
    const validAndUniqueList = objectList.filter((item: TiktokEntry) => {
      // 1. Phải có link và là link tiktok
      if (!item.url || !item.url.includes("tiktok.com")) return false;
      
      // Chẩn hoá URL: Loại bỏ khoảng trắng 2 đầu nếu có để check chính xác
      const cleanUrl = item.url.trim();
      
      // 2. Không được trùng lặp
      if (seenUrls.has(cleanUrl)) return false;
      
      // Đánh dấu URL đã duyệt
      seenUrls.add(cleanUrl);
      
      // Cập nhật lại URL sạch
      item.url = cleanUrl;
      return true;
    });

    return validAndUniqueList;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ Google Sheets:", error);
    return [];
  }
}
