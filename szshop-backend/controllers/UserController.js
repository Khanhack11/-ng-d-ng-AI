const ProductUserService = require('../services/ProductUserService');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await ProductUserService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserController();
