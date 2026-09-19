const { connectDB, sql } = require('../db.config');

class PaymentRepository {
    async createPayment(order_id, payment_method, payment_status, transaction_id, amount) {
        const pool = await connectDB();
        await pool.request()
            .input('order_id', sql.Int, order_id)
            .input('payment_method', sql.VarChar(50), payment_method)
            .input('payment_status', sql.VarChar(50), payment_status)
            .input('transaction_id', sql.VarChar(100), transaction_id)
            .input('amount', sql.Decimal(18,2), amount)
            .query('INSERT INTO Payments (order_id, payment_method, payment_status, transaction_id, amount) VALUES (@order_id, @payment_method, @payment_status, @transaction_id, @amount)');
    }
}

module.exports = new PaymentRepository();
