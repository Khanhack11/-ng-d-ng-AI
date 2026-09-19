const { connectDB, sql } = require('../db.config');

class CategoryRepository {
    async findCategoryByName(name) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('catName', sql.NVarChar(100), name)
            .query('SELECT id FROM Categories WHERE name = @catName');
        return result.recordset.length > 0 ? result.recordset[0] : null;
    }

    async createCategory(name) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('catName', sql.NVarChar(100), name)
            .query('INSERT INTO Categories (name) OUTPUT INSERTED.id VALUES (@catName)');
        return result.recordset[0].id;
    }

    async getAllCategories() {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM Categories ORDER BY name ASC');
        return result.recordset;
    }
}

module.exports = new CategoryRepository();
