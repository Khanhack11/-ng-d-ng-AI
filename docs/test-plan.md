# Kế hoạch Kiểm thử (Test Plan)

## 1. Phạm vi Kiểm thử
- **Tầng Backend API**: Kiểm thử các endpoint `/api/chat`, `/api/ai/skills`, `/api/products`, `/api/categories`, `/api/carts`.
- **Tầng Cơ sở Dữ liệu**: Kiểm thử kết nối SQL Server, các câu lệnh CRUD, ràng buộc khóa ngoại và logic trừ tồn kho.
- **Tầng AI Skills & NLP Engine**: Kiểm thử bóc tách khoảng giá, nhận diện danh mục và sinh câu trả lời RAG.
- **Tầng Giao diện Frontend**: Kiểm thử giao diện trang chủ, giỏ hàng MiniCart, mở/đóng Chatbot và thao tác mua hàng.

## 2. Các Kịch bản Kiểm thử Chính (Test Cases)

| Mã TC | Hạng mục | Đầu vào | Kết quả mong đợi |
| :--- | :--- | :--- | :--- |
| **TC-001** | Chatbot tìm theo giá | "tìm áo dưới 500k" | Trả về danh sách sản phẩm giá <= 500.000 VNĐ. |
| **TC-002** | Thêm giỏ hàng API | `POST /api/carts/add` với `product_id: 3, quantity: 1` | Thêm thành công, trả về danh sách giỏ hàng mới. |
| **TC-003** | Lấy danh sách sản phẩm | `GET /api/products` | Trả về mảng JSON sản phẩm có kèm `categoryName`. |
| **TC-004** | Kiểm tra danh mục | `GET /api/categories` | Trả về đủ 5 danh mục cơ bản. |
| **TC-005** | Tra cứu kỹ năng AI | `GET /api/ai/skills` | Trả về danh sách 6 kỹ năng AI của hệ thống. |
