# Báo cáo Đánh giá Mã nguồn (Code Review Report)

## 1. Tóm tắt Đánh giá
- **Đối tượng review**: Toàn bộ mã nguồn `szshop-backend/` và các service phía Client (`services.ts`, `aiSkills.ts`, `components/ChatBot.tsx`).
- **Mức độ tuân thủ kiến trúc**: Đạt. Phân tách tốt giữa Controller, Service và Repository.

## 2. Các vấn đề đã rà soát & Tối ưu hóa

### Issue 1: Hardcoded Hostname trong db.config.js (Mức độ: CRITICAL)
- **Mô tả**: Tệp cấu hình gốc chứa `server: 'DESKTOP-E8HFL02\\TTAM'` làm sập kết nối CSDL trên các máy tính khác.
- **Hành động đã khắc phục**: Thay thế bằng biến môi trường `DB_SERVER`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` kết hợp giá trị mặc định nội bộ `127.0.0.1:53504`.
- **Trạng thái**: ĐÃ SỬA VÀ KIỂM CHỨNG.

### Issue 2: Quản lý Connection Pool chưa tái sử dụng (Mức độ: MEDIUM)
- **Mô tả**: `connectDB()` trước đây tạo một pool mới hoặc không kiểm tra trạng thái `connected`.
- **Hành động đã khắc phục**: Thêm biến `poolInstance` để cache connection pool, ngăn chặn cạn kiệt tài nguyên kết nối socket.
- **Trạng thái**: ĐÃ TỐI ƯU HÓA.

### Issue 3: CSDL Trống khi triển khai ban đầu (Mức độ: HIGH)
- **Mô tả**: Dự án khi chạy mới không có dữ liệu sản phẩm, khiến trang chủ và Chatbot trả về danh sách rỗng nếu không có mock data.
- **Hành động đã khắc phục**: Tạo script `szshop-backend/seed-data.js` tự động nạp 8 sản phẩm và 5 danh mục chuẩn vào SQL Server.
- **Trạng thái**: ĐÃ HOÀN TẤT.
