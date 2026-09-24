# Thiết kế Cơ sở Dữ liệu & Biểu đồ Thực thể Kết hợp (Database Design & ERD - Chuẩn UML)

## 1. Biểu đồ Thực thể Kết hợp (ERD - Entity Relationship Diagram)

Thiết kế cơ sở dữ liệu quan hệ chuẩn 3NF dành cho **Hệ thống Cửa hàng Thương mại Điện tử 3D & Bán lẻ ZShop (Single-Store Model)** phục vụ đúng **4 Tác nhân UML**: **Admin (Chủ cửa hàng)**, **Nhân viên bán hàng (`SALES`)**, **Nhân viên kho (`WAREHOUSE`)**, và **Khách hàng (`CUSTOMER`)** (loại bỏ hoàn toàn bảng Nhà bán hàng `Sellers` đa gian hàng):

```mermaid
erDiagram
    Roles ||--o{ Users : "phân quyền (1:N)"
    Users ||--o| Customers : "hồ sơ khách hàng (1:1)"
    Users ||--o| Staffs : "hồ sơ nhân sự (1:1)"
    Categories ||--o{ Products : "chứa (1:N)"
    Users ||--o{ StockImportTickets : "nhân viên kho lập phiếu (1:N)"
    Customers ||--o| Carts : "sở hữu (1:1)"
    Carts ||--o{ CartItems : "gồm (1:N)"
    Products ||--o{ CartItems : "nằm trong (1:N)"
    Customers ||--o{ Orders : "đặt mua (1:N)"
    Users ||--o{ Orders : "NV bán hàng xử lý POS (1:N)"
    Orders ||--o{ OrderItems : "chi tiết đơn (1:N)"
    Products ||--o{ OrderItems : "được bán (1:N)"
    Orders ||--o{ Payments : "thanh toán (1:N)"
    Orders ||--o{ ReturnRequests : "yêu cầu đổi trả (1:N)"
    Customers ||--o{ ReturnRequests : "gửi yêu cầu (1:N)"

    Roles {
        int id PK
        varchar name UK "CUSTOMER | SALES | WAREHOUSE | ADMIN"
    }
    Users {
        int id PK
        int role_id FK
        varchar email UK
        varchar password
        nvarchar full_name
        varchar provider
        datetime created_at
    }
    Customers {
        int id PK
        int user_id FK, UK
        nvarchar address
        varchar phone
        int loyalty_points "Điểm tích lũy VIP (UC03)"
        nvarchar membership_tier "Đồng | Bạc | Vàng | Kim Cương"
        decimal total_spent
    }
    Staffs {
        int id PK
        int user_id FK, UK
        varchar staff_code UK "NV-BH01 | NV-KH01"
        nvarchar department "Bán hàng POS | Kho vận"
        varchar status "ACTIVE | LOCKED"
    }
    Categories {
        int id PK
        nvarchar name
    }
    Products {
        int id PK
        int category_id FK
        nvarchar name
        decimal price
        int stock "Số lượng tồn kho"
        varchar image_url
        varchar status "ACTIVE | INACTIVE"
    }
    StockImportTickets {
        int id PK
        varchar ticket_code UK "NK-2026-XXXX (UC05)"
        nvarchar supplier_name
        int staff_user_id FK "Nhân viên kho / Admin"
        int total_quantity
        decimal total_cost
        datetime import_date
    }
    Carts {
        int id PK
        int customer_id FK, UK
        datetime created_at
    }
    CartItems {
        int id PK
        int cart_id FK
        int product_id FK
        int quantity
        varchar size
    }
    Orders {
        int id PK
        varchar order_code UK "DH-YYYYMMDD-XX"
        int customer_id FK
        int sales_staff_id FK "Nhân viên bán hàng (POS/Online)"
        varchar order_channel "ONLINE | POS"
        decimal total_amount
        varchar status "PENDING | PAID | SHIPPING | DELIVERED"
    }
    OrderItems {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }
    Payments {
        int id PK
        int order_id FK
        varchar payment_method "VIETQR | VNPAY | MOMO | COD"
        varchar payment_status "SUCCESS | PENDING | FAILED"
        varchar transaction_id
        decimal amount
    }
    ReturnRequests {
        int id PK
        int order_id FK
        int customer_id FK
        int processed_by_user_id FK "NV Bán hàng / Admin duyệt"
        nvarchar reason
        decimal refund_amount
        int points_clawback "Điểm thu hồi (UC10 Include)"
        varchar status "PENDING | APPROVED | REFUNDED"
    }
```

## 2. Chi tiết Cấu trúc 11 Bảng Vật lý (SQL Server)

1. **`Roles` (Phân quyền 4 Tác nhân UML):** Lưu 4 vai trò chuẩn: `CUSTOMER` (Khách hàng), `SALES` (Nhân viên bán hàng), `WAREHOUSE` (Nhân viên kho), `ADMIN` (Chủ cửa hàng).
2. **`Users` (Tài khoản người dùng - UC01):** Lưu thông tin xác thực (`email`, `password`, `role_id`, `provider`).
3. **`Customers` (Hồ sơ Khách hàng & Điểm VIP - UC03):** Liên kết 1-1 với `Users`, quản lý địa chỉ, SĐT, `loyalty_points`, `membership_tier` và `total_spent`.
4. **`Staffs` (Hồ sơ Nhân sự Cửa hàng - UC01):** Thay thế hoàn toàn bảng `Sellers` cũ. Liên kết 1-1 với `Users` thuộc vai trò `SALES` hoặc `WAREHOUSE`, quản lý mã nhân viên (`staff_code`), bộ phận công tác và ca làm việc.
5. **`Categories` (Danh mục ngành hàng - UC02):** Phân loại sản phẩm của cửa hàng.
6. **`Products` (Sản phẩm cửa hàng - UC02, UC07, UC08):** Lưu trực tiếp danh mục hàng hóa của cửa hàng ZShop (`name`, `price`, `stock`, `image_url`).
7. **`StockImportTickets` (Phiếu nhập kho - UC05):** Lưu lịch sử nhập hàng từ nhà cung cấp do Nhân viên kho hoặc Admin thực hiện.
8. **`Carts` & `CartItems` (Giỏ hàng - UC04):** Lưu giỏ hàng trực tuyến của Khách hàng.
9. **`Orders` & `OrderItems` (Đơn hàng Online & Tại quầy POS - UC04, UC06):** Lưu đơn đặt hàng từ cả 2 kênh `ONLINE` (Khách hàng tự đặt) và `POS` (Nhân viên bán hàng tạo tại quầy).
10. **`Payments` (Giao dịch cổng thanh toán SZ-Payment - UC04):** Đối soát giao dịch VietQR Napas 247, VNPAY, MoMo, Thẻ quốc tế và COD.
11. **`ReturnRequests` (Yêu cầu Đổi trả & Hoàn tiền - UC10):** Lưu yêu cầu đổi trả của Khách hàng, số tiền hoàn (`refund_amount`) và số điểm tích lũy bị thu hồi (`points_clawback`) do Nhân viên bán hàng hoặc Admin xử lý.
