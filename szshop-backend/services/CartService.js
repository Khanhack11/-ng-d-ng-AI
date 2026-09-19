const cartRepository = require('../repositories/CartRepository');

class CartService {
    async getCart(customerId) {
        return await cartRepository.getCartByCustomerId(customerId);
    }

    async addItem(customerId, itemData) {
        if (!itemData.quantity) {
            throw new Error('Thiếu số lượng sản phẩm');
        }
        return await cartRepository.addItemToCart(customerId, itemData);
    }

    async removeItem(customerId, cartItemId) {
        return await cartRepository.removeItemFromCart(customerId, cartItemId);
    }
}

module.exports = new CartService();
