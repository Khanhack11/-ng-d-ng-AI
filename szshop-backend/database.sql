-- ============================================================================
-- HỆ THỐNG CỬA HÀNG THƯƠNG MẠI ĐIỆN TỬ 3D & BÁN LẺ ZSHOP (SINGLE-STORE MODEL)
-- Mô hình 4 Tác nhân chuẩn UML:
--   1. ADMIN     : Admin (Chủ cửa hàng)
--   2. SALES     : Nhân viên Bán hàng (POS & CSKH)
--   3. WAREHOUSE : Nhân viên Kho
--   4. CUSTOMER  : Khách hàng
-- ============================================================================

-- ==========================================
-- 1. Bảng Phân Quyền (Roles - 4 Tác nhân UML)
-- ==========================================
CREATE TABLE Roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- ('CUSTOMER', 'SALES', 'WAREHOUSE', 'ADMIN')
);

-- ==========================================
-- 2. Bảng Người Dùng Chung (Users - UC01)
-- ==========================================
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    role_id INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- (Hashed password)
    full_name NVARCHAR(255) NULL,
    provider VARCHAR(50) NULL,      -- google | facebook | apple
    provider_user_id VARCHAR(255) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);

CREATE UNIQUE INDEX UQ_Users_ProviderUserId
ON Users(provider, provider_user_id)
WHERE provider IS NOT NULL AND provider_user_id IS NOT NULL;

-- ==========================================
-- 3. Bảng Khách Hàng & Tích Điểm VIP (Customers - UC03)
-- ==========================================
CREATE TABLE Customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    address NVARCHAR(255),
    phone VARCHAR(20),
    loyalty_points INT NOT NULL DEFAULT 0,
    membership_tier NVARCHAR(50) NOT NULL DEFAULT N'Đồng', -- ('Đồng', 'Bạc', 'Vàng', 'Kim Cương')
    total_spent DECIMAL(18,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- ==========================================
-- 4. Bảng Nhân Viên Cửa Hàng (Staffs - UC01)
-- Lưu thông tin Nhân viên Bán hàng (SALES) & Nhân viên Kho (WAREHOUSE)
-- ==========================================
CREATE TABLE Staffs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    staff_code VARCHAR(50) NOT NULL UNIQUE, -- VD: NV-BH01, NV-KH01
    department NVARCHAR(100) NOT NULL,      -- ('Bán hàng POS & CSKH', 'Kho vận & Kiểm kê')
    shift_name NVARCHAR(100) DEFAULT N'Hành chính',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- ==========================================
-- 5. Bảng Danh Mục Sản Phẩm (Categories - UC02)
-- ==========================================
CREATE TABLE Categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL
);

-- ==========================================
-- 6. Bảng Sản Phẩm Cửa Hàng (Products - UC02, UC07, UC08)
-- ==========================================
CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT NOT NULL,
    name NVARCHAR(255) NOT NULL,
    price DECIMAL(18,2) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    image_url VARCHAR(MAX),
    description NVARCHAR(MAX),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- ==========================================
-- 7. Bảng Phiếu Nhập Kho (StockImportTickets - UC05)
-- Do Nhân viên Kho hoặc Admin (Chủ cửa hàng) lập
-- ==========================================
CREATE TABLE StockImportTickets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_code VARCHAR(50) NOT NULL UNIQUE, -- VD: NK-2026-0810
    supplier_name NVARCHAR(255) NOT NULL,
    staff_user_id INT NOT NULL,              -- FK -> Users.id (Nhân viên Kho / Admin)
    total_quantity INT NOT NULL,
    total_cost DECIMAL(18,2) NOT NULL,
    note NVARCHAR(500) NULL,
    import_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (staff_user_id) REFERENCES Users(id)
);

-- ==========================================
-- 8. Bảng Giỏ Hàng & Chi Tiết Giỏ Hàng (Carts & CartItems - UC04)
-- ==========================================
CREATE TABLE Carts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES Customers(id)
);

CREATE TABLE CartItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    size VARCHAR(50) NULL,
    added_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (cart_id) REFERENCES Carts(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- ==========================================
-- 9. Bảng Đơn Hàng & Chi Tiết Đơn Hàng (Orders & OrderItems - UC04, UC06)
-- Phục vụ cả Đơn đặt hàng Online (Customer) và Đơn tại quầy POS (Sales Staff)
-- ==========================================
CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL UNIQUE, -- VD: DH-20260923-01
    customer_id INT NULL,                   -- Khách hàng thành viên (hoặc khách lẻ POS)
    sales_staff_id INT NULL,                -- Nhân viên bán hàng phụ trách (nếu bán POS / xử lý đơn)
    order_channel VARCHAR(20) NOT NULL DEFAULT 'ONLINE', -- ('ONLINE', 'POS')
    total_amount DECIMAL(18,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',       -- ('PENDING', 'PAID', 'PACKING', 'SHIPPING', 'DELIVERED', 'CANCELLED')
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES Customers(id),
    FOREIGN KEY (sales_staff_id) REFERENCES Users(id)
);

CREATE TABLE OrderItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(18,2) NOT NULL,
    size VARCHAR(50) NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- ==========================================
-- 10. Bảng Giao Dịch Thanh Toán Đa Kênh (Payments - UC04)
-- ==========================================
CREATE TABLE Payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- ('VIETQR', 'VNPAY', 'MOMO', 'CARD', 'COD', 'CASH_POS')
    payment_status VARCHAR(50) NOT NULL, -- ('SUCCESS', 'FAILED', 'PENDING')
    transaction_id VARCHAR(100),
    amount DECIMAL(18,2) NOT NULL,
    payment_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES Orders(id)
);

-- ==========================================
-- 11. Bảng Yêu Cầu Đổi Trả & Hoàn Tiền (ReturnRequests - UC10)
-- Xử lý bởi Nhân viên Bán hàng hoặc Admin (Chủ cửa hàng)
-- ==========================================
CREATE TABLE ReturnRequests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    processed_by_user_id INT NULL,       -- Nhân viên bán hàng / Admin duyệt
    reason NVARCHAR(500) NOT NULL,
    refund_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    points_clawback INT NOT NULL DEFAULT 0, -- Điểm tích lũy thu hồi (<<include>> UC10)
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED')
    requested_at DATETIME DEFAULT GETDATE(),
    processed_at DATETIME NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (customer_id) REFERENCES Customers(id),
    FOREIGN KEY (processed_by_user_id) REFERENCES Users(id)
);
