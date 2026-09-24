const { connectDB, sql } = require('./db.config');

async function seed() {
  console.log('Connecting to database...');
  const pool = await connectDB();
  if (!pool) {
    console.error('Cannot connect to DB');
    process.exit(1);
  }

  // Ensure 4 UML Actor Roles: CUSTOMER, SALES, WAREHOUSE, ADMIN
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM Roles WHERE name = 'CUSTOMER')
      INSERT INTO Roles (name) VALUES ('CUSTOMER');
    IF NOT EXISTS (SELECT * FROM Roles WHERE name = 'SALES')
      INSERT INTO Roles (name) VALUES ('SALES');
    IF NOT EXISTS (SELECT * FROM Roles WHERE name = 'WAREHOUSE')
      INSERT INTO Roles (name) VALUES ('WAREHOUSE');
    IF NOT EXISTS (SELECT * FROM Roles WHERE name = 'ADMIN')
      INSERT INTO Roles (name) VALUES ('ADMIN');
  `);

  // Ensure default Users for the 4 UML Actors
  await pool.request().query(`
    DECLARE @custRoleId INT = (SELECT TOP 1 id FROM Roles WHERE name = 'CUSTOMER');
    DECLARE @salesRoleId INT = (SELECT TOP 1 id FROM Roles WHERE name = 'SALES');
    DECLARE @warehouseRoleId INT = (SELECT TOP 1 id FROM Roles WHERE name = 'WAREHOUSE');
    DECLARE @adminRoleId INT = (SELECT TOP 1 id FROM Roles WHERE name = 'ADMIN');

    IF NOT EXISTS (SELECT * FROM Users WHERE email = 'customer@test.com')
      INSERT INTO Users (role_id, email, password) VALUES (@custRoleId, 'customer@test.com', '123');

    IF NOT EXISTS (SELECT * FROM Users WHERE email = 'sales@test.com')
      INSERT INTO Users (role_id, email, password) VALUES (@salesRoleId, 'sales@test.com', '123');

    IF NOT EXISTS (SELECT * FROM Users WHERE email = 'warehouse@test.com')
      INSERT INTO Users (role_id, email, password) VALUES (@warehouseRoleId, 'warehouse@test.com', '123');

    IF NOT EXISTS (SELECT * FROM Users WHERE email = 'admin@test.com')
      INSERT INTO Users (role_id, email, password) VALUES (@adminRoleId, 'admin@test.com', '123');
  `);

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

  console.log('✅ Dữ liệu mẫu 4 Tác nhân UML (Customer, Sales, Warehouse, Admin) đã được nạp thành công vào SQL Server!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Lỗi khi nạp dữ liệu:', err);
  process.exit(1);
});
