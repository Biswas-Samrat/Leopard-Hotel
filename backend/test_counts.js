const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');

async function test() {
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT) || 3306,
    };
    console.log('Config:', { ...config, password: '****' });

    const pool = mysql.createPool(config);
    try {
        const [rows] = await pool.query('SELECT status, COUNT(*) as count FROM rooms GROUP BY status');
        console.log('Room statuses:', rows);

        const [bookings] = await pool.query("SELECT COUNT(*) as total FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE r.status IN ('booked', 'occupied') AND b.status != 'cancelled'");
        console.log('Active Bookings Query Result:', bookings[0].total);

        const [guests] = await pool.query("SELECT COUNT(DISTINCT guest_id) as total FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE r.status IN ('booked', 'occupied') AND b.status != 'cancelled'");
        console.log('Active Guests Query Result:', guests[0].total);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

test();
