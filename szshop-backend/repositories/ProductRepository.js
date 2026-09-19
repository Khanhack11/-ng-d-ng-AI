const { connectDB, sql } = require('../db.config');

class ProductRepository {
    async createProduct(seller_id, category_id, name, price, stock, image_url) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('seller_id', sql.Int, seller_id) 
            .input('category_id', sql.Int, category_id)
            .input('name', sql.NVarChar(255), name)
            .input('price', sql.Decimal(18,2), price)
            .input('stock', sql.Int, stock)
            .input('image_url', sql.VarChar(sql.MAX), image_url || null)
            .query(`
                INSERT INTO Products (seller_id, category_id, name, price, stock, image_url, approval_status)
                OUTPUT INSERTED.id
                VALUES (@seller_id, @category_id, @name, @price, @stock, @image_url, 'PENDING')
            `);
        return result.recordset[0].id;
    }

    async getAllProducts() {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT p.*, c.name as categoryName 
            FROM Products p
            LEFT JOIN Categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        `);
        return result.recordset;
    }

    async getProductById(id) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT id, seller_id, name, price, stock
                FROM Products
                WHERE id = @id
            `);
        return result.recordset[0] || null;
    }

    async decreaseStock(productId, quantity) {
        const pool = await connectDB();
        const request = pool.request()
            .input('id', sql.Int, productId)
            .input('qty', sql.Int, quantity);

        const result = await request.query(`
            UPDATE Products
            SET stock = stock - @qty
            OUTPUT INSERTED.id, INSERTED.stock
            WHERE id = @id AND stock >= @qty
        `);

        if (result.recordset.length === 0) {
            throw new Error(`Sản phẩm #${productId} không đủ tồn kho để đặt.`);
        }

        return result.recordset[0];
    }

    async deleteProduct(id) {
        const pool = await connectDB();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Products WHERE id = @id');
    }

    async updateProduct(id, category_id, name, price, stock, image_url) {
        const pool = await connectDB();
        await pool.request()
            .input('id', sql.Int, id)
            .input('category_id', sql.Int, category_id)
            .input('name', sql.NVarChar(255), name)
            .input('price', sql.Decimal(18,2), price)
            .input('stock', sql.Int, stock)
            .input('image_url', sql.VarChar(sql.MAX), image_url || null)
            .query(`
                UPDATE Products 
                SET category_id = @category_id, 
                    name = @name, 
                    price = @price, 
                    stock = @stock, 
                    image_url = @image_url,
                    approval_status = 'PENDING'
                WHERE id = @id
            `);
    }

    async reviewProduct(id, approvalStatus) {
        const pool = await connectDB();
        await pool.request()
            .input('id', sql.Int, id)
            .input('approval_status', sql.VarChar(20), approvalStatus)
            .query(`
                UPDATE Products
                SET approval_status = @approval_status
                WHERE id = @id
            `);
    }
}

module.exports = new ProductRepository();
