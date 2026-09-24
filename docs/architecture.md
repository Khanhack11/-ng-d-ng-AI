# Tài liệu Thiết kế Kiến trúc & Mô hình hóa Chuẩn UML 2.5 (Architecture & UML Design Document)

## 1. Tổng quan Kiến trúc Hệ thống (Layered Architecture)

Hệ thống **Cửa hàng Thương mại Điện tử 3D & Bán lẻ ZShop (Single-Store Model)** được thiết kế theo kiến trúc phân tầng **Client-Server (Layered Architecture)** tích hợp **RAG (Retrieval-Augmented Generation)** cho Trợ lý AI:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER (FRONTEND SPA)                    │
│          React 19 + TypeScript + Vite + Tailwind CSS + Three.js         │
│  - Phân hệ Khách hàng (Customer): 3D Spatial Canvas, Giỏ hàng, Đơn mua  │
│  - Phân hệ Nhân viên bán hàng (Sales Staff): POS tại quầy, CRM, Đổi trả │
│  - Phân hệ Nhân viên kho (Warehouse Staff): Nhập kho, Tồn kho, AI Kho   │
│  - Phân hệ Admin (Chủ cửa hàng): Báo cáo doanh thu, Nhân sự, AI BI      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP REST API (Port 5000)
┌────────────────────────────────────▼────────────────────────────────────┐
│                        API & CONTROLLER LAYER                           │
│                     Express.js Router & Controllers                     │
│  - AuthController, ProductController, CartController, OrderController   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                            SERVICE LAYER                                │
│  - AiService (RAG Pipeline: Question Analysis -> Retriever -> Gemini)   │
│  - ProductService, CartService, OrderService, LoyaltyService            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                           REPOSITORY LAYER                              │
│  - Parameterized SQL Queries (Chống SQL Injection tuyệt đối)            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ MSSQL Driver
┌────────────────────────────────────▼────────────────────────────────────┐
│                            DATABASE LAYER                               │
│              Microsoft SQL Server (11 Bảng Chuẩn 3NF)                   │
│  Roles (4 Tác nhân), Users, Customers, Staffs, Categories, Products,    │
│  StockImportTickets, Carts, CartItems, Orders, OrderItems, Payments,    │
│  ReturnRequests (Đã loại bỏ hoàn toàn bảng Sellers đa nhà bán hàng)     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Biểu đồ Use Case Tổng thể Chuẩn UML 2.5 (Overall Use Case Diagram)

Hệ thống thống nhất **4 Tác nhân chính (Primary Actors)** là con người:
1. **Khách hàng (`Customer`)**
2. **Nhân viên bán hàng (`Sales Staff`)**
3. **Nhân viên kho (`Warehouse Staff`)**
4. **Admin - Chủ cửa hàng (`Admin / Store Owner`)**

Cùng **2 Tác nhân hệ thống ngoài (Secondary Actors)**:
- **Cổng Thanh toán SZ-Payment (`Payment Gateway`)**
- **Dịch vụ AI Gemini RAG (`Gemini AI Service`)**

```mermaid
flowchart LR
    %% Tác nhân chính (Left side)
    Customer(["👤 Khách hàng<br/>(Customer)"])
    Sales(["🎧 Nhân viên bán hàng<br/>(Sales Staff)"])
    Warehouse(["📦 Nhân viên kho<br/>(Warehouse Staff)"])
    Admin(["👑 Admin - Chủ cửa hàng<br/>(Store Owner)"])

    %% Tác nhân phụ (Right side)
    PaymentGW(["💳 Cổng Thanh toán<br/>SZ-Payment"])
    AIService(["🤖 Hệ thống AI<br/>Gemini RAG"])

    subgraph ZSHOP["HỆ THỐNG CỬA HÀNG THƯƠNG MẠI ĐIỆN TỬ 3D & BÁN LẺ ZSHOP"]
        direction TB
        UC01("UC01: Đăng ký, Đăng nhập & Quản lý Nhân sự")
        UC02("UC02: Quản lý Danh mục & Sản phẩm 3D")
        UC03("UC03: Quản lý Khách hàng CRM & Điểm tích lũy VIP")
        UC04("UC04: Bán hàng POS & Đặt hàng Trực tuyến")
        UC04_INC("Thanh toán Đa kênh SZ-Payment")
        UC05("UC05: Quản lý Nhập kho & Kiểm kê Tồn kho")
        UC06("UC06: Báo cáo Doanh thu & Tra cứu Vận đơn")
        UC06_EXT("Xuất báo cáo Excel / PDF")
        UC07("UC07: Tư vấn Mua sắm bằng Trợ lý AI RAG")
        UC07_INC("Truy xuất ngữ cảnh Sản phẩm & Tồn kho CSDL")
        UC08("UC08: AI Khuyến nghị Nhập kho (Stock Copilot)")
        UC09("UC09: AI Hỏi đáp & Phân tích Kinh doanh (AI BI)")
        UC10("UC10: Quản lý Đổi trả & Hoàn tiền")
        UC10_INC("Thu hồi điểm thưởng tích lũy (Points Clawback)")

        %% Quan hệ <<include>> và <<extend>> chuẩn UML 2.5
        UC04 -. "<<include>>" .-> UC04_INC
        UC06_EXT -. "<<extend>>" .-> UC06
        UC07 -. "<<include>>" .-> UC07_INC
        UC10 -. "<<include>>" .-> UC10_INC
    end

    %% Liên kết Tác nhân Khách hàng
    Customer --> UC01
    Customer --> UC02
    Customer --> UC03
    Customer --> UC04
    Customer --> UC06
    Customer --> UC07
    Customer --> UC10

    %% Liên kết Tác nhân Nhân viên bán hàng
    Sales --> UC01
    Sales --> UC03
    Sales --> UC04
    Sales --> UC06
    Sales --> UC10

    %% Liên kết Tác nhân Nhân viên kho
    Warehouse --> UC01
    Warehouse --> UC02
    Warehouse --> UC05
    Warehouse --> UC08

    %% Liên kết Tác nhân Admin (Chủ cửa hàng)
    Admin --> UC01
    Admin --> UC02
    Admin --> UC03
    Admin --> UC05
    Admin --> UC06
    Admin --> UC08
    Admin --> UC09
    Admin --> UC10

    %% Liên kết Tác nhân Hệ thống ngoài
    UC04_INC --> PaymentGW
    UC07_INC --> AIService
    UC08 --> AIService
    UC09 --> AIService
```

---

## 3. Biểu đồ Lớp Thiết kế Chuẩn UML 2.5 (Class Diagram)

Biểu đồ lớp thể hiện rõ mối quan hệ kế thừa / liên kết giữa **Người dùng (`User`)** với **Khách hàng (`Customer`)** và **Nhân sự nội bộ (`Staff`: `SalesStaff`, `WarehouseStaff`, `Admin`)**, cùng các thực thể nghiệp vụ của cửa hàng:

```mermaid
classDiagram
    class Role {
        +int id
        +string name
    }

    class User {
        +int id
        +int roleId
        +string email
        +string password
        +string fullName
        +login(email, password) AuthSession
        +changePassword(oldPass, newPass) boolean
    }

    class Customer {
        +int id
        +int userId
        +string phone
        +string address
        +int loyaltyPoints
        +string membershipTier
        +decimal totalSpent
        +updatePoints(delta, spentDelta) void
    }

    class Staff {
        +int id
        +int userId
        +string staffCode
        +string department
        +string shiftName
        +string status
    }

    class Category {
        +int id
        +string name
    }

    class Product {
        +string id
        +int categoryId
        +string name
        +decimal price
        +int stock
        +string imageUrl
        +deductStock(quantity) void
        +updateStock(newStock) void
    }

    class StockImportTicket {
        +string id
        +string code
        +string supplier
        +int staffUserId
        +int totalQuantity
        +decimal totalCost
        +string status
        +createTicket() void
    }

    class Order {
        +string id
        +int customerId
        +int salesStaffId
        +string orderChannel
        +decimal totalAmount
        +string status
        +createOrder() void
        +cancelOrder() void
    }

    class OrderItem {
        +int id
        +string orderId
        +string productId
        +int quantity
        +decimal unitPrice
    }

    class Payment {
        +string transactionId
        +string orderId
        +string paymentMethod
        +decimal amount
        +string status
        +processPayment() boolean
    }

    class ReturnRequest {
        +string id
        +string orderId
        +int customerId
        +int processedByUserId
        +string reason
        +decimal refundAmount
        +int pointsToDeduct
        +string status
        +approveAndClawbackPoints() void
    }

    Role "1" --> "0..*" User : phân quyền
    User "1" --> "0..1" Customer : là Khách hàng
    User "1" --> "0..1" Staff : là Nhân sự (Admin/Sales/Warehouse)
    Category "1" --> "0..*" Product : phân loại
    Staff "1" --> "0..*" StockImportTicket : lập phiếu nhập (UC05)
    StockImportTicket "1" --> "1..*" Product : cộng tồn kho
    Customer "1" --> "0..*" Order : đặt mua (UC04)
    Staff "0..1" --> "0..*" Order : thu ngân POS (UC04)
    Order "1" *-- "1..*" OrderItem : bao gồm
    Product "1" --> "0..*" OrderItem : tham chiếu
    Order "1" --> "1" Payment : thanh toán qua SZ-Payment
    Order "1" --> "0..*" ReturnRequest : phát sinh đổi trả (UC10)
    Customer "1" --> "0..*" ReturnRequest : yêu cầu hoàn tiền
```

---

## 4. Biểu đồ Trình tự Chuẩn UML 2.5 (Sequence Diagrams)

### 4.1. Biểu đồ Trình tự UC04: Bán hàng POS & Đặt hàng Thanh toán SZ-Payment (`Khách hàng` / `Nhân viên bán hàng`)

```mermaid
sequenceDiagram
    autonumber
    actor Actor as Khách hàng / Nhân viên Bán hàng
    participant UI as Giao diện (CheckoutPage / POSPage)
    participant API as Order & Payment Service
    participant DB as SQL Server (Products, Orders, Customers)
    participant GW as Cổng SZ-Payment (VietQR / VNPAY)

    Actor->>UI: Chọn sản phẩm, kiểm tra giỏ hàng & chọn phương thức thanh toán
    UI->>API: POST /api/orders (items, customerId, channel, paymentMethod)
    API->>DB: Kiểm tra tồn kho (SELECT stock FROM Products WHERE id = @pid)
    alt Tồn kho đủ (stock >= quantity)
        API->>GW: Khởi tạo giao dịch thanh toán (VietQR Napas 247 / POS)
        GW-->>UI: Hiển thị mã QR động (15 phút) / Xác nhận thanh toán
        Actor->>GW: Quét mã QR thanh toán thành công
        GW-->>API: Webhook xác nhận trạng thái PAID (transactionId)
        API->>DB: INSERT Orders, OrderItems, Payments (status = 'PAID')
        API->>DB: UPDATE Products SET stock = stock - @qty (Trừ tồn kho)
        API->>DB: UPDATE Customers SET loyalty_points += @pts (Cộng điểm VIP - UC03)
        DB-->>API: Xác nhận hoàn tất Transaction ACID
        API-->>UI: Trả về Hóa đơn số & Mã vận đơn DH-XXXXXXXX
        UI-->>Actor: Hiển thị Hóa đơn thành công & Điểm thưởng mới
    else Hết hàng trong kho
        DB-->>API: Cảnh báo không đủ tồn kho
        API-->>UI: Trả về lỗi hết hàng
        UI-->>Actor: Thông báo điều chỉnh số lượng
    end
```

### 4.2. Biểu đồ Trình tự UC05 & UC08: AI Khuyến nghị Kho & Lập Phiếu Nhập Kho (`Nhân viên kho` / `Admin`)

```mermaid
sequenceDiagram
    autonumber
    actor WH as Nhân viên Kho / Admin (Chủ cửa hàng)
    participant UI as Giao diện Kho (WarehousePage)
    participant AI as AI Stock Copilot (Gemini RAG - UC08)
    participant DB as SQL Server (Products, StockImportTickets)

    WH->>UI: Truy cập Bàn làm việc Nhân viên Kho & Mở tab AI Khuyến nghị Kho (UC08)
    UI->>DB: Truy vấn danh sách sản phẩm sắp hết hàng (stock <= 40)
    DB-->>UI: Danh sách SKU tồn kho thấp & Tốc độ bán
    UI->>AI: Gửi dữ liệu tồn kho + Yêu cầu phân tích số lượng nhập tối ưu
    AI-->>UI: Đề xuất danh sách sản phẩm & Số lượng cần nhập (Stock Copilot)
    WH->>UI: Bấm "Lập Phiếu Nhập Kho (UC05)" theo gợi ý AI
    UI->>DB: INSERT INTO StockImportTickets (code, supplier, staff_user_id, total_cost)
    UI->>DB: UPDATE Products SET stock = stock + @importQty
    DB-->>UI: Lưu phiếu nhập kho & Cập nhật tồn kho thành công
    UI-->>WH: Hiển thị Phiếu nhập kho hoàn tất & Tồn kho mới
```

### 4.3. Biểu đồ Trình tự UC10: Xử lý Đổi trả, Hoàn tiền & Thu hồi Điểm tích lũy (`Khách hàng` & `Nhân viên bán hàng`)

```mermaid
sequenceDiagram
    autonumber
    actor Cust as Khách hàng
    actor Sales as Nhân viên Bán hàng / Admin
    participant UI as Giao diện Đổi trả (MyOrders / CSKHPortal)
    participant DB as SQL Server (ReturnRequests, Customers, Orders)

    Cust->>UI: Gửi yêu cầu Đổi trả / Hoàn tiền đơn hàng (UC10)
    UI->>DB: INSERT INTO ReturnRequests (status = 'PENDING', points_clawback)
    DB-->>UI: Ghi nhận yêu cầu đổi trả #RET-XXX
    Sales->>UI: Mở Cổng Nhân viên Bán hàng -> Kiểm tra yêu cầu #RET-XXX
    Sales->>UI: Bấm "Phê duyệt Hoàn tiền & Thu hồi điểm (<<include>>)"
    UI->>DB: UPDATE ReturnRequests SET status = 'REFUNDED', processed_by = @salesId
    UI->>DB: UPDATE Customers SET loyalty_points = GREATEST(0, loyalty_points - @points_clawback)
    DB-->>UI: Xác nhận hoàn tiền & Đã trừ điểm tích lũy của Khách hàng
    UI-->>Sales: Thông báo hoàn tất xử lý đổi trả & thu hồi điểm thưởng
    UI-->>Cust: Cập nhật trạng thái đơn hàng Đã hoàn tiền
```
