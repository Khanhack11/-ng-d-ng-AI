const UserRepository = require('../repositories/UserRepository');
const ProductRepository = require('../repositories/ProductRepository');
const CategoryRepository = require('../repositories/CategoryRepository');

class ProductUserService {
    async getAllUsers() {
        return await UserRepository.getAllUsers();
    }

    async createProduct(name, price, stock, categoryName, image_url) {
        let categoryId = null;
        if (categoryName) {
            let category = await CategoryRepository.findCategoryByName(categoryName);
            if (category) {
                categoryId = category.id;
            } else {
                categoryId = await CategoryRepository.createCategory(categoryName);
            }
        }
        
        const sellerId = 1; // dummy seller default from legacy code
        const productId = await ProductRepository.createProduct(sellerId, categoryId, name, price, stock, image_url);
        return productId;
    }

    async getAllProducts() {
        return await ProductRepository.getAllProducts();
    }

    async reviewProduct(idString, approvalStatus) {
        const realId = parseInt(idString.replace('SP-', ''));
        if (isNaN(realId)) {
            throw new Error('ID sản phẩm không hợp lệ');
        }
        const allowed = ['APPROVED', 'REJECTED'];
        if (!allowed.includes(approvalStatus)) {
            throw new Error('Trạng thái duyệt không hợp lệ');
        }
        await ProductRepository.reviewProduct(realId, approvalStatus);
    }

    async deleteProduct(idString) {
        const realId = parseInt(idString.replace('SP-', ''));
        if (!isNaN(realId)) {
            await ProductRepository.deleteProduct(realId);
        }
    }

    async updateProduct(idString, name, price, stock, categoryName, image_url) {
        const id = parseInt(idString.replace('SP-', ''));
        if (isNaN(id)) throw new Error(`ID sản phẩm "${idString}" không hợp lệ (Không phải dạng số). Hãy kiểm tra xem đây có phải sản phẩm mẫu không.`);

        let categoryId = null;
        if (categoryName) {
            let category = await CategoryRepository.findCategoryByName(categoryName);
            if (category) {
                categoryId = category.id;
            } else {
                categoryId = await CategoryRepository.createCategory(categoryName);
            }
        }

        await ProductRepository.updateProduct(id, categoryId, name, price, stock, image_url);
    }

    async getAllCategories() {
        return await CategoryRepository.getAllCategories();
    }
}

module.exports = new ProductUserService();
