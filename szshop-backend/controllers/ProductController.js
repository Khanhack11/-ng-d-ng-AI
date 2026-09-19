const ProductUserService = require('../services/ProductUserService');

class ProductController {
    async createProduct(req, res) {
        try {
            const { name, price, stock, category, image_url } = req.body;
            const productId = await ProductUserService.createProduct(name, price, stock, category, image_url);
            res.json({ success: true, id: productId });
        } catch (error) {
            console.error('Lỗi API thêm sản phẩm:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await ProductUserService.getAllProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await ProductUserService.deleteProduct(id);
            res.json({ success: true });
        } catch (error) {
            console.error('Lỗi API khóa ngoại xóa sản phẩm:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, price, stock, category, images } = req.body;
            // images là mảng, lấy phần tử đầu tiên là image_url
            const image_url = Array.isArray(images) ? images[0] : images;
            
            await ProductUserService.updateProduct(id, name, price, stock, category, image_url);
            res.json({ success: true });
        } catch (error) {
            console.error('Lỗi API cập nhật sản phẩm:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async reviewProduct(req, res) {
        try {
            const { id } = req.params;
            const { approvalStatus } = req.body;
            await ProductUserService.reviewProduct(id, approvalStatus);
            res.json({ success: true });
        } catch (error) {
            console.error('Lỗi API duyệt sản phẩm:', error);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();
