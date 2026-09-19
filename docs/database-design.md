# Thiết kế Cơ sở Dữ liệu (Database Design Document)

## 1. Cấu trúc Các Bảng (Tables)

### 1. `Roles` (Phân quyền)
- `id`: INT IDENTITY(1,1) PRIMARY KEY
- `name`: VARCHAR(50) NOT NULL UNIQUE ('CUSTOMER', 'SELLER', 'ADMIN')

### 2. `Users` (Người dùng)
- `id`: INT IDENTITY(1,1) PRIMARY KEY
- `role_id`: INT NOT NULL (FK -> Roles.id)
- `email`: VARCHAR(255) NOT NULL UNIQUE
- `password`: VARCHAR(255) NOT NULL
- `provider`: VARCHAR(50) NULL (google, facebook, apple)
- `provider_user_id`: VARCHAR(255) NULL

### 3. `Customers` (Khách hàng)
- `id`: INT IDENTITY(1,1) PRIMARY KEY
- `user_id`: INT NOT NULL UNIQUE (FK -> Users.id)
- `address`: NVARCHAR(255)
- `phone`: VARCHAR(20)

### 4. `Sellers` (Nhà bán hàng)
- `id`: INT IDENTITY(1,1) PRIMARY KEY
- `user_id`: INT NOT NULL UNIQUE (FK -> Users.id)
- `shop_name`: NVARCHAR(255) NOT NULL
- `wallet_balance`: DECIMAL(18,2) DEFAULT 0

### 5. `Categories` (Danh mục)
- `id`: INT IDENTITY(1,1) PRIMARY KEY
- `name`: NVARCHAR(100) NOT NULL

### 6. `Products` (Sản phẩm)
- `id`: INT IDENTITY(1,1) PRIMARY KEY
- `seller_id`: INT NOT NULL (FK -> Sellers.id)
- `category_id`: INT NOT NULL (FK -> Categories.id)
- `name`: NVARCHAR(255) NOT NULL
- `price`: DECIMAL(18,2) NOT NULL
- `stock`: INT NOT NULL
- `image_url`: VARCHAR(MAX)
- `approval_status`: VARCHAR(20) DEFAULT 'PENDING' ('PENDING', 'APPROVED', 'REJECTED')
- `created_at`: DATETIME DEFAULT GETDATE()
- `updated_at`: DATETIME DEFAULT GETDATE()

### 7. `Carts` & `CartItems` (Giỏ hàng)
- `Carts`: `id`, `customer_id` (FK)
- `CartItems`: `id`, `cart_id` (FK), `product_id` (FK), `quantity`, `size`

### 8. `Orders` & `OrderItems` (Đơn hàng)
- `Orders`: `id`, `customer_id` (FK), `total_amount`, `status` ('PENDING', 'PAID', 'SHIPPING', 'DELIVERED')
- `OrderItems`: `id`, `order_id` (FK), `seller_id` (FK), `product_id` (FK), `quantity`, `unit_price`, `shipping_status`

## 2. Các Chỉ mục Tối ưu (Indexes)
- `CREATE INDEX IX_Products_CategoryId ON Products(category_id)`
- `CREATE INDEX IX_Products_Price ON Products(price)`
- `CREATE INDEX IX_Products_ApprovalStatus ON Products(approval_status)`
- `CREATE UNIQUE INDEX UQ_Users_Email ON Users(email)`
