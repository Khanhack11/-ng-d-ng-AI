const OrderService = require('../services/OrderService');

class PaymentController {
    async createPayment(req, res) {
        try {
            const { order_id, method, amount, status } = req.body;
            await OrderService.processPayment(order_id, method, amount, status);
            res.json({ success: true });
        } catch (error) {
            console.error('Lỗi API payments:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PaymentController();
