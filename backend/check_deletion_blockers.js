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
        console.log('--- Rooms with Status "available" but having "pending" or "confirmed" bookings ---');
        const [rows] = await pool.query(`
            SELECT r.id, r.room_number, r.status, b.id as booking_id, b.status as booking_status
            FROM rooms r
            JOIN bookings b ON r.id = b.room_id
            WHERE r.status = 'available' 
            AND b.status IN ('pending', 'confirmed')
        `);
        console.log(rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
