const { connectDB } = require('./db.config.js');

async function migrate() {
    const pool = await connectDB();
    if (!pool) {
      console.log('No pool');
      process.exit(1);
    }
    try {
        await pool.request().query(`
            IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'image_url' AND Object_ID = Object_ID(N'Products'))
            BEGIN
                ALTER TABLE Products ADD image_url VARCHAR(MAX)
            END
            
            IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'size' AND Object_ID = Object_ID(N'CartItems'))
            BEGIN
                ALTER TABLE CartItems ADD size VARCHAR(50)
            END

            IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'provider' AND Object_ID = Object_ID(N'Users'))
            BEGIN
                ALTER TABLE Users ADD provider VARCHAR(50) NULL
            END

            IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'provider_user_id' AND Object_ID = Object_ID(N'Users'))
            BEGIN
                ALTER TABLE Users ADD provider_user_id VARCHAR(255) NULL
            END

            IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'approval_status' AND Object_ID = Object_ID(N'Products'))
            BEGIN
                ALTER TABLE Products ADD approval_status VARCHAR(20) NOT NULL CONSTRAINT DF_Products_ApprovalStatus DEFAULT 'PENDING'
            END

            IF NOT EXISTS (
                SELECT * FROM sys.indexes WHERE name = 'UQ_Users_ProviderUserId' AND object_id = OBJECT_ID('Users')
            )
            BEGIN
                CREATE UNIQUE INDEX UQ_Users_ProviderUserId
                ON Users(provider, provider_user_id)
                WHERE provider IS NOT NULL AND provider_user_id IS NOT NULL
            END

            -- Ensure we have roles
            IF NOT EXISTS (SELECT * FROM Roles WHERE name = 'CUSTOMER')
            BEGIN
                INSERT INTO Roles (name) VALUES ('CUSTOMER')
            END
            
            -- Prepare User insert
            DECLARE @roleId INT = (SELECT id FROM Roles WHERE name = 'CUSTOMER');
            
            IF NOT EXISTS (SELECT * FROM Users WHERE email = 'customer@test.com')
            BEGIN
                INSERT INTO Users (role_id, email, password) VALUES (@roleId, 'customer@test.com', '123')
            END
            
            DECLARE @userId INT = (SELECT id FROM Users WHERE email = 'customer@test.com');

            -- Ensure Customer 1
            IF NOT EXISTS (SELECT * FROM Customers WHERE user_id = @userId)
            BEGIN
                INSERT INTO Customers (user_id, address, phone) VALUES (@userId, 'Hanoi', '123')
            END
            
            DECLARE @customerId INT = (SELECT id FROM Customers WHERE user_id = @userId);

            -- Ensure Cart for Customer 1
            IF NOT EXISTS (SELECT * FROM Carts WHERE customer_id = @customerId)
            BEGIN
                INSERT INTO Carts (customer_id) VALUES (@customerId)
            END
        `);
        console.log("Migration successful");
    } catch(e) {
        console.error("Migration failed:", e);
    }
    process.exit();
}
migrate();
