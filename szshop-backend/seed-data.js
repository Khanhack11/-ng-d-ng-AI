const { connectDB, sql } = require('./db.config');

async function seed() {
  console.log('Connecting to database...');
  const pool = await connectDB();
  if (!pool) {
    console.error('Cannot connect to DB');
    process.exit(1);
  }

  // Ensure Role
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM Roles WHERE name = 'CUSTOMER')
      INSERT INTO Roles (name) VALUES ('CUSTOMER');
    IF NOT EXISTS (SELECT * FROM Roles WHERE name = 'SELLER')
      INSERT INTO Roles (name) VALUES ('SELLER');
    IF NOT EXISTS (SELECT * FROM Roles WHERE name = 'ADMIN')
      INSERT INTO Roles (name) VALUES ('ADMIN');
  `);

  // Ensure default Users (CUSTOMER, SELLER, ADMIN)
  await pool.request().query(`
    DECLARE @custRoleId INT = (SELECT TOP 1 id FROM Roles WHERE name = 'CUSTOMER');
    DECLARE @sellerRoleId INT = (SELECT TOP 1 id FROM Roles WHERE name = 'SELLER');
    DECLARE @adminRoleId INT = (SELECT TOP 1 id FROM Roles WHERE name = 'ADMIN');

    IF NOT EXISTS (SELECT * FROM Users WHERE email = 'customer@test.com')
      INSERT INTO Users (role_id, email, password) VALUES (@custRoleId, 'customer@test.com', '123');

    IF NOT EXISTS (SELECT * FROM Users WHERE email = 'seller@test.com')
      INSERT INTO Users (role_id, email, password) VALUES (@sellerRoleId, 'seller@test.com', '123');

    IF NOT EXISTS (SELECT * FROM Users WHERE email = 'admin@test.com')
      INSERT INTO Users (role_id, email, password) VALUES (@adminRoleId, 'admin@test.com', '123');
  `);

  const userRes = await pool.request().query("SELECT TOP 1 id FROM Users WHERE email = 'seller@test.com'");
  const sellerUserId = userRes.recordset.length > 0 ? userRes.recordset[0].id : 1;

  // Ensure Seller
  const sellerCheck = await pool.request().input('uid', sql.Int, sellerUserId).query("SELECT id FROM Sellers WHERE user_id = @uid");
  let sellerId;
  if (sellerCheck.recordset.length === 0) {
    const sRes = await pool.request().input('uid', sql.Int, sellerUserId).query(`
      INSERT INTO Sellers (user_id, shop_name, wallet_balance) 
      OUTPUT INSERTED.id 
      VALUES (@uid, N'ZShop Official Store', 10000000)
    `);
    sellerId = sRes.recordset[0].id;
  } else {
    sellerId = sellerCheck.recordset[0].id;
  }

  // Categories
  const categories = [
    'Thời trang nam',
    'Áo khoác & Hoodie',
    'Giày dép',
    'Phụ kiện',
    'Túi xách'
  ];

  for (const c of categories) {
    await pool.request()
      .input('name', sql.NVarChar, c)
      .query(`
        IF NOT EXISTS (SELECT id FROM Categories WHERE name = @name)
          INSERT INTO Categories (name) VALUES (@name);
      `);
  }

  // Products
  const products = [
    { name: 'Áo Thun DIOR - Chính Hãng', price: 1889000, cat: 'Thời trang nam', stock: 58, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { name: 'Quần Jeans Slimfit Rách Gối', price: 550000, cat: 'Thời trang nam', stock: 120, img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400' },
    { name: 'Áo Hoodie Streetwear Unisex', price: 420000, cat: 'Áo khoác & Hoodie', stock: 45, img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400' },
    { name: 'Giày Sneaker Cổ Thấp Basic', price: 890000, cat: 'Giày dép', stock: 30, img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
    { name: 'Đồng Hồ Nam Dây Da Cổ Điển', price: 1250000, cat: 'Phụ kiện', stock: 25, img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400' },
    { name: 'Túi Đeo Chéo Canvas Mini', price: 290000, cat: 'Túi xách', stock: 80, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
    { name: 'Mũ Lưỡi Trai NY Phong Cách', price: 150000, cat: 'Phụ kiện', stock: 200, img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400' },
    { name: 'Kính Mát Chống Tia UV Đi Biển', price: 320000, cat: 'Phụ kiện', stock: 65, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400' }
  ];

  for (const p of products) {
    const catRes = await pool.request()
      .input('cname', sql.NVarChar, p.cat)
      .query('SELECT TOP 1 id FROM Categories WHERE name = @cname');
    const catId = catRes.recordset[0]?.id || 1;

    const pExist = await pool.request()
      .input('pname', sql.NVarChar, p.name)
      .query('SELECT id FROM Products WHERE name = @pname');

    if (pExist.recordset.length === 0) {
      await pool.request()
        .input('sid', sql.Int, sellerId)
        .input('cid', sql.Int, catId)
        .input('name', sql.NVarChar, p.name)
        .input('price', sql.Decimal(18,2), p.price)
        .input('stock', sql.Int, p.stock)
        .input('img', sql.VarChar(sql.MAX), p.img)
        .query(`
          INSERT INTO Products (seller_id, category_id, name, price, stock, image_url, approval_status) 
          VALUES (@sid, @cid, @name, @price, @stock, @img, 'APPROVED')
        `);
      console.log('Inserted product:', p.name);
    }
  }

  console.log('✅ Dữ liệu mẫu đã được nạp thành công vào SQL Server!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Lỗi khi nạp dữ liệu:', err);
  process.exit(1);
});
