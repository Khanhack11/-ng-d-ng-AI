# Báo cáo Kết quả Kiểm thử (Test Report)

## 1. Tóm tắt Thực thi
- **Ngày kiểm thử**: 07/09/2026
- **Môi trường**: Windows 11, Node.js v24, MS SQL Server (port 53504), Vite Frontend (port 5173).
- **Tổng số ca kiểm thử**: 5
- **Đạt (Pass)**: 5 / 5 (100%)
- **Không đạt (Fail)**: 0

## 2. Chi tiết Kết quả Kiểm thử

| Mã TC | Mô tả | Trạng thái | Ghi chú bằng chứng |
| :--- | :--- | :--- | :--- |
| **TC-001** | Chatbot tìm kiếm theo khoảng giá | **PASS** | Bóc tách chính xác maxPrice = 500.000, trả về sản phẩm `Áo Hoodie Streetwear Unisex (420.000 VNĐ)`. |
| **TC-002** | Thêm sản phẩm vào giỏ hàng | **PASS** | Gọi thành công `CartRepository.addItemToCart`, giỏ hàng cập nhật số lượng chính xác. |
| **TC-003** | Lấy danh sách sản phẩm | **PASS** | Trả về đủ 8 sản phẩm đã phê duyệt trong CSDL kèm danh mục. |
| **TC-004** | Lấy danh mục sản phẩm | **PASS** | Trả về 5 danh mục: Thời trang nam, Áo khoác & Hoodie, Giày dép, Phụ kiện, Túi xách. |
| **TC-005** | API Danh sách AI Skills | **PASS** | Trả về 6 kỹ năng chuẩn hóa (`PRODUCT_SEARCH_RECOMMEND`, `QUICK_ADD_TO_CART`, `TRACK_ORDER`, `SALES_ANALYTICS`, `AI_COPYWRITER`, `PROMOTION_ADVISOR`). |

## 3. Kết luận
Toàn bộ các luồng chức năng trọng yếu của hệ thống đã hoạt động ổn định và đạt 100% tiêu chí chấp nhận.
