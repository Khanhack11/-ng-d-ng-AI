const { connectDB } = require('./db.config');

async function test() {
    console.log('Testing connection...');
    const pool = await connectDB();
    if (pool) {
        console.log('Test successful!');
        process.exit(0);
    } else {
        console.error('Test failed!');
        process.exit(1);
    }
}

test();
