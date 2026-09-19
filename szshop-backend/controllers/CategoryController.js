const ProductUserService = require('../services/ProductUserService');

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await ProductUserService.getAllCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CategoryController();
