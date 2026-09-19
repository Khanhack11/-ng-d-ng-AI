const sql = require('mssql');

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'Huyvinh123@',
    server: process.env.DB_SERVER || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '53504', 10),
    database: process.env.DB_NAME || 'He_Thong_Thuong_Mai',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let poolInstance = null;

const connectDB = async () => {
    try {
        if (poolInstance && poolInstance.connected) {
            return poolInstance;
        }
        poolInstance = await sql.connect(config);
        console.log('✅ Kết nối SQL Server thành công!');
        return poolInstance;
    } catch (err) {
        console.error('❌ Kết nối SQL Server thất bại:', err.message);
        poolInstance = null;
        return null;
    }
};

module.exports = {
    sql,
    connectDB
};
