const OrderService = require('../services/OrderService');

class OrderController {
    async createOrder(req, res) {
        try {
            const { items, total_amount, customerInfo } = req.body;
            const orderIdStr = await OrderService.createOrder(items, total_amount, customerInfo);
            res.json({ success: true, orderId: orderIdStr });
        } catch (error) {
            console.error('Lỗi API orders:', error);
            // TC14: HTTP 400 khi số lượng tồn kho không đủ
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async getOrders(req, res) {
        try {
            const orders = await OrderService.getAdminOrders();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await OrderService.updateOrderStatus(id, status);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new OrderController();
