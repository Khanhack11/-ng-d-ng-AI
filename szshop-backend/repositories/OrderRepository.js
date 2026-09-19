const { connectDB, sql } = require('../db.config');

class OrderRepository {
    async createOrder(customer_id, total_amount, status) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('customer_id', sql.Int, customer_id)
            .input('total_amount', sql.Decimal(18,2), total_amount)
            .input('status', sql.VarChar(50), status)
            .query('INSERT INTO Orders (customer_id, total_amount, status) OUTPUT INSERTED.id VALUES (@customer_id, @total_amount, @status)');
        return result.recordset[0].id;
    }

    async createOrderItem(order_id, seller_id, product_id, quantity, unit_price, shipping_status) {
        const pool = await connectDB();
        await pool.request()
            .input('order_id', sql.Int, order_id)
            .input('seller_id', sql.Int, seller_id)
            .input('product_id', sql.Int, product_id)
            .input('quantity', sql.Int, quantity)
            .input('unit_price', sql.Decimal(18,2), unit_price)
            .input('shipping_status', sql.VarChar(50), shipping_status)
            .query('INSERT INTO OrderItems (order_id, seller_id, product_id, quantity, unit_price, shipping_status) VALUES (@order_id, @seller_id, @product_id, @quantity, @unit_price, @shipping_status)');
    }

    async updateOrderStatus(id, status) {
        const pool = await connectDB();
        await pool.request()
            .input('id', sql.Int, id)
            .input('status', sql.VarChar(50), status)
            .query('UPDATE Orders SET status = @status WHERE id = @id');
    }

    async getAllOrders() {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT id, status, total_amount as total, created_at as date 
            FROM Orders 
            ORDER BY created_at DESC
        `);
        return result.recordset;
    }
}

module.exports = new OrderRepository();
