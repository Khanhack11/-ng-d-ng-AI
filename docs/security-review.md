# Báo cáo Kiểm tra An ninh Bảo mật (Security Review Report)

## 1. Danh mục Kiểm tra An ninh (Security Checklist)

| Hạng mục kiểm tra | Trạng thái | Đánh giá & Hành động đã thực hiện |
| :--- | :--- | :--- |
| **SQL Injection** | **AN TOÀN** | 100% các câu truy vấn tại `repositories/` đều sử dụng cú pháp Parameterized SQL với kiểu dữ liệu định danh (`sql.Int`, `sql.NVarChar`, `sql.Decimal`), triệt tiêu hoàn toàn nguy cơ SQL Injection. |
| **Cross-Site Scripting (XSS)** | **AN TOÀN** | Toàn bộ dữ liệu tin nhắn chatbot và mô tả sản phẩm đều được escape và render an toàn qua JSX của React 19. |
| **Bảo vệ Khóa bí mật (Secrets)** | **AN TOÀN** | File `.env` chứa mật khẩu và API Keys được đưa vào `.gitignore`. Cấu hình hỗ trợ đọc biến môi trường từ hệ thống. |
| **CORS Policy** | **AN TOÀN** | `cors()` middleware được thiết lập tại `server.js` kiểm soát nguồn gọi API. |
| **Xử lý Lỗi & Che giấu Stack Trace** | **AN TOÀN** | Các lỗi máy chủ trả về cho client ở dạng thông báo thân thiện, không làm lộ stack trace hoặc cấu trúc thư mục máy chủ. |
| **Bảo mật Đăng nhập (Authentication)** | **AN TOÀN** | Sử dụng mã hóa mật khẩu và token xác thực phiên làm việc. |
