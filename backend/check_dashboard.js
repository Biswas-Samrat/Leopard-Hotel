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
        console.log('--- Room Statuses ---');
        const [rooms] = await pool.query('SELECT id, room_number, status FROM rooms');
        console.log(rooms);

        console.log('\n--- Bookings for rooms ---');
        const [bookings] = await pool.query(`
            SELECT b.id, b.room_id, b.status as booking_status, r.room_number, r.status as room_status
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            WHERE b.status != 'cancelled'
        `);
        console.log(bookings);

        console.log('\n--- Queries in Dashboard ---');
        const [bCount] = await pool.query("SELECT COUNT(*) as total FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE r.status IN ('booked', 'occupied') AND b.status != 'cancelled'");
        console.log('Booking Count Query:', bCount[0].total);

        const [gCount] = await pool.query("SELECT COUNT(DISTINCT guest_id) as total FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE r.status IN ('booked', 'occupied') AND b.status != 'cancelled'");
        console.log('Guest Count Query:', gCount[0].total);

        const [oCount] = await pool.query("SELECT COUNT(*) as total FROM rooms WHERE status IN ('booked', 'occupied')");
        console.log('Occupied Rooms Query:', oCount[0].total);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
