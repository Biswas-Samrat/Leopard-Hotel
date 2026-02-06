const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
const { testConnection } = require('./config/mysql');
const { testConnection: testCloudinary } = require('./config/cloudinary');

// Load env vars
dotenv.config();

// Test database connection
testConnection();

// Test Cloudinary connection
testCloudinary();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Public Routes
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/hospitality', require('./routes/hospitalityRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Admin Routes
app.use('/api/admin/auth', require('./admin/routes/authRoutes'));
app.use('/api/admin/dashboard', require('./admin/routes/dashboardRoutes'));
app.use('/api/admin/rooms', require('./admin/routes/roomRoutes'));
app.use('/api/admin/bookings', require('./admin/routes/bookingRoutes'));
app.use('/api/admin/guests', require('./admin/routes/guestRoutes'));
app.use('/api/admin/upload', require('./admin/routes/uploadRoutes'));
app.use('/api/admin/settings', require('./admin/routes/settingsRoutes'));
app.use('/api/admin/hospitality', require('./admin/routes/hospitalityRoutes'));
app.use('/api/admin/connection', require('./admin/routes/connectionRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT} - Hospitality Routes Active`.yellow.bold
    )
);