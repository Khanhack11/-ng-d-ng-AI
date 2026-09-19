const { connectDB } = require('./db.config');

async function test() {
    try {
        const pool = await connectDB();
        const result = await pool.request().query("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = 'Users'");
        if (result.recordset[0].count > 0) {
            console.log('✅ Tables exist!');
            const users = await pool.request().query("SELECT COUNT(*) as count FROM Users");
            console.log(`📊 Number of users: ${users.recordset[0].count}`);
        } else {
            console.log('❌ Tables do NOT exist! Please run database.sql');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

test();
