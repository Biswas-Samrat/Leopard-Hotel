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
        console.log('--- Bookings and Guests ---');
        const [rows] = await pool.query(`
            SELECT b.id as booking_id, b.room_id, g.id as guest_id, g.name, g.email, g.phone 
            FROM bookings b 
            JOIN guests g ON b.guest_id = g.id
            WHERE b.status != 'cancelled'
        `);
        console.log(rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
