# Vấn đề & Giả định Yêu cầu (Requirements Issues & Assumptions)

## 1. Các vấn đề đã phát hiện & Xử lý (Resolved Issues)
- **Vấn đề cấu hình Hostname cứng**: Mã nguồn gốc trỏ cứng về `DESKTOP-E8HFL02\TTAM` dẫn đến lỗi DNS lookup timeout khi chạy ở môi trường máy khác.
  - *Giải pháp*: Đã chuyển sang `process.env.DB_SERVER || '127.0.0.1'` kết hợp `process.env.DB_PORT || '53504'` và cấu hình dynamic connection pool.
- **Vấn đề đồng bộ CSDL**: Khi mới clone dự án, CSDL chưa được khởi tạo bảng và dữ liệu mẫu.
  - *Giải pháp*: Đã tự động tạo CSDL `He_Thong_Thuong_Mai`, chạy schema migration `database.sql` và seed dữ liệu chuẩn vào CSDL.

## 2. Các giả định nghiệp vụ (Assumptions)
- Mặc định người dùng chưa đăng nhập sử dụng `customer_id = 1` cho các thao tác giỏ hàng demo.
- Đơn vị tiền tệ chuẩn là Đồng Việt Nam (VNĐ).
- Cổng thanh toán VietQR Napas 247 được mô phỏng với mã phản hồi tức thì để phục vụ demo đồ án.
