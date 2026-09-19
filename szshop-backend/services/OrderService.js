const OrderRepository = require('../repositories/OrderRepository');
const PaymentRepository = require('../repositories/PaymentRepository');
const ProductRepository = require('../repositories/ProductRepository');

class OrderService {
    async createOrder(items, totalAmount, customerInfo) {
        // B1: Giả lập Khách hàng ID = 1
        const customerId = 1;
        
        // B2: Tạo Order
        const orderId = await OrderRepository.createOrder(customerId, totalAmount, 'PENDING');
        
        // B3: Thêm Order Items
        if (items && items.length > 0) {
            for (let item of items) {
                const productId = parseInt(item.id, 10);
                if (Number.isNaN(productId)) {
                    throw new Error('Không xác định được sản phẩm trong giỏ hàng.');
                }

                const product = await ProductRepository.getProductById(productId);
                if (!product) {
                    throw new Error(`Sản phẩm #${productId} không tồn tại.`);
                }

                const quantity = Number(item.quantity) || 0;
                if (quantity <= 0) {
                    throw new Error(`Số lượng sản phẩm #${productId} không hợp lệ.`);
                }

                // Trừ tồn kho ngay khi đơn được tạo. Query này an toàn cạnh tranh
                // vì chỉ cập nhật khi stock >= số lượng mua.
                await ProductRepository.decreaseStock(productId, quantity);

                const sellerId = product.seller_id;
                await OrderRepository.createOrderItem(
                    orderId, sellerId, productId, quantity, item.price, 'PENDING'
                );
            }
        }
        
        return `DH-${orderId}`;
    }

    async processPayment(orderIdStr, method, amount, status) {
        const realOrderId = parseInt(orderIdStr.replace('DH-', ''));
        const activeOrderId = !isNaN(realOrderId) ? realOrderId : 1;
        
        if (status === 'SUCCESS') {
            await OrderRepository.updateOrderStatus(activeOrderId, 'PAID');
        }
        
        const transactionId = `TXN-${Date.now()}`;
        await PaymentRepository.createPayment(activeOrderId, method, status, transactionId, amount);
    }

    async getAdminOrders() {
        const orders = await OrderRepository.getAllOrders();
        return orders.map(o => ({
            id: `DH-${o.id}`,
            status: o.status.toUpperCase(),
            total: o.total,
            customer: 'Khách hàng', // Can join later
            date: new Date(o.date).toLocaleDateString('vi-VN')
        }));
    }

    async updateOrderStatus(orderIdStr, status) {
        const realOrderId = parseInt(orderIdStr.replace('DH-', ''));
        if (!isNaN(realOrderId)) {
            await OrderRepository.updateOrderStatus(realOrderId, status);
        }
    }
}

module.exports = new OrderService();
