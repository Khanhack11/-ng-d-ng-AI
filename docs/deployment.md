# Hướng dẫn Khởi chạy & Triển khai (Deployment & Run Guide)

## 1. Yêu cầu Tiên quyết
- **Node.js**: Phiên bản 18+ (khuyên dùng Node.js 20 hoặc 24).
- **Microsoft SQL Server**: Chạy tại cổng nội bộ `53504` (hoặc `1433`), hỗ trợ tài khoản `sa` với mật khẩu `Huyvinh123@`.
- **Git & PowerShell**.

## 2. Cài đặt Phụ thuộc

### Cài đặt thư viện Frontend (Thư mục gốc)
```bash
npm install
```

### Cài đặt thư viện Backend
```bash
cd szshop-backend
npm install
cd ..
```

## 3. Khởi tạo Cơ sở Dữ liệu & Dữ liệu Mẫu

Chạy lệnh nạp dữ liệu mẫu vào SQL Server (tạo Roles, User, Seller, Categories, Products):
```bash
node szshop-backend/seed-data.js
```

## 4. Chạy Hệ thống

### Cách 1: Chạy đồng thời cả Frontend và Backend (Khuyên dùng)
```bash
npm run dev:all
```
*(Lệnh này sử dụng `concurrently` để chạy Backend tại port 5000 và Frontend tại port 5173)*.

### Cách 2: Chạy riêng từng phần
- **Chạy Backend**:
  ```bash
  npm run server
  # Backend Server sẵn sàng tại: http://localhost:5000
  ```
- **Chạy Frontend**:
  ```bash
  npm run dev
  # Web App sẵn sàng tại: http://localhost:5173
  ```

## 5. Truy cập Ứng dụng
- Mở trình duyệt tại địa chỉ: **`http://localhost:5173`**
- Thử nghiệm Chatbot AI bằng cách click vào biểu tượng Trợ lý AI ở góc phải màn hình.
