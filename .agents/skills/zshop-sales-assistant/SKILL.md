---
name: zshop-sales-assistant
description: >-
  Bộ kỹ năng AI quản lý bán hàng và trợ lý sản phẩm thông minh cho nền tảng ZShop (E-Commerce 3D & SZ-Payment Gateway). Hướng dẫn vận hành 6 AI Business Skills, kiến trúc API, quản lý giỏ hàng, tra cứu đơn hàng và phân tích doanh số bán hàng.
---

# ZShop Sales Assistant Skill

Kỹ năng này trang bị cho Antigravity AI Agent khả năng hiểu rõ kiến trúc, dữ liệu sản phẩm, cổng thanh toán và các nghiệp vụ bán hàng tích hợp AI trên nền tảng **ZShop**.

---

## 1. Tổng Quan Kiến Trúc ZShop

ZShop là hệ thống thương mại điện tử kết hợp:
- **Giao diện Không Gian 3D (MotionSites Spatial Engine)**: WebGL 3D Canvas, Three.js, Bento Grid tương tác, âm thanh Synth không gian.
- **Cửa Hàng Trực Tuyến (Shopee Storefront)**: Danh mục sản phẩm, Flash Sale, MiniCart toàn cục, trang chi tiết 3D và trang thanh toán tức thì.
- **Cổng Thanh Toán Lượng Tử (SZ-Payment Gateway)**: VietQR Napas 247, MoMo, Visa/Mastercard, ZK Biometrics.
- **Bảng Điều Khiển Bán Hàng & Quản Trị (Admin & Seller Channel)**: Quản lý sản phẩm, duyệt người bán, theo dõi doanh thu.
- **Trợ Lý AI Chatbot Sản Phẩm (AI Sales & Product Copilot)**: Chế độ kép (Khách hàng & Quản trị), thẻ sản phẩm tương tác cao, thao tác 1-chạm vào giỏ hàng.

---

## 2. Hệ Thống 6 AI Business Skills

Hệ thống được thiết kế theo mô hình **AI Function Calling / Skills-Driven**:

| Mã Kỹ Năng | Tên Kỹ Năng | Ý Định Xử Lý | Hành Động Thực Thi |
| :--- | :--- | :--- | :--- |
| `PRODUCT_SEARCH_RECOMMEND` | **Tìm Kiếm & Gợi Ý Sản Phẩm** | "tìm áo dưới 500k", "quần jeans slimfit" | Lọc theo ngân sách, phân loại, trả về mảng `products` hiển thị dạng Card trực quan. |
| `QUICK_ADD_TO_CART` | **Đặt Hàng & Thêm Vào Giỏ Nhanh** | "thêm vào giỏ", "chốt đơn cái này" | Kích hoạt callback `onAddToCart` đưa thẳng vào `cartItems` của ứng dụng. |
| `TRACK_ORDER` | **Tra Cứu Tiến Độ Đơn Hàng** | "tra cứu đơn DH-20241228", "ship đến đâu rồi" | Trả về timeline hành trình 4 bước từ khởi tạo đến giao hàng. |
| `SALES_ANALYTICS` | **Báo Cáo Bán Hàng & Tồn Kho** | "báo cáo doanh thu", "hàng sắp hết kho" | Tính toán doanh thu, cảnh báo các mặt hàng tồn kho thấp (`stock <= 40`). |
| `AI_COPYWRITER` | **Sáng Tạo Nội Dung Bán Hàng** | "viết bài mô tả cho áo sơ mi lụa" | Tự động sinh tiêu đề giật tít, 4 điểm nổi bật, mô tả thuyết phục và hashtags SEO. |
| `PROMOTION_ADVISOR` | **Tư Vấn Mã Giảm Giá & Voucher** | "có mã giảm giá nào không", "voucher" | Cung cấp mã `ZSHOPNEW`, `FREESHIPMAX`, `QUANTUM20` kèm nút 1-chạm sao chép. |

---

## 3. Cấu Trúc Mã Nguồn & Vị Trí Tệp Trọng Tâm

- `aiSkills.ts`: Bộ máy phân tích ngôn ngữ tự nhiên (NLP Intent & Entity Extraction) và thực thi 6 kỹ năng phía Client.
- `components/ChatBot.tsx`: Giao diện Chatbot AI hiện đại phong cách Glassmorphism, hỗ trợ Chế độ Kép, Thẻ sản phẩm trực quan và các nút thao tác nhanh.
- `App.tsx`: Tầng State trung tâm, kết nối `cartItems`, `userRole`, `selectedProductId` và render `ChatBot`.
- `szshop-backend/services/AiService.js`: Xử lý AI Skills phía Backend, kết nối cơ sở dữ liệu.
- `szshop-backend/controllers/ChatController.js`: Điều phối API `POST /api/chat` và `GET /api/ai/skills`.
- `constants.ts`: Dữ liệu mẫu danh mục sản phẩm (`MOCK_PRODUCTS_LIST`), giỏ hàng, phương thức thanh toán.

---

## 4. Hướng Dẫn Mở Rộng Kỹ Năng Mới

Khi muốn bổ sung một AI Skill mới (ví dụ: `AI_SIZE_FITTING` tư vấn kích cỡ theo chiều cao/cân nặng):
1. Thêm kiểu phân loại vào `AISkillType` trong `aiSkills.ts`.
2. Định nghĩa hàm phân tích từ khóa và dữ liệu trả về trong `AISkillEngine.executeSkill()`.
3. Bổ sung giao diện thẻ hiển thị tương ứng trong `components/ChatBot.tsx`.
4. Đồng bộ logic xử lý tại `szshop-backend/services/AiService.js`.
5. Cập nhật danh sách tại `GET /api/ai/skills`.
