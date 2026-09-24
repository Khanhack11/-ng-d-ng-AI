# Câu chuyện Người dùng (User Stories - Theo 4 Tác nhân UML)

| ID | Tác nhân UML | User Story | Mapping UC / FR |
| :--- | :--- | :--- | :---: |
| **US-001** | **Khách hàng (`Customer`)** | Là một **Khách hàng**, tôi muốn tự đăng ký tài khoản thành viên và đăng nhập nhanh qua Email hoặc Google để mua sắm và tích điểm VIP. | UC01 / FR-001 |
| **US-002** | **Khách hàng (`Customer`)** | Là một **Khách hàng**, tôi muốn xoay mô hình sản phẩm 3D 360°, lọc theo khoảng giá và hỏi Chatbot AI RAG ("tìm áo dưới 500k") để chọn đúng sản phẩm còn tồn kho. | UC02, UC07 / FR-002, FR-007 |
| **US-003** | **Khách hàng (`Customer`)** | Là một **Khách hàng**, tôi muốn đặt hàng trực tuyến, thanh toán qua mã VietQR Napas 247 và tra cứu tiến trình vận đơn theo thời gian thực. | UC04, UC06 / FR-004, FR-006 |
| **US-004** | **Nhân viên bán hàng (`Sales Staff`)** | Là một **Nhân viên bán hàng**, tôi muốn tạo hóa đơn bán hàng tại quầy (POS), tra cứu số điện thoại khách hàng để tích điểm VIP tự động và in hóa đơn tại chỗ. | UC03, UC04 / FR-003, FR-004 |
| **US-005** | **Nhân viên bán hàng (`Sales Staff`)** | Là một **Nhân viên bán hàng**, tôi muốn tiếp nhận yêu cầu đổi trả/hoàn tiền của khách và hệ thống tự động thu hồi điểm tích lũy tương ứng để chống gian lận. | UC10 / FR-010 |
| **US-006** | **Nhân viên kho (`Warehouse Staff`)** | Là một **Nhân viên kho**, tôi muốn lập phiếu nhập kho mới từ nhà cung cấp và cập nhật thông tin sản phẩm để số lượng tồn kho luôn chính xác. | UC02, UC05 / FR-002, FR-005 |
| **US-007** | **Nhân viên kho (`Warehouse Staff`)** | Là một **Nhân viên kho**, tôi muốn xem gợi ý từ Trợ lý AI Khuyến nghị Kho (Stock Copilot) để biết mặt hàng nào sắp hết (`stock <= 40`) và số lượng cần nhập thêm. | UC08 / FR-008 |
| **US-008** | **Admin - Chủ cửa hàng (`Admin`)** | Là **Admin (Chủ cửa hàng)**, tôi muốn quản lý tài khoản Nhân viên bán hàng và Nhân viên kho, giám sát doanh thu toàn cửa hàng, xuất báo cáo Excel/PDF và hỏi đáp chiến lược kinh doanh với AI BI. | UC01, UC06, UC09 / FR-001, FR-006, FR-009 |
