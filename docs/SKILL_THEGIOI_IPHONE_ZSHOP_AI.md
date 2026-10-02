---
name: thegioi-iphone-zshop-skill
description: >-
  Bộ kỹ năng AI toàn diện cho Hệ thống Quản lý Bán hàng tích hợp AI (Thế Giới iPhone - ZShop).
  Bao gồm kiến trúc Multi-Agent RAG (8 Agents: Orchestrator, Analyst, Database, RAG, Recommendation,
  Reasoning, Critic, Response Agent), Vector DB ChromaDB, 13 kỹ năng AI (AISkillType),
  phân quyền 4 tác nhân chuẩn UML 2.5 (ADMIN, SALES, WAREHOUSE, CUSTOMER), 10 Use Case nghiệp vụ (UC01-UC10),
  cổng thanh toán đa kênh SZ-Payment và cơ chế chống ảo giác giá (0% Hallucination).
---

# BỘ TÀI LIỆU KỸ NĂNG AI TOÀN DIỆN (AI SKILLS SPECIFICATION)
## HỆ THỐNG QUẢN LÝ BÁN HÀNG CÓ TÍCH HỢP AI (THẾ GIỚI IPHONE - ZSHOP)

* **Nhóm thực hiện:** Nhóm 01 (Nhóm 2 SV)
* **Trưởng nhóm:** Nguyễn Quốc Khánh (MSSV: DTC245220042) — Phụ trách Backend, CSDL 3NF, Cổng SZ-Payment & Multi-Agent RAG AI
* **Thành viên:** Mẫn Bá Hảo — Phụ trách Storefront React 19, Portal Quản trị 4 Vai trò, Giỏ hàng & Luồng Đổi trả / Nhập kho
* **Thời gian thực hiện:** 27/07/2026 – 27/09/2026 (9 tuần)
* **Phiên bản:** V2.0 (Cập nhật đồng bộ 100% với mã nguồn và CSDL thực tế)

---

## 1. Tổng Quan Kiến Trúc Hệ Thống (System Architecture)

Hệ thống **Thế Giới iPhone - ZShop** vận hành theo mô hình **Cửa hàng Đơn nhất (Single-Store)** chuyên kinh doanh các dòng **Điện thoại iPhone chính hãng VN/A & Sưu tầm** (từ iPhone 4s, 8 Plus, XS Max, 11, 12, 13, 14, 15, 16, 17 đến iPhone 18 Pro Max Flagship), được thiết kế theo mô hình 4 tầng kỹ thuật hiện đại:

1. **Tầng Giao diện Đa Kênh (Frontend - React 19 + TypeScript + Vite + TailwindCSS):**
   - **Showroom Trực tuyến (`ShopeeHomePage.tsx`, `ProductGrid.tsx`, `ProductDetailPage.tsx`):** Trưng bày kệ máy đa thế hệ với các dòng chủ lực (`16 Pro Max`, `15 Pro Max`, `18 Pro Max`, `14 Pro Max`, `17 Pro Max`, `13 Pro Max`, `16 Pro`, `15 Plus`, `17 Air`, `12 Pro Max`, `11 Pro Max`, `8 Plus`, `4s`) ngay đầu trang; công nghệ đồng bộ màu sắc máy & ánh sáng Studio (`getProductVisualSync`).
   - **Giỏ hàng Thông minh & Thanh toán 1 Trang (`MiniCart.tsx`, `CheckoutPage.tsx`):** Cho phép tích chọn mua lẻ từng máy hoặc theo nhóm dòng máy (`handleSelectCartGroup`), tự động lưu giữ món chưa mua trong giỏ, hỗ trợ áp mã giảm giá và thanh toán đa kênh **SZ-Payment** (`VietQR Napas 247`, `COD`).
   - **Trợ lý AI Đa Tác Vụ (`ChatBot.tsx`):** Thiết kế 4 tab chuyên sâu (`💬 AI GenZ`, `📱 Sản phẩm`, `📦 Đơn hàng`, `👑 VIP`) với cơ chế định dạng tiền tệ `formatVND` chống lỗi giao diện, giám sát độ trễ TTFT và bộ giải mã từ viết tắt GenZ Việt Nam.
   - **Thanh Điều hướng Đa Tác nhân (`PortalTopBar.tsx`):** Chuyển đổi linh hoạt giữa 3 phân hệ quản trị nội bộ:
     - `AdminDashboard.tsx`: Dành cho **Chủ cửa hàng (`ADMIN`)**.
     - `CSKHPortalPage.tsx`: Dành cho **Nhân viên bán hàng (`SALES` - Hợp nhất POS tại quầy, CRM VIP & Duyệt đổi trả 1-1)**.
     - `WarehousePage.tsx`: Dành cho **Nhân viên kho (`WAREHOUSE` - Nhập kho VN/A & Kiểm kê)**.

2. **Tầng Dịch vụ Nghiệp vụ (Backend - Node.js Express v5 - Cổng 5000):**
   - Cung cấp toàn bộ RESTful APIs nghiệp vụ (`/api/auth`, `/api/products`, `/api/orders`, `/api/carts`, `/api/payments`, `/api/chat`).
   - Tích hợp controller điều phối: `szshop-backend/controllers/ChatController.js` và dịch vụ dự phòng `szshop-backend/services/AiService.js`.

3. **Tầng Trí tuệ Nhân tạo Đa Tác Tử (AI Microservice - Python Flask + ChromaDB - Cổng 5001):**
   - Vận hành tại `agent_service/app.py`, điều phối chuỗi **8 Agents** tuần tự qua `StructuredMessageBus`: `Orchestrator`, `Analyst`, `Database`, `RAG`, `Recommendation`, `Reasoning`, `Critic`, `Response Agent`.
   - Kết nối kho tri thức nhúng Vector **ChromaDB** (`agent_service/data/chroma_db`).

4. **Tầng Lưu trữ & Dự phòng Thông minh (Database & 3-Tier Smart Offline Fallback):**
   - **CSDL Quan hệ:** 15 bảng chuẩn 3NF trên **SQL Server / MySQL** (`szshop-backend/database.sql`).
   - **CSDL Vector:** **ChromaDB** lưu trữ embedding 384 chiều của danh mục sản phẩm (`all_50_products.json`).
   - **Smart Offline Fallback:** Tự động chuyển đổi thông minh: `Flask Agent Service (5001)` $ightarrow$ `Express Backend API (5000)` $ightarrow$ `In-Browser Rule Engine (aiSkills.ts)` đảm bảo hệ thống vận hành liên tục `100%` ngay cả khi mất mạng hoặc không có API key.

---

## 2. Phân Quyền 4 Tác Nhân Chuẩn UML 2.5 (RBAC Matrix)

Hệ thống loại bỏ hoàn toàn mô hình đa gian hàng (Multi-vendor) phức tạp, tập trung tối ưu cho mô hình bán lẻ đơn nhất với **4 vai trò người dùng (`UserRole` trong `types.ts`)**:

| STT | Mã Vai Trò (`UserRole`) | Tên Tác Nhân | Giao Diện Chính | Quyền Hạn Nghiệp Vụ & Use Case Được Phép Truy Cập |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `ADMIN` | **Admin - Chủ cửa hàng** | `AdminDashboard.tsx` | Toàn quyền quản trị hệ thống: Cấp phát/khóa tài khoản nhân viên (`UC01`), quản lý danh mục iPhone (`UC02`), cấu hình tích điểm VIP (`UC03`), giám sát kho (`UC05`), xem thống kê doanh thu (`UC06`), dùng AI Stock Copilot (`UC08`), hỏi đáp chiến lược cùng **AI Business Intelligence (`UC09`)** và duyệt hoàn tiền (`UC10`). |
| **2** | `SALES` | **Nhân viên bán hàng** | `CSKHPortalPage.tsx` | Đăng nhập nội bộ (`UC01`), quản lý hồ sơ khách hàng thân thiết CRM & xét hạng thẻ VIP (`UC03`), bán hàng thu ngân trực tiếp tại quầy POS & xử lý đơn Online (`UC04`), tra cứu vận đơn (`UC06`), duyệt yêu cầu Đổi trả/Hoàn tiền kèm **Thu hồi điểm tích lũy (`UC10`)**. |
| **3** | `WAREHOUSE` | **Nhân viên kho** | `WarehousePage.tsx` | Đăng nhập nội bộ (`UC01`), thêm/sửa/xóa sản phẩm & biến thể Màu/Dung lượng (`UC02`), lập **Phiếu nhập kho chuẩn `NK-YYYY-XXXX`** & kiểm kê tồn kho (`UC05`), nhận cảnh báo tồn kho thấp (`stock <= 40`) và sử dụng **AI Stock Copilot (`UC08`)** để gợi ý số lượng nhập hàng. |
| **4** | `CUSTOMER` | **Khách hàng** | `ShopeeHomePage.tsx` | Tự đăng ký tài khoản / đăng nhập (`UC01`), chọn nhanh mã máy đa thế hệ (`UC02`), tích điểm VIP (`UC03`), chọn mua từng món hoặc theo nhóm trong `MiniCart` & thanh toán qua `CheckoutPage` (`UC04`), theo dõi đơn mua tại `MyOrdersPage` (`UC06`), hỏi đáp tư vấn 24/7 cùng **Chatbot AI RAG (`UC07`)**, gửi yêu cầu đổi trả (`UC10`). |

---

## 3. Kiến Trúc AI Multi-Agent RAG & Quy Trình 8 Tác Tử

Hệ thống AI ZShop áp dụng mô hình **Multi-Agent Collaborative System with Critic Pattern & Reflection Loop**:

```text
[Người dùng gửi câu hỏi (Tiếng Việt tự nhiên / Ngôn ngữ GenZ)]
                            │
                            ▼
1. ORCHESTRATOR AGENT (Bộ điều phối trung tâm)
   └── Khởi tạo Context, phiên làm việc & phân phối tin nhắn qua Structured Message Bus
                            │
                            ▼
2. ANALYST AGENT (Phân tích Ý định & Bóc tách Thực thể)
   ├── Phân loại 1 trong 13 kỹ năng AI (AISkillType)
   ├── Trích xuất bộ lọc: Model iPhone (4s -> 18 Pro Max), Ngân sách (min_price, max_price), Dung lượng, Màu sắc
   └── Giải mã ngôn ngữ GenZ Việt Nam: "18prm" -> "iPhone 18 Pro Max", "15 củ" -> "15.000.000đ"
                            │
                            ▼
3. DATABASE AGENT (Truy vấn CSDL Quan hệ)
   └── Truy vấn thông tin sản phẩm, tồn kho thực tế, đơn hàng, điểm tích lũy từ SQL Server / all_50_products.json
                            │
                            ▼
4. RAG AGENT (Truy xuất Ngữ nghĩa Vector DB - ChromaDB)
   ├── Tìm kiếm Semantic Search trên kho Vector ChromaDB (bộ nhúng 384 chiều)
   └── Kết hợp Metadata Filtering cứng: price <= max_price, stock > 0
                            │
                            ▼
5. RECOMMENDATION AGENT (Gợi ý Phối hợp & Up-sell)
   └── Đề xuất Combo Phụ kiện Apple chính hãng (Củ sạc nhanh 20W/35W, Cáp đan dù, Ốp lưng MagSafe)
                            │
                            ▼
6. REASONING AGENT (Tư duy Tổng hợp & Sinh lời giải)
   ├── Đưa dữ liệu Grounded Context từ CSDL vào Prompt
   └── Gọi mô hình Google Gemini 2.5 Flash để trau chuốt văn phong tự nhiên, trẻ trung
                            │
                            ▼
7. CRITIC AGENT (Thẩm định Chéo & Vòng lặp Tự sửa lỗi Reflection Loop)
   ├── Kiểm tra độ chính xác: 100% giá bán phải trùng khớp với trường `price` trong CSDL
   ├── Kiểm tra tồn kho: Tuyệt đối không tư vấn sản phẩm có tồn kho bằng 0
   └── Quyết định: 
       ├── REVISE: Gửi phản hồi yêu cầu Reasoning Agent sửa đổi (tối đa 2 lần)
       └── ACCEPT: Phê duyệt câu trả lời đạt chuẩn 0% Hallucination
                            │
                            ▼
8. RESPONSE AGENT (Đóng gói Phản hồi & Generative UI)
   └── Trả kết quả về giao diện ChatBot.tsx kèm thẻ Product Cards, nút mua nhanh 1 chạm & Telemetry
```

---

## 4. Danh Mục 13 Kỹ Năng AI Thông Minh (`AISkillType` trong `aiSkills.ts`)

| STT | Mã Kỹ Năng (`AISkillType`) | Use Case | Tác Nhân Sử Dụng | Mô Tả Nghiệp Vụ Chi Tiết & Đầu Ra Giao Diện (Generative UI) |
| :---: | :--- | :---: | :--- | :--- |
| **1** | `PRODUCT_SEARCH_RECOMMEND` | `UC07` | Khách hàng | Tìm kiếm và gợi ý các dòng iPhone theo nhu cầu và ngân sách (VD: *"Tìm iPhone tầm 15 củ chụp ảnh đẹp"*). Trả về danh sách thẻ sản phẩm kèm nút **"Thêm vào giỏ"** và **"Xem chi tiết"**. |
| **2** | `STOCK_INQUIRY` | `UC07` | Khách hàng, NV Kho | Tự động tra cứu số lượng tồn kho thực tế của từng phiên bản màu sắc/dung lượng và trả lời trạng thái (*Còn hàng / Sắp hết / Hết hàng*). |
| **3** | `QUICK_ADD_TO_CART` | `UC04` | Khách hàng | Chốt đơn và đưa sản phẩm trực tiếp từ khung chat `ChatBot.tsx` vào giỏ hàng trượt `MiniCart.tsx` (đồng bộ màu Studio) chỉ bằng 1 thao tác bấm. |
| **4** | `TRACK_ORDER` | `UC06` | Khách hàng, NV Bán hàng | Tra cứu mã đơn hàng (`DH-XXXXXXXX`), hiển thị thanh tiến trình giao hàng trực quan 4 bước và chính sách bảo hành Apple VN/A 12 tháng. |
| **5** | `SALES_ANALYTICS` | `UC06` | Admin, NV Bán hàng | Báo cáo nhanh doanh số bán hàng, số đơn phát sinh trong ngày, Top sản phẩm iPhone bán chạy nhất và danh sách mặt hàng sắp chạm ngưỡng cạn kho. |
| **6** | `BUSINESS_QA` | `UC09` | **Admin (Độc quyền)** | **AI Business Intelligence (Text-to-Data):** Phân tích tốc độ tăng trưởng doanh thu, biên lợi nhuận ròng, tỷ lệ đổi trả hàng và đề xuất chiến lược tối ưu giá. |
| **7** | `INVENTORY_RECOMMENDATION` | `UC08` | **NV Kho, Admin** | **AI Stock Copilot:** Quét các mã sản phẩm có `stock <= 40`, đối chiếu tốc độ bán để tính toán số lượng nhập kho khuyến nghị: $	ext{Số lượng nhập} = \lceil	ext{Tốc độ bán} 	imes 1.5 - 	ext{Tồn kho}ceil$. |
| **8** | `AI_COPYWRITER` | `UC02` | Admin, NV Kho | Tự động sinh tiêu đề tiếp thị, danh sách điểm nổi bật (Key Features) và bài viết mô tả sản phẩm chuẩn SEO cho các mẫu iPhone mới ra mắt. |
| **9** | `PROMOTION_ADVISOR` | `UC04` | Khách hàng | Cung cấp danh sách các mã khuyến mãi đang áp dụng (`FREESHIPMAX`, `ZSHOPNEW`, `VIPGOLD10`) kèm nút sao chép nhanh và hướng dẫn sử dụng. |
| **10** | `AI_FASHION_STYLIST` | `UC07` | Khách hàng | Gợi ý **Combo Hệ sinh thái Apple** đồng bộ đẳng cấp (VD: Phối combo *iPhone 16 Pro Max Titan Sa Mạc + Củ sạc Apple 35W + Ốp lưng MagSafe chính hãng*). |
| **11** | `AI_SMART_FITTING` | `UC07` | Khách hàng | Tư vấn kích thước màn hình phù hợp với thói quen cầm nắm (6.1 inch, 6.3 inch, 6.7 inch, 6.9 inch) và mức dung lượng bộ nhớ tối ưu (`128GB`, `256GB`, `512GB`, `1TB`). |
| **12** | `AI_VIP_LOYALTY` | `UC03`, `UC10` | Khách hàng, NV Bán hàng | Tra cứu điểm thưởng tích lũy (100.000đ = 1 điểm), phân hạng thẻ VIP (Đồng, Bạc, Vàng, Kim Cương) và diễn giải quy tắc thu hồi điểm khi đổi trả (`Points Clawback`). |
| **13** | `GENERAL_CONSULT` | `UC07` | Tất cả tác nhân | Giải đáp chính sách bảo hành Apple 12 tháng (1 đổi 1 trong 30 ngày), hướng dẫn thanh toán VietQR Napas 24/7 và chính sách giao hàng hỏa tốc 2 giờ. |

---

## 5. Bốn Phân Hệ Điều Hướng Trực Tiếp Trên ChatBot UI (4 Tabs)

Giao diện [components/ChatBot.tsx](file:///c:/Users/Nguye/OneDrive/Desktop/Project_Ai/_Web_ZShop-main/_Web_ZShop-main/components/ChatBot.tsx) được thiết kế theo dạng widget nổi với 4 tab điều hướng chuyên biệt:

1. **Tab 1: `💬 AI GenZ` (Hội Thoại & Tư Vấn Mua Sắm):**
   - Hỗ trợ trò chuyện tự nhiên bằng tiếng Việt, giải mã viết tắt tiếng lóng GenZ (`18prm`, `17 air`, `xsm`, `8p`, `15 củ`).
   - Tích hợp chỉ số Telemetry GenAI: Model (`gemini-2.5-flash`), TTFT (Time-to-First-Token ~85ms), Tổng số Token tiêu thụ và Điểm bám sát sự thật (Grounding Score: 99%).
2. **Tab 2: `📱 Sản phẩm` (Duyệt Nhanh Kệ Máy iPhone):**
   - Cung cấp thanh lọc nhanh các dòng máy từ iPhone 4 đến iPhone 18 Pro Max.
   - Hiển thị giá ưu đãi ZShop kèm mức chiết khấu, màu sắc sẵn có và nút "Thêm vào giỏ" đưa máy thẳng sang `MiniCart.tsx`.
3. **Tab 3: `📦 Đơn hàng` (Tra Cứu Vận Đơn & Hậu Mãi):**
   - Tra cứu tức thì tiến độ đơn hàng theo mã (VD: `DH-20260908-01`, `DH-849201`).
   - Hiển thị tiến trình 4 bước FSM (`PENDING` $ightarrow$ `PAID` $ightarrow$ `PROCESSING` $ightarrow$ `SHIPPING` $ightarrow$ `DELIVERED`).
4. **Tab 4: `👑 VIP` (Đặc Quyền Thành Viên & Voucher):**
   - Hiển thị hạng thẻ hiện tại của khách hàng (`Đồng`, `Bạc`, `Vàng`, `Kim Cương`) và quỹ điểm khả dụng.
   - Tính toán số tiền được khấu trừ trực tiếp (1 điểm = 100đ) và cung cấp các mã giảm giá độc quyền.

---

## 6. Cơ Chế Chống Ảo Giác Giá Tuyệt Đối (0% Price Hallucination)

Để loại trừ hoàn toàn rủi ro AI phát sinh giá sai lệch gây thiệt hại doanh thu:

1. **Grounded Context Injection:** Mọi câu lệnh gửi tới LLM đều được bao bọc bởi ngữ cảnh CSDL thực tế. Nghiêm cấm mô hình sử dụng tri thức ngoài về giá sản phẩm.
2. **Dual-Check Gatekeeper:** Critic Agent dùng biểu thức chính quy (Regex) quét toàn bộ các con số kèm đơn vị tiền tệ trong phản hồi và so khớp với bảng `Products`. Nếu sai lệch > 0 VNĐ, kích hoạt tự sửa lỗi ngay lập tức.
3. **Price Tag Generative UI:** Giá sản phẩm trên giao diện không phải do LLM in ra dưới dạng text thuần mà được render từ dữ liệu có cấu trúc `product.price` thông qua hàm `formatVND(product.price)`.

---

## 7. Kiến Trúc Dự Phòng Ngoại Tuyến (3-Tier Smart Offline Fallback)

Hệ thống đảm bảo khả năng sẵn sàng phục vụ 99.99% thông qua cơ chế chuyển tầng tự động:

```text
[Client ChatBot.tsx]
       │
       ├──► (Tầng 1 - Ưu tiên cao nhất): Flask Multi-Agent Server (Port 5001)
       │    └── Xử lý qua 8 Agents + ChromaDB Vector Store + Gemini LLM
       │
       ├──► (Tầng 2 - Dự phòng khi Flask offline): Node.js Express Backend (Port 5000)
       │    └── Xử lý qua AiService.js + SQL Server CSDL + Gemini REST API
       │
       └──► (Tầng 3 - Tự hành 100% In-Browser): Local Rule Engine (aiSkills.ts)
            └── Tự phân tích ngữ pháp, lọc danh mục all_50_products.json, hoạt động không cần mạng
```

---

## 8. Hướng Dẫn Khởi Chạy Nhanh & Lệnh Thực Thi (Quick Commands)

1. **Khởi chạy đồng bộ Frontend & Backend (Khuyến nghị):**
   ```powershell
   npm install
   npm start
   # Hoặc: npm run dev:all
   ```
   *Tự động bật Backend Express (cổng 5000) và Frontend Vite (cổng 3000) với cờ `--kill-others` an toàn không kẹt cổng.*

2. **Khởi chạy toàn bộ hệ thống gồm cả AI Microservice:**
   ```powershell
   npm run dev:full
   ```
   *Bật đồng thời: Backend (5000) + Python Flask Agent (5001) + Frontend Vite (3000).*

3. **Khởi chạy riêng Dịch vụ Multi-Agent Python:**
   ```powershell
   python agent_service/run_server.py
   ```
   *Lắng nghe tại http://localhost:5001.*

4. **Chạy bài kiểm thử chất lượng AI (Benchmark):**
   ```powershell
   python agent_service/evaluation/benchmark.py
   ```
