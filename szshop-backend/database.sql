-- ==========================================
-- 1. Bảng Phân Quyền (Roles)
-- ==========================================
CREATE TABLE Roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- ==========================================
-- 2. Bảng Người Dùng Chung (Users)
-- ==========================================
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    role_id INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- (Hashed password)
    provider VARCHAR(50) NULL,      -- google | facebook | apple
    provider_user_id VARCHAR(255) NULL,
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);

CREATE UNIQUE INDEX UQ_Users_ProviderUserId
ON Users(provider, provider_user_id)
WHERE provider IS NOT NULL AND provider_user_id IS NOT NULL;

-- ==========================================
-- 3. Bảng Khách Hàng (Customers)
-- ==========================================
CREATE TABLE Customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    address NVARCHAR(255),
    phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- ==========================================
-- 4. Bảng Nhà Bán Hàng (Sellers)
-- ==========================================
CREATE TABLE Sellers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    shop_name NVARCHAR(255) NOT NULL,
    wallet_balance DECIMAL(18,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- ==========================================
-- 5. Bảng Danh Mục Sản Phẩm (Categories)
-- ==========================================
CREATE TABLE Categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL
);

-- ==========================================
-- 6. Bảng Sản Phẩm (Products)
-- ==========================================
CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    seller_id INT NOT NULL,
    category_id INT, 
    name NVARCHAR(255) NOT NULL,
    price DECIMAL(18,2) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (seller_id) REFERENCES Sellers(id),
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- ==========================================
-- 7. Bảng Giỏ Hàng (Carts)
-- Mối quan hệ 1-1 hoặc 1-N với Khách hàng
-- ==========================================
CREATE TABLE Carts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL UNIQUE, -- Giả sử mỗi khách có 1 giỏ hàng active
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES Customers(id)
);

-- ==========================================
-- 8. Bảng Sản Phẩm Trong Giỏ Hàng (CartItems)
-- Mối quan hệ N-1 với Carts và N-1 với Products
-- ==========================================
CREATE TABLE CartItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (cart_id) REFERENCES Carts(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- ==========================================
-- 9. Bảng Đơn Hàng Gốc (Orders - Parent Order)
-- ==========================================
CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    total_amount DECIMAL(18,2) NOT NULL,
    status VARCHAR(50) NOT NULL, -- (Pending, Paid, Cancelled, v.v.)
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES Customers(id)
);

-- ==========================================
-- 10. Bảng Kiện Hàng/Chi Tiết (OrderItems - Sub Order)
-- ==========================================
CREATE TABLE OrderItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    seller_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(18,2) NOT NULL,
    shipping_status VARCHAR(50) NOT NULL, -- Trạng thái vận chuyển của Shop
    commission_fee DECIMAL(18,2),         -- Phí hoa hồng sàn thu
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (seller_id) REFERENCES Sellers(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- ==========================================
-- 11. Bảng Lịch Sử Thanh Toán (Payments)
-- Lưu vết giao dịch qua cổng thanh toán
-- ==========================================
CREATE TABLE Payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- (COD, VNPay, Momo, Credit Card)
    payment_status VARCHAR(50) NOT NULL, -- (Success, Failed, Pending)
    transaction_id VARCHAR(100),         -- Mã giao dịch từ cổng thanh toán trả về
    amount DECIMAL(18,2) NOT NULL,
    payment_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES Orders(id)
);
