# Tiêu chí Chấp nhận (Acceptance Criteria)

### AC-001: Tìm kiếm Sản phẩm bằng AI Chatbot (US-004)
- **Kịch bản 1: Tìm kiếm theo khoảng giá**
  - **Given**: Khách hàng mở cửa sổ Chatbot ZShop.
  - **When**: Khách hàng nhập tin nhắn "tìm áo dưới 500k".
  - **Then**: Hệ thống bóc tách `max_price = 500000` và `keyword = 'áo'`.
  - **And**: Chatbot trả về danh sách các sản phẩm có giá `<= 500000 VNĐ` kèm nút "Thêm vào giỏ" và "Xem chi tiết".
- **Kịch bản 2: Không tìm thấy sản phẩm**
  - **Given**: Khách hàng hỏi sản phẩm không tồn tại trong hệ thống.
  - **When**: Khách hàng hỏi "tìm phi thuyền vũ trụ".
  - **Then**: Chatbot thông báo lịch sự không tìm thấy sản phẩm trong kho và gợi ý các mặt hàng thời trang đang có.

### AC-002: Thêm vào giỏ hàng và Đồng bộ (US-002)
- **Given**: Khách hàng đang ở trang sản phẩm hoặc thẻ sản phẩm của Chatbot.
- **When**: Nhấn nút "Thêm vào giỏ".
- **Then**: Số lượng hiển thị trên MiniCart tăng lên ngay lập tức (Optimistic Update).
- **And**: Gửi yêu cầu `POST /api/carts/add` lưu thông tin vào bảng `CartItems` trong cơ sở dữ liệu.

### AC-003: Duyệt sản phẩm bởi Quản trị viên (US-007)
- **Given**: Sản phẩm mới do Seller đăng tải có trạng thái `PENDING`.
- **When**: Admin đăng nhập vào Dashboard và nhấn "Duyệt" sản phẩm.
- **Then**: CSDL cập nhật `approval_status = 'APPROVED'`.
- **And**: Sản phẩm hiển thị ngay lập tức trên trang chủ và sẵn sàng bán.
