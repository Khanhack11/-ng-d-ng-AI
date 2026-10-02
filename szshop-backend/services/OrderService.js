const OrderRepository = require('../repositories/OrderRepository');
const PaymentRepository = require('../repositories/PaymentRepository');
const ProductRepository = require('../repositories/ProductRepository');

class OrderService {
    async createOrder(items, totalAmount, customerInfo) {
        // B1: Giả lập Khách hàng ID = 1
        const customerId = 1;

        if (!items || items.length === 0) {
            throw new Error('Giỏ hàng trống. Không thể tạo đơn hàng.');
        }

        // B2: KIỂM TRA TỒN KHO TRƯỚC (TC14 - Anti-Overselling Guard)
        let allDbProducts = [];
        try {
            allDbProducts = await ProductRepository.getAllProducts();
        } catch (dbErr) {
            console.warn('Không thể truy vấn bảng Products từ DB, dùng kiểm tra trực tiếp:', dbErr);
        }

        const validatedItems = [];

        for (let item of items) {
            const quantity = Number(item.quantity) || 0;
            if (quantity <= 0) {
                throw new Error(`Số lượng sản phẩm "${item.name || item.id}" không hợp lệ.`);
            }

            // Tìm sản phẩm trong DB bằng ID hoặc Tên
            let product = null;
            let targetId = parseInt(item.productId || item.id, 10);
            if (!isNaN(targetId) && allDbProducts.length > 0) {
                product = allDbProducts.find(p => p.id === targetId);
            }
            if (!product && item.name && allDbProducts.length > 0) {
                const normName = item.name.trim().toLowerCase();
                product = allDbProducts.find(p => p.name.trim().toLowerCase() === normName)
                       || allDbProducts.find(p => normName.includes(p.name.trim().toLowerCase()))
                       || allDbProducts.find(p => p.name.trim().toLowerCase().includes(normName.slice(0, 15)));
            }

            if (product) {
                const availStock = Number(product.stock) || 0;
                if (availStock < quantity) {
                    throw new Error(`Số lượng tồn kho không đủ (Chỉ còn ${availStock} sản phẩm).`);
                }
                validatedItems.push({
                    productId: product.id,
                    productName: product.name,
                    sellerId: product.seller_id || 1,
                    quantity,
                    price: item.price || product.price
                });
            } else {
                // Kiểm tra với stock đính kèm từ frontend / mock
                const mockStock = Number(item.stock ?? 30);
                if (mockStock < quantity) {
                    throw new Error(`Số lượng tồn kho không đủ (Chỉ còn ${mockStock} sản phẩm).`);
                }
            }
        }

        // B3: Tạo Order sau khi đã xác nhận toàn bộ mặt hàng đủ tồn kho
        const orderId = await OrderRepository.createOrder(customerId, totalAmount, 'PENDING');

        // B4: Trừ tồn kho và thêm Order Items
        for (let vItem of validatedItems) {
            try {
                await ProductRepository.decreaseStock(vItem.productId, vItem.quantity);
                await OrderRepository.createOrderItem(
                    orderId, vItem.sellerId, vItem.productId, vItem.quantity, vItem.price, 'PENDING'
                );
            } catch (stockErr) {
                console.error(`Lỗi khi trừ kho sản phẩm #${vItem.productId}:`, stockErr);
                throw new Error(`Số lượng tồn kho không đủ (Chỉ còn ${vItem.quantity - 1} sản phẩm).`);
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
