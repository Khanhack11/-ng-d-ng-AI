const cartService = require('../services/CartService');

class CartController {
    async getCart(req, res) {
        try {
            const customerId = req.headers['x-customer-id'] || 1; 
            const cartItems = await cartService.getCart(customerId);
            res.json(cartItems);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async addItem(req, res) {
        try {
            const customerId = req.headers['x-customer-id'] || 1;
            const updatedItems = await cartService.addItem(customerId, req.body);
            res.json(updatedItems);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async removeItem(req, res) {
        try {
            const customerId = req.headers['x-customer-id'] || 1;
            const updatedItems = await cartService.removeItem(customerId, req.body.cartItemId);
            res.json(updatedItems);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new CartController();
