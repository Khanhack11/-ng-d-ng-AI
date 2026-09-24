# Yêu cầu từ Khách hàng & Nghiệp vụ Cửa hàng (Customer & Business Requirements)

## 1. Bối cảnh Hệ thống
Cửa hàng thương mại điện tử và bán lẻ thông minh **ZShop (Single-Store 3D E-Commerce & Retail POS System)** cần xây dựng hệ thống quản lý bán hàng tập trung của một cửa hàng duy nhất (không sử dụng mô hình sàn nhiều nhà bán hàng đăng ký), tích hợp không gian trưng bày 3D WebGL, cổng thanh toán đa kênh SZ-Payment và trợ lý AI RAG thông minh.

## 2. Mô hình 4 Tác nhân Chuẩn UML (System Actors)

### 1. Admin - Chủ cửa hàng (`ADMIN`)
- Quản lý toàn diện hoạt động kinh doanh của cửa hàng ZShop.
- Quản lý tài khoản và phân quyền nhân sự nội bộ (**Nhân viên bán hàng**, **Nhân viên kho**) (`UC01`).
- Quản lý danh mục ngành hàng và toàn bộ sản phẩm kinh doanh của cửa hàng (`UC02`).
- Giám sát báo cáo doanh thu, lợi nhuận, đơn hàng và xuất báo cáo Excel/PDF (`UC06`).
- Sử dụng Trợ lý AI Hỏi đáp & Phân tích Kinh doanh (AI Business Intelligence) để ra quyết định chiến lược (`UC09`).
- Cấu hình chính sách tích điểm VIP (`UC03`) và phê duyệt các trường hợp đổi trả đặc biệt (`UC10`).

### 2. Nhân viên bán hàng (`SALES`)
- Trực tiếp vận hành **Điểm bán hàng tại quầy (POS)**, quét mã sản phẩm, tạo hóa đơn tại quầy và thanh toán nhanh (`UC04`).
- Quản lý hồ sơ **Khách hàng thân thiết (CRM)**, tra cứu hạng thẻ (Đồng, Bạc, Vàng, Kim Cương) và cộng/trừ điểm thưởng tích lũy (`UC03`).
- Tiếp nhận, tra cứu tiến trình vận đơn và hỗ trợ điều phối đơn đặt hàng trực tuyến (`UC06`).
- Xử lý yêu cầu **Đổi trả & Hoàn tiền** từ khách hàng, đồng thời thực hiện nghiệp vụ bắt buộc (`<<include>>`) thu hồi điểm tích lũy tương ứng (`UC10`).

### 3. Nhân viên kho (`WAREHOUSE`)
- Quản lý danh mục và cập nhật thông tin sản phẩm, biến thể (màu sắc, kích cỡ), giá bán và định mức tồn kho (`UC02`).
- Lập **Phiếu nhập kho** từ nhà cung cấp, kiểm kê số lượng hàng thực tế và cập nhật tồn kho thời gian thực (`UC05`).
- Sử dụng **Hệ thống AI Khuyến nghị Nhập kho (Stock Copilot)** để nhận cảnh báo hàng sắp hết (`stock <= 40`) và gợi ý số lượng cần nhập tối ưu (`UC08`).

### 4. Khách hàng (`CUSTOMER`)
- Đăng ký tài khoản thành viên Khách hàng, đăng nhập đa kênh (Email/Mật khẩu, Google OAuth) và đổi mật khẩu (`UC01`).
- Khám phá không gian trưng bày sản phẩm 3D tương tác xoay 360°, tìm kiếm và lọc sản phẩm theo nhu cầu (`UC02`).
- Quản lý giỏ hàng, đặt hàng trực tuyến và thanh toán đa kênh qua cổng **SZ-Payment** (VietQR Napas 247, VNPAY, MoMo, Thẻ quốc tế, COD) (`UC04`).
- Theo dõi điểm thưởng tích lũy và hạng thành viên VIP (`UC03`).
- Tra cứu hành trình đơn hàng theo mã vận đơn `DH-XXXXXXXX` (`UC06`) và gửi yêu cầu đổi trả/hoàn tiền (`UC10`).
- Trò chuyện với **Trợ lý AI Mua sắm ZShop Copilot (RAG)** để được tư vấn sản phẩm theo ngân sách và kiểm tra tồn kho thời gian thực (`UC07`).
