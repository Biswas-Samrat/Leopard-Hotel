const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`MySQL Connected: ${process.env.DB_HOST}`.cyan.underline.bold);
        connection.release();
    } catch (err) {
        console.error(`Error: ${err.message}`.red);
        process.exit(1);
    }
};

module.exports = { pool, testConnection };
