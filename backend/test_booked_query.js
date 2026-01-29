const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');

async function testQuery() {
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT) || 3306,
    };
    const pool = mysql.createPool(config);
    try {
        const query = `SELECT r.*, b.check_in, b.check_out, b.num_guests, b.special_requests, g.name as guest_name, g.email as guest_email, g.phone as guest_phone
             FROM rooms r
             LEFT JOIN bookings b ON r.id = b.room_id 
                AND b.id = (
                    SELECT id FROM bookings 
                    WHERE room_id = r.id 
                    AND status != 'cancelled' 
                    ORDER BY created_at DESC 
                    LIMIT 1
                )
             LEFT JOIN guests g ON b.guest_id = g.id
             WHERE r.status IN ('booked', 'occupied', 'Booked')`;

        console.log('Query:', query);
        const [rooms] = await pool.query(query);
        console.log('Result:', JSON.stringify(rooms, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

testQuery();
