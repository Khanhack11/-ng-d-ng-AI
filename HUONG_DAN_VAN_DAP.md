# 🎓 CẨM NANG VẤN ĐÁP ĐỒ ÁN - THẾ GIỚI IPHONE (ZSHOP)
> **Bản đồ tra cứu nhanh mã nguồn dành riêng cho buổi bảo vệ / thi vấn đáp**

---

## ⚡ 1. PHÍM TẮT THẦN THÁNH KHI BẢO VỆ TRÊN VS CODE
* **`Ctrl + P` (Quan trọng nhất)**: Gõ tên file để mở ngay lập tức, không mất công mò mẫm thư mục trước mặt thầy cô.
  * *Ví dụ: Gõ `Orchestrator` -> Ra ngay bộ não AI.*
  * *Ví dụ: Gõ `ChatBot` -> Ra ngay giao diện Chatbot.*
* **`Ctrl + B`**: Thu gọn thanh bên trái để màn hình code rộng rãi, thoáng mắt.
* **`F12`**: Đặt con trỏ vào hàm/biến bất kỳ và ấn F12 để nhảy thẳng đến nơi khai báo (thầy cô rất thích xem em có hiểu luồng gọi hàm hay không).
* **`Alt + Mũi tên trái`**: Quay lại vị trí code vừa đứng trước đó.

---

## 🗺️ 2. BẢN ĐỒ KIẾN TRÚC 3 TẦNG (3-TIER ARCHITECTURE)

```
[ FRONTEND (React + TS) ]  <--->  [ BACKEND (Node.js Express) ]  <--->  [ MYSQL DATABASE ]
             │                                     │
             └───────────► [ AI AGENT SERVICE ] ◄──┘
                           (Python FastAPI + ChromaDB)
```

| Tầng | Thư mục / File chính | Nhiệm vụ chính |
| :--- | :--- | :--- |
| **Frontend** | `App.tsx`, `components/`, `aiSkills.ts` | Giao diện người dùng, điều hướng trang, quản trị, hiển thị chatbot |
| **Backend** | `szshop-backend/` | API RESTful, quản lý Database MySQL, xác thực Auth, thanh toán |
| **AI Service** | `agent_service/` | Hệ thống Multi-Agent RAG: phân tích ý đồ, truy xuất tri thức, chống ảo giác |

---

## 🎯 3. THẦY CÔ HỎI GÌ -> MỞ NGAY FILE ĐÓ TRONG 3 GIÂY

### 🤖 Cụm 1: AI & Chatbot RAG (Thầy cô hỏi nhiều nhất)
* **"Chatbot hoạt động như thế nào? Code ở đâu?"**
  * Giao diện Chatbot: [`components/ChatBot.tsx`](file:///components/ChatBot.tsx)
  * Bộ điều phối Multi-Agent (Orchestrator): [`agent_service/agents/orchestrator.py`](file:///agent_service/agents/orchestrator.py)
  * API tiếp nhận chat từ Python: [`agent_service/app.py`](file:///agent_service/app.py)
* **"Cơ chế RAG (Retrieval-Augmented Generation) & Vector DB ở đâu?"**
  * Agent RAG: [`agent_service/agents/rag_agent.py`](file:///agent_service/agents/rag_agent.py)
  * Vector Database (ChromaDB + dữ liệu 50 sản phẩm): [`agent_service/vector_db/`](file:///agent_service/vector_db/)
* **"Làm sao chống ảo giác giá và thông số (Hallucination)?"**
  * Mở ngay Critic Agent: [`agent_service/agents/critic_agent.py`](file:///agent_service/agents/critic_agent.py)
  * Kết quả Benchmark kiểm chứng 0% ảo giác: [`agent_service/evaluation/BENCHMARK_REPORT.md`](file:///agent_service/evaluation/BENCHMARK_REPORT.md)
* **"13 AI Skills được định nghĩa ở đâu?"**
  * File frontend: [`aiSkills.ts`](file:///aiSkills.ts)

---

### 🛡️ Cụm 2: Phân quyền & Quản trị (Admin, Kho, CSKH, Khách hàng)
* **"Phân quyền người dùng (Role-based Access Control) ở đâu?"**
  * Router & kiểm tra quyền: [`App.tsx`](file:///App.tsx)
  * Auth Controller Backend: [`szshop-backend/controllers/AuthController.js`](file:///szshop-backend/controllers/AuthController.js)
* **"Giao diện của từng vai trò nằm ở đâu?"**
  * Quản trị viên (ADMIN): [`components/AdminDashboard.tsx`](file:///components/AdminDashboard.tsx)
  * Quản lý kho (WAREHOUSE): [`components/WarehousePage.tsx`](file:///components/WarehousePage.tsx)
  * Chăm sóc khách hàng (SALES/CSKH): [`components/CSKHPortalPage.tsx`](file:///components/CSKHPortalPage.tsx)
  * Khách mua hàng (CUSTOMER): [`components/ZShop/ShopeeHomePage.tsx`](file:///components/ZShop/ShopeeHomePage.tsx)

---

### 💳 Cụm 3: Đặt hàng & Cổng thanh toán (SZ-Payment)
* **"Luồng thanh toán và đặt hàng xử lý như thế nào?"**
  * Màn hình Thanh toán: [`components/CheckoutPage.tsx`](file:///components/CheckoutPage.tsx)
  * Kết quả giao dịch: [`components/TransactionResultPage.tsx`](file:///components/TransactionResultPage.tsx)
  * Controller xử lý Đơn hàng: [`szshop-backend/controllers/OrderController.js`](file:///szshop-backend/controllers/OrderController.js)
  * Controller xử lý Thanh toán: [`szshop-backend/controllers/PaymentController.js`](file:///szshop-backend/controllers/PaymentController.js)
  * Quản lý giỏ hàng: [`components/MiniCart.tsx`](file:///components/MiniCart.tsx) & [`szshop-backend/controllers/CartController.js`](file:///szshop-backend/controllers/CartController.js)

---

### 🗄️ Cụm 4: Cơ sở dữ liệu & API Backend
* **"Cơ sở dữ liệu thiết kế ra sao? File tạo bảng ở đâu?"**
  * Script SQL khởi tạo bảng: [`szshop-backend/database.sql`](file:///szshop-backend/database.sql)
  * Cấu hình kết nối MySQL: [`szshop-backend/db.config.js`](file:///szshop-backend/db.config.js)
  * File kết nối DB phía Python: [`agent_service/database/mysql_client.py`](file:///agent_service/database/mysql_client.py)
* **"Danh sách API backend định nghĩa ở đâu?"**
  * Router tổng Backend: [`szshop-backend/routes/index.js`](file:///szshop-backend/routes/index.js)
  * Khởi động server Express: [`szshop-backend/server.js`](file:///szshop-backend/server.js)

---

## 💡 4. GỢI Ý TRẢ LỜI CÂU HỎI KINH ĐIỂN CỦA HỘI ĐỒNG
1. **Câu hỏi:** *"Tại sao hệ thống của em phải tách riêng Python và Node.js?"*
   * **Trả lời:** *"Dạ thưa thầy/cô, hệ thống áp dụng kiến trúc Microservices hướng dịch vụ: Node.js Express xử lý các nghiệp vụ thương mại điện tử tốc độ cao (CRUD, Auth, Giỏ hàng, Đơn hàng, Thanh toán), còn Python chuyên sâu xử lý AI Multi-Agent, Vector Database (ChromaDB) và mô hình ngôn ngữ lớn LLM vốn có hệ sinh thái thư viện AI vượt trội."*
2. **Câu hỏi:** *"Chatbot của em khác gì so với Chatbot thông thường?"*
   * **Trả lời:** *"Dạ hệ thống dùng kiến trúc Multi-Agent phối hợp nhiều tác tử (Analyst -> RAG -> Reasoner -> Recommender -> Critic -> Response). Đặc biệt có Critic Agent đóng vai trò kiểm duyệt độc lập, đối soát giá từ Database thực tế để triệt tiêu 100% hiện tượng ảo giác giá (Hallucination)."*
