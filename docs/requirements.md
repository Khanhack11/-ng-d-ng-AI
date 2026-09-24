# Đặc tả Yêu cầu Hệ thống (System Requirements Specification - Chuẩn UML)

## 1. Yêu cầu Chức năng (Functional Requirements - Đồng bộ 10 Use Case UML)

| Mã FR | Mã UC | Tên chức năng | Mô tả chi tiết & Quan hệ UML | Tác nhân thực hiện |
| :--- | :---: | :--- | :--- | :--- |
| **FR-001** | **UC01** | Đăng ký, Đăng nhập & Quản lý Nhân sự | Khách hàng tự đăng ký tài khoản mua sắm. Cả 4 tác nhân đăng nhập & đổi mật khẩu. Admin (Chủ cửa hàng) cấp phát & quản lý tài khoản Nhân viên bán hàng và Nhân viên kho. | Khách hàng, Nhân viên bán hàng, Nhân viên kho, Admin (Chủ cửa hàng) |
| **FR-002** | **UC02** | Quản lý Danh mục & Sản phẩm 3D | Khách hàng khám phá không gian 3D WebGL, tìm kiếm & lọc sản phẩm. Admin và Nhân viên kho thêm, sửa, xóa danh mục và sản phẩm của cửa hàng. | Khách hàng, Nhân viên kho, Admin (Chủ cửa hàng) |
| **FR-003** | **UC03** | Quản lý Khách hàng (CRM) & Tích điểm VIP | Quản lý hồ sơ khách hàng, hạng thẻ (Đồng, Bạc, Vàng, Kim Cương), tự động tích điểm thưởng khi mua sắm và tra cứu lịch sử điểm. | Nhân viên bán hàng, Admin (Chủ cửa hàng), Khách hàng |
| **FR-004** | **UC04** | Bán hàng POS & Đặt hàng Thanh toán SZ-Payment | Khách hàng quản lý giỏ hàng & đặt mua trực tuyến; Nhân viên bán hàng tạo đơn tại quầy (POS). Bao gồm quan hệ bắt buộc `<<include>> Thanh toán Đa kênh SZ-Payment` (VietQR, VNPAY, MoMo, COD). | Khách hàng, Nhân viên bán hàng |
| **FR-005** | **UC05** | Quản lý Nhập kho & Kiểm kê Tồn kho | Lập phiếu nhập kho (`NK-YYYY-XXXX`) từ nhà cung cấp, cập nhật số lượng tồn kho thực tế và theo dõi lịch sử nhập hàng. | Nhân viên kho, Admin (Chủ cửa hàng) |
| **FR-006** | **UC06** | Báo cáo Doanh thu & Tra cứu Vận đơn | Khách hàng và Nhân viên bán hàng tra cứu tiến trình vận đơn 5 bước. Admin xem biểu đồ doanh thu cửa hàng, mở rộng `<<extend>> Xuất báo cáo Excel/PDF`. | Admin (Chủ cửa hàng), Nhân viên bán hàng, Khách hàng |
| **FR-007** | **UC07** | Tư vấn Mua sắm bằng Trợ lý AI RAG | Chatbot AI phân tích câu hỏi tự nhiên, `<<include>> Truy xuất ngữ cảnh sản phẩm & tồn kho từ CSDL` để tư vấn chính xác 100% không bịa đặt. | Khách hàng |
| **FR-008** | **UC08** | AI Khuyến nghị Nhập kho (Stock Copilot) | AI phân tích tốc độ bán và tồn kho hiện tại (`stock <= 40`) để đề xuất danh mục và số lượng cần nhập hàng cho kho. | Nhân viên kho, Admin (Chủ cửa hàng) |
| **FR-009** | **UC09** | AI Hỏi đáp & Phân tích Kinh doanh (AI BI) | Trợ lý AI dành riêng cho Chủ cửa hàng hỏi đáp số liệu doanh thu, tỷ lệ chuyển đổi, hiệu quả tích điểm VIP và chiến lược kinh doanh. | Admin (Chủ cửa hàng) |
| **FR-010** | **UC10** | Quản lý Đổi trả, Hoàn tiền & Thu hồi Điểm | Khách hàng gửi yêu cầu đổi size/trả hàng. Nhân viên bán hàng và Admin phê duyệt hoàn tiền, bắt buộc `<<include>> Thu hồi điểm tích lũy (Points Clawback)`. | Khách hàng, Nhân viên bán hàng, Admin (Chủ cửa hàng) |

## 2. Yêu cầu Phi chức năng (Non-Functional Requirements)

| Mã NFR | Tiêu chí | Mô tả |
| :--- | :--- | :--- |
| **NFR-001** | Hiệu năng (Performance) | Thời gian phản hồi API < 1000ms. Phản hồi Chatbot AI RAG < 2000ms. Hiển thị đồ họa 3D đạt 60 FPS. |
| **NFR-002** | Bảo mật & Phân quyền (RBAC) | Mật khẩu băm an toàn. Kiểm soát phân quyền chặt chẽ theo đúng 4 vai trò UML (`ADMIN`, `SALES`, `WAREHOUSE`, `CUSTOMER`). Mọi truy vấn SQL dùng Parameterized Query. |
| **NFR-003** | Tính nhất quán (Consistency) | Mô hình Cửa hàng Đơn nhất (Single-Store) đồng bộ tồn kho tức thời giữa Kênh bán Online, Quầy POS và Kho tổng. |
| **NFR-004** | Khả năng sẵn sàng (Availability) | Cơ chế Smart Hybrid (SQL Server + Local Fallback) đảm bảo hệ thống vận hành liên tục 100%. |
