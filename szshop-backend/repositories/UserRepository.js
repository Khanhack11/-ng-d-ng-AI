const { connectDB } = require('../db.config');

class UserRepository {
    async getAllUsers() {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM Users');
        return result.recordset;
    }

    async findByEmail(email) {
        const pool = await connectDB();
        if (!pool) return null;
        const result = await pool.request()
            .input('email', email)
            .query(`
                SELECT u.*, r.name as role_name 
                FROM Users u 
                LEFT JOIN Roles r ON u.role_id = r.id 
                WHERE u.email = @email
            `);
        return result.recordset[0];
    }

    async findByProviderUserId(provider, providerUserId) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('provider', provider)
            .input('provider_user_id', providerUserId)
            .query(`
                SELECT u.*, r.name as role_name 
                FROM Users u 
                LEFT JOIN Roles r ON u.role_id = r.id 
                WHERE u.provider = @provider AND u.provider_user_id = @provider_user_id
            `);
        return result.recordset[0];
    }

    async createUser(email, password, role_id) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('email', email)
            .input('password', password)
            .input('role_id', role_id)
            .query(`
                INSERT INTO Users (email, password, role_id) 
                VALUES (@email, @password, @role_id);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        const newUserId = result.recordset[0].id;

        // Auto-create customer profile and cart for CUSTOMER (role_id = 1)
        if (role_id === 1) {
            try {
                const custRes = await pool.request()
                    .input('userId', newUserId)
                    .query(`
                        INSERT INTO Customers (user_id, address, phone)
                        OUTPUT INSERTED.id
                        VALUES (@userId, N'Việt Nam', '');
                    `);
                const customerId = custRes.recordset[0].id;
                await pool.request()
                    .input('customerId', customerId)
                    .query(`
                        INSERT INTO Carts (customer_id) VALUES (@customerId);
                    `);
            } catch (err) {
                console.warn('Lỗi tạo Customer/Cart khi register:', err.message);
            }
        } else if (role_id === 2) {
            // SELLER
            try {
                await pool.request()
                    .input('userId', newUserId)
                    .query(`
                        INSERT INTO Sellers (user_id, shop_name, wallet_balance)
                        VALUES (@userId, N'Gian hàng ZShop Mới', 0);
                    `);
            } catch (err) {
                console.warn('Lỗi tạo Seller khi register:', err.message);
            }
        }

        return newUserId;
    }

    async findOrCreateSocialUser({ email, provider, providerUserId }) {
        const existingByProvider = await this.findByProviderUserId(provider, providerUserId);
        if (existingByProvider) {
            return existingByProvider;
        }

        const safeEmail = email || `${providerUserId}@${provider}.local`;
        const existing = await this.findByEmail(safeEmail);
        if (existing) {
            await this.attachProviderToUser(existing.id, provider, providerUserId);
            existing.provider = provider;
            existing.provider_user_id = providerUserId;
            return existing;
        }

        // Social users default to CUSTOMER (role_id = 1)
        const pool = await connectDB();
        let roleId = 1;
        const roleRes = await pool.request().query("SELECT TOP 1 id FROM Roles WHERE name = 'CUSTOMER'");
        if (roleRes.recordset.length > 0) {
            roleId = roleRes.recordset[0].id;
        }

        const randomPassword = `SOCIAL_${provider}_${providerUserId}_${Date.now()}`;
        const newId = await this.createSocialUser(safeEmail, randomPassword, roleId, provider, providerUserId);
        
        // Ensure Customer and Cart exist in database
        try {
            const custRes = await pool.request()
                .input('userId', newId)
                .query(`
                    IF NOT EXISTS (SELECT id FROM Customers WHERE user_id = @userId)
                    BEGIN
                        INSERT INTO Customers (user_id, address, phone)
                        OUTPUT INSERTED.id
                        VALUES (@userId, N'Việt Nam', '');
                    END
                    ELSE
                    BEGIN
                        SELECT id FROM Customers WHERE user_id = @userId;
                    END
                `);
            const customerId = custRes.recordset[0]?.id;
            if (customerId) {
                await pool.request()
                    .input('customerId', customerId)
                    .query(`
                        IF NOT EXISTS (SELECT id FROM Carts WHERE customer_id = @customerId)
                        BEGIN
                            INSERT INTO Carts (customer_id) VALUES (@customerId);
                        END
                    `);
            }
        } catch (e) {
            console.warn('Lỗi tạo customer/cart cho social user:', e.message);
        }

        return {
            id: newId,
            email: safeEmail,
            role_id: roleId,
            role_name: 'CUSTOMER',
            provider,
            provider_user_id: providerUserId
        };
    }

    async attachProviderToUser(userId, provider, providerUserId) {
        const pool = await connectDB();
        await pool.request()
            .input('id', userId)
            .input('provider', provider)
            .input('provider_user_id', providerUserId)
            .query(`
                UPDATE Users
                SET provider = @provider, provider_user_id = @provider_user_id
                WHERE id = @id
            `);
    }

    async createSocialUser(email, password, role_id, provider, providerUserId) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('email', email)
            .input('password', password)
            .input('role_id', role_id)
            .input('provider', provider)
            .input('provider_user_id', providerUserId)
            .query(`
                INSERT INTO Users (email, password, role_id, provider, provider_user_id) 
                VALUES (@email, @password, @role_id, @provider, @provider_user_id);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    }
}

module.exports = new UserRepository();
