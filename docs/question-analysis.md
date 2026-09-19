# Tài liệu Phân tích Câu hỏi (Question Analysis)

## 1. Mục tiêu Module
Chuyển hóa câu hỏi bằng ngôn ngữ tự nhiên thành một cấu trúc JSON xác định (Structured Intent) để làm tham số cho các bộ lọc truy vấn CSDL.

## 2. Các Mẫu Biểu thức Chính Quy (Regex Patterns)
- **Khoảng giá dưới X**: `dưới\s+(\d+(?:\.\d+)?)\s*(k|nghìn|ngàn|triệu|tr|m)?`
  - Ví dụ: "dưới 500k" -> `max_price = 500000`
- **Khoảng giá trên / từ X**: `(?:trên|từ)\s+(\d+(?:\.\d+)?)\s*(k|nghìn|ngàn|triệu|tr|m)?`
  - Ví dụ: "từ 200k" -> `min_price = 200000`
- **Khoảng giá xấp xỉ / tầm X**: `(?:tầm|khoảng)\s+(\d+(?:\.\d+)?)\s*(k|nghìn|ngàn|triệu|tr|m)?`
  - Ví dụ: "tầm 1 triệu" -> `min_price = 700000, max_price = 1300000`

## 3. Danh mục Từ khóa Nhận diện
- `keywords`: `['áo', 'quần', 'giày', 'mũ', 'túi', 'đồng hồ', 'hoodie', 'jean', 'dior', 'polo', 'sneaker']`
- `categories`: `['Thời trang nam', 'Áo khoác & Hoodie', 'Giày dép', 'Phụ kiện', 'Túi xách']`
