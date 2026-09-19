# Quyết định Kiến trúc (Architectural Decision Records - ADR)

## ADR-001: Sử dụng Kiến trúc RAG cho AI Chatbot
- **Bối cảnh**: Cửa hàng cần chatbot tư vấn sản phẩm thực tế từ kho hàng, tránh tình trạng AI tự bịa đặt sản phẩm hoặc giá sai (Hallucination).
- **Quyết định**: Triển khai mô hình RAG: Bóc tách Intent -> Truy vấn CSDL bằng Parameterized SQL -> Xây dựng Context -> Gửi vào Prompt.
- **Hệ quả**: Đảm bảo 100% sản phẩm tư vấn có thật trong kho với giá chính xác, thời gian truy vấn nhanh và tiết kiệm token.

## ADR-002: Kiến trúc Phân tầng Rời (Controller - Service - Repository)
- **Bối cảnh**: Hệ thống cần dễ mở rộng, bảo trì và kiểm thử độc lập cho từng module.
- **Quyết định**: Phân tách rõ rệt:
  - `Controller`: Nhận request, validate dữ liệu, điều phối response.
  - `Service`: Chứa toàn bộ business logic.
  - `Repository`: Đảm nhiệm tương tác CSDL bằng Parameterized Query.
- **Hệ quả**: Dễ dàng viết unit test cho từng tầng mà không cần phụ thuộc vào tầng khác.

## ADR-003: Chế độ Fallback thông minh (Graceful Degradation)
- **Bối cảnh**: Trong môi trường demo hoặc khi CSDL tạm thời bị gián đoạn, giao diện không được bị crash.
- **Quyết định**: Cả Frontend (`ChatBot.tsx`) và Backend (`AiService.js`) đều tích hợp fallback tự động sang danh mục mẫu nếu kết nối CSDL gặp sự cố.
- **Hệ quả**: Trải nghiệm người dùng mượt mà, không gặp màn hình trắng hoặc lỗi 500 gián đoạn.
