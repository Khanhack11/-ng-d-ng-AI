const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import our new routes
const apiRoutes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// Use the routes for all /api endpoints
app.use('/api', apiRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend Server đang chạy tại http://localhost:${PORT}`);
});
