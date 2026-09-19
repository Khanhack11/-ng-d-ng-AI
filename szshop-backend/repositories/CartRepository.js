const { connectDB, sql } = require('../db.config');

class CartRepository {
    async getCartByCustomerId(customerId) {
        const pool = await connectDB();
        if (!pool) throw new Error('Database connection failed');

        // Check/create cart
        let cartResult = await pool.request()
            .input('customerId', sql.Int, customerId)
            .query('SELECT id FROM Carts WHERE customer_id = @customerId');
            
        let cartId;
        if (cartResult.recordset.length === 0) {
            const insertResult = await pool.request()
                .input('customerId', sql.Int, customerId)
                .query('INSERT INTO Carts (customer_id) OUTPUT INSERTED.id VALUES (@customerId)');
            cartId = insertResult.recordset[0].id;
        } else {
            cartId = cartResult.recordset[0].id;
        }

        // Return cart items with product details
        const items = await pool.request()
            .input('cartId', sql.Int, cartId)
            .query(`
                SELECT 
                    ci.id as cartItemId,
                    p.id as id,
                    p.name,
                    p.price,
                    ci.quantity,
                    ci.size,
                    p.image_url as image
                FROM CartItems ci
                INNER JOIN Products p ON ci.product_id = p.id
                WHERE ci.cart_id = @cartId
            `);
        return items.recordset;
    }

    async addItemToCart(customerId, itemData) {
        const pool = await connectDB();
        let cartResult = await pool.request().input('customerId', sql.Int, customerId).query('SELECT id FROM Carts WHERE customer_id = @customerId');
        
        let cartId;
        if (cartResult.recordset.length === 0) {
            const insertResult = await pool.request()
                .input('customerId', sql.Int, customerId)
                .query('INSERT INTO Carts (customer_id) OUTPUT INSERTED.id VALUES (@customerId)');
            cartId = insertResult.recordset[0].id;
        } else {
            cartId = cartResult.recordset[0].id;
        }

        const sizeInput = itemData.size || '';
        
        const checkResult = await pool.request()
            .input('cartId', sql.Int, cartId)
            .input('productId', sql.Int, itemData.id || itemData.product_id)
            .input('size', sql.VarChar, sizeInput)
            .query('SELECT id, quantity FROM CartItems WHERE cart_id = @cartId AND product_id = @productId AND ISNULL(size, \'\') = @size');

        if (checkResult.recordset.length > 0) {
            const existingId = checkResult.recordset[0].id;
            const newQuantity = checkResult.recordset[0].quantity + itemData.quantity;
            await pool.request()
                .input('id', sql.Int, existingId)
                .input('qty', sql.Int, newQuantity)
                .query('UPDATE CartItems SET quantity = @qty WHERE id = @id');
        } else {
            await pool.request()
                .input('cartId', sql.Int, cartId)
                .input('productId', sql.Int, itemData.id || itemData.product_id)
                .input('qty', sql.Int, itemData.quantity)
                .input('size', sql.VarChar, sizeInput)
                .query('INSERT INTO CartItems (cart_id, product_id, quantity, size) VALUES (@cartId, @productId, @qty, @size)');
        }
        
        return this.getCartByCustomerId(customerId);
    }

    async removeItemFromCart(customerId, cartItemId) {
        const pool = await connectDB();
        await pool.request()
            .input('id', sql.Int, cartItemId)
            .query('DELETE FROM CartItems WHERE id = @id');
        return this.getCartByCustomerId(customerId);
    }
}

module.exports = new CartRepository();
