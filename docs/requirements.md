# Đặc tả Yêu cầu Hệ thống (System Requirements Specification)

## 1. Yêu cầu Chức năng (Functional Requirements)

| Mã FR | Tên chức năng | Mô tả chi tiết | Tác nhân |
| :--- | :--- | :--- | :--- |
| **FR-001** | Đăng ký & Đăng nhập | Cho phép người dùng đăng ký, đăng nhập bằng email/mật khẩu hoặc tài khoản mạng xã hội (Google, Facebook, Apple). | Khách hàng, Seller, Admin |
| **FR-002** | Xem & Lọc Sản phẩm | Hiển thị danh mục sản phẩm, bộ lọc khoảng giá, phân loại theo ngành hàng. | Khách hàng |
| **FR-003** | Quản lý Giỏ hàng | Thêm, sửa số lượng, xóa sản phẩm khỏi giỏ hàng, đồng bộ với CSDL. | Khách hàng |
| **FR-004** | Đặt hàng & Thanh toán | Khởi tạo đơn hàng, chọn cổng thanh toán SZ-Payment (VietQR Napas 247, MoMo, Visa/Mastercard). | Khách hàng |
| **FR-005** | Tra cứu Đơn hàng | Tra cứu trạng thái đơn hàng (Pending -> Paid -> Processing -> Shipping -> Delivered) theo mã đơn. | Khách hàng |
| **FR-006** | Trợ lý Chatbot AI RAG | Chatbot phân tích câu hỏi tự nhiên tiếng Việt, trích xuất intent và truy vấn CSDL để tư vấn sản phẩm chính xác. | Khách hàng, Seller |
| **FR-007** | Quản lý Sản phẩm (Seller) | Thêm sản phẩm mới, cập nhật giá và số lượng kho hàng. | Seller |
| **FR-008** | Duyệt Sản phẩm (Admin) | Phê duyệt hoặc từ chối sản phẩm do Seller gửi lên sàn. | Admin |
| **FR-009** | Báo cáo & Phân tích Doanh thu | Thống kê doanh số bán hàng, đơn hàng trong ngày, cảnh báo hàng tồn kho thấp (`stock <= 40`). | Admin, Seller |

## 2. Yêu cầu Phi chức năng (Non-Functional Requirements)

| Mã NFR | Tiêu chí | Mô tả |
| :--- | :--- | :--- |
| **NFR-001** | Hiệu năng (Performance) | Thời gian phản hồi API < 1000ms. Phản hồi chatbot AI < 2000ms. |
| **NFR-002** | Bảo mật (Security) | Mật khẩu băm an toàn (bcrypt). Mọi câu truy vấn SQL đều phải dùng Parameterized Query để phòng chống SQL Injection. |
| **NFR-003** | Khả năng mở rộng (Scalability) | Thiết kế kiến trúc phân tầng rời (Frontend SPA + REST Backend API + RDBMS). |
| **NFR-004** | Giao diện người dùng (Usability) | Tương thích đa thiết bị (Responsive), hỗ trợ tương tác 3D WebGL và Glassmorphism hiện đại. |
