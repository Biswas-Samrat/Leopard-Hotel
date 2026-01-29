const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');

async function check() {
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT) || 3306,
    };
    const pool = mysql.createPool(config);
    try {
        const [rows] = await pool.query('SHOW CREATE TABLE bookings');
        console.log(rows[0]['Create Table']);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
